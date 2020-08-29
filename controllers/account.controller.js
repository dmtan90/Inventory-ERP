/* eslint-disable no-useless-return */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');

// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.emailUser,
//     pass: process.env.emailPass,
//   },
// });

const {
  transporter,
  registerVerificationEmail,
  passwordResetEmail,
} = require('../utils/email.messages');

const {
  registerValidation,
  checkEmailValidation,
  loginValidation,
  changePasswordValidation,
  passwordResetValidation,
  catchError,
} = require('../utils/validation');
const { AccountModel } = require('../models/account.model');
const { getAccount } = require('../services/account');

const validation = {
  register: registerValidation,
  login: loginValidation,
  checkEmail: checkEmailValidation,
  passwordChange: changePasswordValidation,
  resetPassword: passwordResetValidation,
};

const handleValidation = async (body, res, type) => {
  const { error } = await validation[type](body);
  if (error) {
    // throw Error(error.details[0].message);
    console.log(error);
    return res.status(422).json({
      success: false,
      message: 'Validation Errors',
      errors: error.details[0].message,
    });
  }
};

//email,pass
module.exports.login = async (req, res, next) => {
  // validate
  const validate = await handleValidation(req.body, res, 'login');
  // return validate result
  if (validate != null) return validate;
  try {
    // check if account exist
    const account = await getAccount({ email: req.body.email });
    if (!account) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Credentials',
      });
    }
    // compare password
    const validPass = account.comparePassword(
      req.body.password,
      account.password
    );
    // invalid password
    if (!validPass) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Credentials',
      });
    }
    // check if account is verify
    if (!account.isVerify) {
      return res.status(400).json({
        success: false,
        message: 'Kindly verify your account.. redirect to verification page',
      });
    }
    // check if account is active
    if (!account.isActive) {
      return res.status(400).json({
        success: false,
        message:
          'Kindly activate your account contact our support.. redirect to support page',
      });
    }
    // Proceed to login
    if (account.isActive && account.isVerify && validPass) {
      // regenerate auth token for login and authorization
      const authToken = account.generateAuthToken(process.env.tokenExpire);

      return res.status(200).json({
        success: true,
        message: 'Login Succeccful',
        token: authToken,
      });
    }
  } catch (err) {
    return catchError(err, res);
  }
};

// Regsiter Controller
module.exports.register = async (req, res, next) => {
  try {
    // validate
    const validate = await handleValidation(req.body, res, 'register');
    // return validate result
    if (validate != null) return validate;

    // check if user exist
    let account = await AccountModel.find({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    }).exec();
    if (account.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: 'User Already Exist' });
    }

    account = new AccountModel();
    let data = {};
    for (const key in req.body) {
      data[key] = req.body[key];
    }
    data['_id'] = new mongoose.Types.ObjectId();
    data.password = account.encryptPassword(data.password);
    // save data
    const saveData = await new AccountModel(data).save();
    saveData['verifyToken'] = saveData.generateAuthToken('1h');
    saveData['verifyPin'] = saveData.generateVerifyPin();
    const newdata = await new AccountModel(saveData).save();
    if (newdata) {
      // send verification mail
      verifyUrl = `${process.env.appUrl}:${process.env.PORT}/api/account/verify/${newdata.verifyToken}`;
      await transporter.sendMail(
        registerVerificationEmail(
          newdata.email,
          verifyUrl,
          newdata.verifyPin,
          'Verify Account'
        )
      );

      return res.status(200).json({
        success: true,
        message: 'registraion successful check your mail for verification',
      });
    }
  } catch (err) {
    return catchError(err, res);
  }
};

// Verify registration with token
module.exports.verifyRegistration = async (req, res, next) => {
  const token = req.params.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token not provided',
    });
  }
  try {
    // decode token
    const decoded = jwt.verify(token, process.env.jwtSecret);

    // get account
    const account = await getAccount({
      _id: decoded._id,
      email: decoded.email,
    });
    // cjeck if account is verify
    if (account.isVerify) {
      return res.status(200).json({
        success: true,
        message: 'Account already verified',
      });
    }

    // check if token == saved token
    if (account.verifyToken !== token) {
      return res.status(200).json({
        success: true,
        message: 'Invalid Token',
      });
    }

    // verify account and upadte data
    account.isVerify = true;
    account.isActive = true;
    account.verifyToken = null;

    // regenerate auth token for login and authorization
    const authToken = account.generateAuthToken(process.env.tokenExpire);

    // update data
    await new AccountModel(account).save();

    return res.status(200).json({
      success: true,
      message: 'Verification Succeccful',
      token: authToken,
    });
  } catch (err) {
    return catchError(err, res);
  }
};

// Resend Verification token to email
module.exports.resendVerificationToken = async (req, res, next) => {
  try {
    // validate
    const validate = await handleValidation(req.body, res, 'checkEmail');

    // return validate result
    if (validate != null) return validate;

    // get email details
    const account = await getAccount({ email: req.body.email });

    // email does not exist
    if (!account) {
      return res.status(200).json({
        success: true,
        message:
          "if we found an account associated with tha email address, we've sent verifcation instruction to the primary email addresson the account",
      });
    }

    // check if account has been verify
    if (account.isVerify) {
      return res.status(200).json({
        success: true,
        message: 'account has already been verified',
      });
    }
    // resend verification mail and update account token
    // regenerate token
    account.verifyToken = account.generateAuthToken('1h');
    account.verifyPin = account.generateVerifyPin();
    // update account details with new token
    const saveData = await new AccountModel(account).save();
    verifyUrl = `${process.env.appUrl}:${process.env.PORT}/api/account/verify/${saveData.verifyToken}`;
    //  resend verification mail
    await transporter.sendMail(
      registerVerificationEmail(
        saveData.email,
        verifyUrl,
        saveData.verifyPin,
        'Verify Account'
      )
    );

    return res.status(200).json({
      success: true,
      message:
        "if we found an account associated with tha email address, we've sent verifcation instruction to the primary email addresson the account",
    });
  } catch (err) {
    return catchError(err, res);
  }
};

//send password  reset  token
module.exports.sendPasswordResetToken = async (req, res, next) => {
  console.log(req.body);
  // validate
  let validate = await handleValidation(req.body, res, 'checkEmail');

  // return validate result
  if (validate != null) return validate;

  // get account details
  let account = await getAccount({ email: req.body.email });

  try {
    // email does not exist
    if (!account) {
      return res.status(200).json({
        success: true,
        message:
          "if we found an account associated with tha email address, we've sent verifcation instruction to the primary email addresson the account",
      });
    }
    // regenerate token
    account.verifyToken = account.generateAuthToken('1h');
    // update account details with new token
    await new AccountModel(account).save();
    verifyUrl = `${process.env.appUrl}:${process.env.PORT}/api/account/password-reset/${account.verifyToken}`;
    // send password reset token
    await transporter.sendMail(
      passwordResetEmail(account.email, verifyUrl, 'Password Reset')
    );

    return res.status(200).json({
      success: true,
      message:
        "if we found an account associated with tha email address, we've sent verifcation instruction to the primary email addresson the account",
    });
  } catch (err) {
    return catchError(err, res);
  }
};

// reset password
module.exports.passwordReset = async (req, res, next) => {
  const token = req.params.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token not provided',
    });
  }

  // validate
  const validate = await handleValidation(req.body, res, 'resetPassword');
  // return validate result
  if (validate != null) return validate;

  try {
    // decode token
    const decoded = jwt.verify(token, process.env.jwtSecret);
    console.log(decoded);
    // get account
    const account = await getAccount({
      _id: decoded._id,
      email: decoded.email,
    });

    // check token match
    if (account.isVerify === null || account.verifyToken !== token) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Token',
      });
    }

    // check if account is verify
    if (!account.isVerify) {
      return res.status(400).json({
        success: false,
        message: 'Kindly verify your account.. redirect to verification page',
      });
    }
    // check if account is active
    if (!account.isActive) {
      return res.status(400).json({
        success: false,
        message:
          'Kindly activate your account contact our support.. redirect to support page',
      });
    }

    // proceed to update password
    if (account.isActive && account.isVerify) {
      account.password = account.encryptPassword(req.body.password);
      account.verifyToken = null;

      await new AccountModel(account).save();

      // Send password reset successful

      return res.status(200).json({
        success: true,
        message: 'Password reset Successful.. proceed to login',
      });
    }
  } catch (err) {
    return catchError(err, res);
  }
};

// get current account details with global variable authID set at auth middleware
module.exports.account = async (req, res, next) => {
  try {
    // get account details
    const account = await getAccount({ _id: req.authID });
    return res.status(200).json({
      success: true,
      message: 'Auth Account',
      data: account,
    });
  } catch (err) {
    return catchError(err, res);
  }
};

// oldPassword, newPassword
module.exports.changePassword = async (req, res, next) => {
  try {
    // validate
    const validate = await handleValidation(req.body, res, 'passwordChange');

    // return validate result
    if (validate != null) return validate;

    // check if new and old password match
    if (req.body.oldpassword === req.body.newpassword) {
      return res.status(400).json({
        success: false,
        message: 'Old and New Password are the same',
      });
    }

    // get account details
    const account = await getAccount({ _id: req.authID });

    // check if oldpassword match
    const validPass = account.comparePassword(
      req.body.oldpassword,
      account.password
    );

    // invalid password
    if (!validPass) {
      return res.status(400).json({
        success: false,
        message: 'Invalid old password',
      });
    }
    account.password = account.encryptPassword(req.body.newpassword);
    const saveData = await new AccountModel(account).save();
    if (saveData) {
      return res.status(200).json({
        success: true,
        message: 'Password Change Successful',
      });
    }
  } catch (error) {
    return catchError(err, res);
  }
};

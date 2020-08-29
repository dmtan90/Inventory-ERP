const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { StoreModel } = require('../models/store.model');
const {
  createStoreValidation,
  checkStoreEmailValidation,
  checkStorePinValidation,
  catchError,
} = require('../utils/validation');

const {
  transporter,
  createStoreVerificationEmail,
} = require('../utils/email.messages');
const validation = {
  validateStore: createStoreValidation,
  checkEmail: checkStoreEmailValidation,
  checkPin: checkStorePinValidation,
};

const handleValidation = async (body, res, type) => {
  const { error } = await validation[type](body);
  if (error) {
    console.log(error);
    return res.status(422).json({
      success: false,
      message: 'Validation Errors',
      errors: error.details[0].message,
    });
  }
};

// POST api/store
// Create Store
// private
module.exports.createStore = async (req, res, next) => {
  // validate
  const validate = await handleValidation(req.body, res, 'validateStore');
  // return validate result
  if (validate != null) return validate;
  try {
    // check if data exist
    let store = await StoreModel.find({
      $or: [
        { storeemail: req.body.storeemail },
        { storephone: req.body.storephone },
      ],
    }).exec();

    if (store.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Store Info Already Exist' });
    }

    let data = {};
    for (const key in req.body) {
      data[key] = req.body[key];
    }
    data['_id'] = new mongoose.Types.ObjectId();
    data['account'] = req.authID;
    const saveData = await new StoreModel(data).save();
    saveData['verifyToken'] = saveData.generateVerifyToken('1h');
    saveData['verifyPin'] = saveData.generateVerifyPin();
    const newdata = await new StoreModel(saveData).save();
    if (newdata) {
      // send store verification mail
      if (process.env.NODE_ENV == 'production') {
        verifyUrl = `${process.env.appUrl}/api/store/verify/${newdata.verifyToken}`;
      }
      verifyUrl = `${process.env.appUrl}:${process.env.PORT}/api/store/verify/${newdata.verifyToken}`;
      await transporter.sendMail(
        createStoreVerificationEmail(
          newdata.email,
          verifyUrl,
          newdata.verifyPin,
          'Verify Store'
        )
      );

      return res.status(200).json({
        success: true,
        message:
          'Store successfully created, kindly check your email for verification',
      });
    }
  } catch (err) {
    catchError(err, res);
  }
};

module.exports.resendVerificationToken = async (req, res, next) => {
  const validate = await handleValidation(req.body, res, 'checkEmail');
  if (validate != null) return validate;

  try {
    const store = await StoreModel.findOne({
      storeemail: req.body.storeemail,
    }).exec();

    if (!store) {
      return res.status(200).json({
        success: true,
        message:
          "if we found an store associated with tha email address, we've sent verifcation instruction to the primary email addresson the account",
      });
    }
    if (store.isVerify) {
      return res.status(200).json({
        success: true,
        message: 'store has already been verified',
      });
    }
    store.verifyToken = store.generateVerifyToken('1h');
    store.verifyPin = store.generateVerifyPin();
    // update store details with new token
    const saveData = await new StoreModel(store).save();
    if (process.env.NODE_ENV == 'production') {
      verifyUrl = `${process.env.appUrl}/api/store/verify/${saveData.verifyToken}`;
    }
    verifyUrl = `${process.env.appUrl}:${process.env.PORT}/api/store/verify/${saveData.verifyToken}`;

    await transporter.sendMail(
      createStoreVerificationEmail(
        saveData.storeemail,
        verifyUrl,
        saveData.verifyPin,
        'Verify Store'
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

module.exports.verifyStore = async (req, res, next) => {
  const token = req.params.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token not provided',
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    const store = await StoreModel.findOne({
      _id: decoded._id,
      storeemail: decoded.storeemail,
    });
    if (store.isVerify) {
      return res.status(200).json({
        success: true,
        message: 'Store already verified',
      });
    }

    if (store.verifyToken !== token) {
      return res.status(200).json({
        success: true,
        message: 'Invalid Token',
      });
    }

    store.isVerify = true;
    store.isActive = true;
    store.verifyToken = null;
    store.verifyPin = null;

    await new StoreModel(store).save();
    return res.status(200).json({
      success: true,
      message: 'Verification Succeccful',
    });
  } catch (err) {
    return catchError(err, res);
  }
};

module.exports.verifyStoreWithPin = async (req, res, next) => {
  // validate
  const validate = await handleValidation(req.body, res, 'checkPin');
  if (validate != null) return validate;
  try {
    console.log(req.body);
    const store = await StoreModel.findOne({
      account: req.authID,
      verifyPin: req.body.pin,
    });

    if (!store) {
      return res.status(200).json({
        success: true,
        message: 'Invalid Pin',
      });
    }

    let sendtime = new Date(store.updatedAt);
    let currenttime = new Date();
    let check = new Date(currenttime - sendtime);

    let oneHour = 60 * 60 * 1000;
    if (check > oneHour) {
      return res.status(200).json({
        success: true,
        message: 'Pin Expiry',
      });
    }
    // console.log('valid');
    store.isVerify = true;
    store.isActive = true;
    store.verifyToken = null;
    store.verifyPin = null;

    await new StoreModel(store).save();
    return res.status(200).json({
      success: true,
      message: 'Verification Succeccful',
    });
  } catch (err) {
    catchError(err, res);
  }
};

// DELETE api/store/:storeId
// DELETE  a Store by ID
// private
module.exports.deleteStore = async (req, res, next) => {
  try {
    let store = req.storeData;

    if (store.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Store Already Deleted',
      });
    }

    store.isDeleted = true;
    const saveStore = await new StoreModel(store).save();
    if (saveStore) {
      return res.status(200).json({
        success: true,
        message: 'Store Deleted',
      });
    }
  } catch (err) {
    return catchError(err, res);
  }
};

// GET api/store/:storeId
// GET  a Store by ID
// private
module.exports.getStore = async (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: 'Category',
    data: req.storeData,
  });
};

// GET api/store/
// GET  All Store
// private
module.exports.getStores = async (req, res, next) => {
  try {
    const stores = await StoreModel.find({
      account: req.authID,
      isVerify: true,
      isActive: true,
      isDeleted: false,
    }).sort({ date: -1 });
    return res.status(200).json({
      success: true,
      message: 'All Category',
      data: stores,
    });
  } catch (err) {
    catchError(err);
  }
};

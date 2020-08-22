const Joi = require('@hapi/joi');

// Register validation
exports.registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    phone: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(5).required(),
  });
  return schema.validate(data);
};

// Login validation
exports.loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

// check email validation
exports.checkEmailValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
  });
  return schema.validate(data);
};

// password reset validation
exports.passwordResetValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(5).required(),
  });
  return schema.validate(data);
};

// Change Password Validation
exports.changePasswordValidation = (data) => {
  const schema = Joi.object({
    oldpassword: Joi.string().required(),
    newpassword: Joi.string().min(5).required(),
  });
  return schema.validate(data);
};

// catch error
exports.catchError = (err, msg) => {
  console.log(err);
  if (err.kind === 'ObjectId') {
    return res.status(404).json({
      success: false,
      message: msg ? msg : err.message,
    });
  }
  return res.status(500).json({
    success: false,
    message: 'Server Error',
  });
};

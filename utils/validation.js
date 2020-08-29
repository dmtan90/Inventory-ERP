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

// check store email validation
exports.checkStoreEmailValidation = (data) => {
  const schema = Joi.object({
    storeemail: Joi.string().required().email(),
  });
  return schema.validate(data);
};

// check store verify pin validation
exports.checkStorePinValidation = (data) => {
  const schema = Joi.object({
    pin: Joi.number().required(),
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

// Category Validation
exports.categoryValidation = (data) => {
  const schema = Joi.object({
    categoryname: Joi.string().required(),
    categorydescription: Joi.string().required(),
    isAvailable: Joi.boolean(),
  });
  return schema.validate(data);
};

//Sub Category Validation
exports.subCategoryValidation = (data) => {
  const schema = Joi.object({
    subcategoryname: Joi.string().required(),
    category: Joi.string().required(),
    isAvailable: Joi.boolean(),
  });
  return schema.validate(data);
};

// Size
exports.sizeValidation = (data) => {
  const schema = Joi.object({
    sizename: Joi.string().required(),
    shortname: Joi.string().required(),
    isAvailable: Joi.boolean(),
  });
  return schema.validate(data);
};

// Brand
exports.brandValidation = (data) => {
  const schema = Joi.object({
    brandname: Joi.string().required(),
    isAvailable: Joi.boolean(),
  });
  return schema.validate(data);
};

// Color
exports.colorValidation = (data) => {
  const schema = Joi.object({
    colorname: Joi.string().required(),
    colorhexcode: Joi.string().required(),
    isAvailable: Joi.boolean(),
  });
  return schema.validate(data);
};

// Coupon
exports.couponValidation = (data) => {
  const schema = Joi.object({
    coupontitle: Joi.string().required(),
    coupondescription: Joi.string().required(),
    couponpercentage: Joi.number().required(),
    coupondatefrom: Joi.date().required(),
    coupondateto: Joi.date().required(),
    couponstatus: Joi.boolean(),
    isAvailable: Joi.boolean(),
  });
  return schema.validate(data);
};

// Product
exports.productValidation = (data) => {
  const schema = Joi.object({
    productname: Joi.string().required(),
    productdescription: Joi.string().required(),
    productprice: Joi.number().required(),
    productquantity: Joi.number().required(),

    productimage: Joi.array(),
    productcategory: Joi.array(),
    productbrand: Joi.string(),
    productsize: Joi.array(),
    productcolor: Joi.array(),

    isAvailable: Joi.boolean(),
  });
  return schema.validate(data);
};

// Store Category Validation
exports.createStoreValidation = (data) => {
  const schema = Joi.object({
    storename: Joi.string().required(),
    storephone: Joi.string().required(),
    storeemail: Joi.string().required(),
    address: Joi.string().required(),
    lat: Joi.string().required(),
    lng: Joi.string().required(),
  });
  return schema.validate(data);
};

// Handle validation
exports.handleValidation = async (body, res, type, validation) => {
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

// catch error
exports.catchError = (err, res, msg) => {
  console.log('Error == ' + err);
  console.log('Message == ' + msg);
  console.log('Error Kind == ' + err.kind);
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

const mongoose = require('mongoose');
const { CouponModel } = require('../models/product.model');
const {
  couponValidation,
  handleValidation,
  catchError,
} = require('../utils/validation');

const {
  findOne,
  findById,
  saveData,
  checkIfExist,
} = require('../services/services');

const validation = {
  validateCoupon: couponValidation,
};

module.exports.createCoupon = async (req, res, next) => {
  // validate
  const validate = await handleValidation(
    req.body,
    res,
    'validateCoupon',
    validation
  );
  // return validate result
  if (validate != null) return validate;

  try {
    // check if data exist
    let coupon = await checkIfExist(
      CouponModel,
      [
        {
          coupontitle: req.body.coupontitle,
        },
      ],
      [
        {
          store: req.storeData._id,
        },
        {
          isDeleted: false,
        },
      ]
    );

    // data exist
    if (coupon.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Data Already Exist' });
    }

    // map data
    let data = {};
    for (const key in req.body) {
      data[key] = req.body[key];
    }
    data['_id'] = new mongoose.Types.ObjectId();
    data['store'] = req.storeData._id;
    // save data
    return await saveData(
      CouponModel,
      data,
      'Coupon successfully created',
      res
    );
  } catch (err) {
    return catchError(err, res);
  }
};

module.exports.deleteCoupon = async (req, res, next) => {
  const couponId = req.params.couponId;
  if (!couponId) {
    return res.status(401).json({
      success: false,
      message: 'Coupon ID not provided',
    });
  }
  // error message
  let msg = 'Coupon Not Found';

  // find check
  let coupon = await findOne(
    {
      _id: couponId,
      store: req.storeData._id,
      isDeleted: false,
    },
    res,
    CouponModel,
    msg
  );

  try {
    coupon.isDeleted = true;
    return await saveData(CouponModel, coupon, 'Coupon Deleted', res);
  } catch (err) {
    return catchError(err, res, 'Coupon Not Found');
  }
};

module.exports.getCoupon = async (req, res, next) => {
  const couponId = req.params.couponId;
  if (!couponId) {
    return res.status(401).json({
      success: false,
      message: 'Coupon ID not provided',
    });
  }
  // error message
  let msg = 'Coupon Not Found';

  // get size
  let coupon = await findOne(
    {
      _id: couponId,
      store: req.storeData._id,
      isDeleted: false,
    },
    res,
    CouponModel,
    msg
  );

  try {
    return res.status(200).json({
      success: true,
      message: 'Coupon',
      data: coupon,
    });
  } catch (err) {
    return catchError(err, res, msg);
  }
};

module.exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await CouponModel.find({
      store: req.storeData._id,
      isDeleted: false,
    })
      .sort({ date: -1 })
      .exec();
    return res.status(200).json({
      success: true,
      message: 'All Coupon',
      data: coupons,
    });
  } catch (err) {
    return catchError(err, res);
  }
};

module.exports.updateCoupon = async (req, res, next) => {
  const couponId = req.params.couponId;
  if (!couponId) {
    return res.status(401).json({
      success: false,
      message: 'Coupon ID not provided',
    });
  }
  // validate
  const validate = await handleValidation(
    req.body,
    res,
    'validateCoupon',
    validation
  );
  // return validate
  if (validate != null) return validate;

  // set error message
  let msg = 'Coupon Not Found';

  // get size data
  let coupon = await findOne(
    { _id: couponId, isDeleted: false },
    res,
    CouponModel,
    msg
  );

  try {
    // map data
    for (const key in req.body) {
      coupon[key] = req.body[key];
    }

    // save data
    return await saveData(
      CouponModel,
      coupon,
      'Coupon successfull updated',
      res
    );
  } catch (err) {
    return catchError(err, res, msg);
  }
};

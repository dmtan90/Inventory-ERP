const { catchError } = require('../utils/validation');
const { findOne } = require('../services/services');
const { StoreModel } = require('../models/store.model');

// check if auth user have access to store operation
exports.storeAuth = async (req, res, next) => {
  const storeId = req.params.storeId;
  if (!storeId) {
    return res.status(401).json({
      success: false,
      message: 'Store ID not provided',
    });
  }

  // Get Store
  let store = await findOne(
    { _id: storeId },
    res,
    StoreModel,
    // 'Store Not Found'
    'Authorization Denied'
  );

  try {
    if (!store.isVerify) {
      return res.status(400).json({
        success: false,
        message: 'Kindly verify your store.. redirect to verification page',
      });
    }

    // check if store is active
    if (!store.isActive) {
      return res.status(400).json({
        success: false,
        message:
          'Kindly activate your store contact our support.. redirect to support page',
      });
    }

    // if current auth match store account
    if (store.account == req.authID) {
      // set store data as Global variable
      req.storeData = store;
      // res.local.storeData = store;
      next();
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: 'Authorization Denied',
    });
  }
};

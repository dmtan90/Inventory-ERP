const mongoose = require('mongoose');
const { ProductModel } = require('../models/product.model');
const {
  productValidation,
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
  validateProduct: productValidation,
};

module.exports.createProduct = async (req, res, next) => {
  // validate
  const validate = await handleValidation(
    req.body,
    res,
    'validateProduct',
    validation
  );
  // return validate result
  if (validate != null) return validate;

  try {
    console.log(req.body);
  } catch (err) {
    return catchError(err, res);
  }
};

module.exports.deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  if (!productId) {
    return res.status(401).json({
      success: false,
      message: 'Product ID not provided',
    });
  }
  // error message
  let msg = 'Product Not Found';

  // find check
  let product = await findOne(
    {
      _id: productId,
      store: req.storeData._id,
      isDeleted: false,
    },
    res,
    ProductModel,
    msg
  );
  try {
    product.isDeleted = true;
    return await saveData(ProductModel, product, 'Product Deleted', res);
  } catch (err) {
    return catchError(err, res, 'Product Not Found');
  }
};

module.exports.getProduct = async (req, res, next) => {
  const productId = req.params.productId;
  if (!productId) {
    return res.status(401).json({
      success: false,
      message: 'Product ID not provided',
    });
  }
  // error message
  let msg = 'Product Not Found';

  // get product
  let product = await findOne(
    {
      _id: productId,
      store: req.storeData._id,
      isDeleted: false,
    },
    res,
    ProductModel,
    msg
  );
  try {
    return res.status(200).json({
      success: true,
      message: 'Product',
      data: product,
    });
  } catch (err) {
    return catchError(err, res, msg);
  }
};

module.exports.getProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find({
      store: req.storeData._id,
      isDeleted: false,
    })
      .sort({ date: -1 })
      .exec();
    return res.status(200).json({
      success: true,
      message: 'All Product',
      data: products,
    });
  } catch (err) {
    return catchError(err, res);
  }
};

module.exports.getAllProduct = async (req, res, next) => {
  try {
    const products = await ProductModel.find({
      isDeleted: false,
    })
      .populate('store', ['storename'])
      .sort({ date: -1 })
      .exec();
  } catch (err) {
    return catchError(err, res);
  }
};

module.exports.updateProduct = async (req, res, next) => {};

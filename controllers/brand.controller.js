const mongoose = require('mongoose');
const { BrandModel } = require('../models/product.model');
const {
  brandValidation,
  handleValidation,
  catchError,
  sizeValidation,
} = require('../utils/validation');

const { checkIfExist, findOne, saveData } = require('../services/services');

const validation = {
  validateBrand: brandValidation,
};

module.exports.createBrand = async (req, res, next) => {
  // validate
  const validate = await handleValidation(
    req.body,
    res,
    'validateBrand',
    validation
  );
  //   return validate result
  if (valiate != null) return validate;
  try {
    //   check if exist
    let brand = await checkIfExist(
      BrandModel,
      [
        { colorname: req.body.colorname },
        { colorhexcode: req.body.colorhexcode },
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
    if (brand.length > 0) {
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
    return await saveData(BrandModel, data, 'Brand successfully created', res);
  } catch (err) {
    return catchError(err, res);
  }
};

module.exports.deleteBrand = async (req, res, next) => {
  const brandId = req.params.brandId;
  if (!brandId) {
    return res.status(401).json({
      success: false,
      message: 'Brand ID not provided',
    });
  }

  // error message
  let msg = 'Brand Not Found';

  // find check
  let brand = await findOne(
    {
      _id: brandId,
      store: req.storeData._id,
      isDeleted: false,
    },
    res,
    BrandModel,
    msg
  );
  try {
    brand.isDeleted = true;
    return await saveData(BrandModel, brand, 'Brand Deleted', res);
  } catch (err) {
    return catchError(err, res, 'Brand Not Found');
  }
};

module.exports.getBrand = async (req, res, next) => {
  const brandId = req.params.brandId;
  if (!brandId) {
    return res.status(401).json({
      success: false,
      message: 'Brand ID not provided',
    });
  }

  // error message
  let msg = 'Brand Not Found';

  //   get brand
  let brand = await findOne(
    {
      _id: brandId,
      store: req.storeData._id,
      isDeleted: false,
    },
    res,
    BrandModel,
    msg
  );
  try {
    return res.status(200).json({
      success: true,
      message: 'Brand',
      data: brand,
    });
  } catch (err) {
    return catchError(err, res, msg);
  }
};

module.exports.getBrands = async (req, res, next) => {
  try {
    const brands = await BrandModel.find({
      store: req.storeData._id,
      isDeleted: false,
    })
      .sort({ date: -1 })
      .exec();
    return res.status(200).json({
      success: true,
      message: 'All Size',
      data: brands,
    });
  } catch (err) {
    return catchError(err, res);
  }
};

module.exports.updateBrand = async (req, res, next) => {
  const brandId = req.params.brandId;
  if (!brandId) {
    return res.status(401).json({
      success: false,
      message: 'Brand ID not provided',
    });
  }
  // validate
  const validate = await handleValidation(
    req.body,
    res,
    'validateBrand',
    validation
  );
  //   return validate result
  if (valiate != null) return validate;
  //   set error message
  let msg = 'Brand Not Found';
  //   get brand data
  let brand = await findOne(
    {
      _id: brandId,
      isDeleted: false,
    },
    res,
    BrandModel,
    msg
  );
  try {
    //   save data
    return await saveData(BrandModel, brand, 'Brand successfull updated', res);
  } catch (err) {
    return catchError(err, res, msg);
  }
};

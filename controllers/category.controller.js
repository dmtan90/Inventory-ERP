const mongoose = require('mongoose');
const { CategoryModel, SubCategoryModel } = require('../models/category.model');
const {
  categoryValidation,
  subCategoryValidation,
  handleValidation,
  catchError,
} = require('../utils/validation');
const {
  checkIfExist,
  saveData,
  findById,
  findOne,
} = require('../services/services');

const validation = {
  validateCategory: categoryValidation,
  valitadeSubCategory: subCategoryValidation,
};

// POST api/category
// Create Category
// private
module.exports.createCategory = async (req, res, next) => {
  // validate
  const validate = await handleValidation(
    req.body,
    res,
    'validateCategory',
    validation
  );

  // return validate result
  if (validate != null) return validate;

  try {
    // check if data exist
    let cat = await checkIfExist(
      CategoryModel,
      [
        { categoryname: req.body.categoryname },
        { categorydescription: req.body.categorydescription },
      ],
      [{ isDeleted: false }]
    );

    // data exist
    if (cat.length > 0) {
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

    // save data
    return await saveData(
      CategoryModel,
      data,
      'Category successfully created',
      res
    );
  } catch (err) {
    return catchError(err, res);
  }
};

// PUT api/category/:categoryId
// Update Category
// private
module.exports.updateCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  if (!categoryId) {
    return res.status(401).json({
      success: false,
      message: 'Category ID not provided',
    });
  }
  // validate
  const validate = await handleValidation(
    req.body,
    res,
    'validateCategory',
    validation
  );
  // return validate result
  if (validate != null) return validate;

  // set error message
  let msg = 'Category Not Found';

  // get category
  let category = await findOne(
    {
      _id: categoryId,
      isDeleted: false,
    },
    res,
    CategoryModel,
    msg
  );

  try {
    // map data
    for (const key in req.body) {
      category[key] = req.body[key];
    }
    // save data
    return await saveData(
      CategoryModel,
      category,
      'Size successfully created',
      res
    );
  } catch (err) {
    return catchError(err, res, msg);
  }
};

// DELETE api/category/:categoryId
// DELETE  a Category by ID
// private
module.exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  if (!categoryId) {
    return res.status(401).json({
      success: false,
      message: 'Category ID not provided',
    });
  }

  // set error message
  let msg = 'Category Not Found';

  // find check
  let category = await findOne(
    {
      _id: categoryId,
      isAvailable: true,
      isDeleted: false,
    },
    res,
    CategoryModel,
    msg
  );

  try {
    category.isAvailable = false;
    category.isDeleted = true;
    return await saveData(CategoryModel, category, 'Category Deleted', res);
  } catch (err) {
    catchError(err, res, 'Category Not Found');
  }
};

// GET api/category/:categoryId
// GET  a Category by ID
// private
module.exports.getCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  if (!categoryId) {
    return res.status(401).json({
      success: false,
      message: 'Category ID not provided',
    });
  }

  // set error message
  let msg = 'Size Not Found';

  // get category
  let category = await findOne(
    {
      _id: categoryId,
      isAvailable: true,
      isDeleted: false,
    },
    res,
    CategoryModel,
    msg
  );

  try {
    return res.status(200).json({
      success: true,
      message: 'Category',
      data: category,
    });
  } catch (err) {
    catchError(err, res, msg);
  }
};

// GET api/category
// GET ALL Category
// private
module.exports.getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.find({
      isAvailable: true,
      isDeleted: false,
    })
      .sort({ date: -1 })
      .exec();
    return res.status(200).json({
      success: true,
      message: 'All Category',
      data: categories,
    });
  } catch (err) {
    return catchError(err, res);
  }
};

// ===============================================
// ================= SUB CATEGORY ================
// ===============================================

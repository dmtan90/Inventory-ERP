const mongoose = require('mongoose');
const { SizeModel } = require('../models/product.model');
const {
  sizeValidation,
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
  validateSize: sizeValidation,
};

module.exports.createSize = async (req, res, next) => {
  // validate
  const validate = await handleValidation(
    req.body,
    res,
    'validateSize',
    validation
  );
  // return validate result
  if (validate != null) return validate;

  try {
    // check if data exist
    let size = await checkIfExist(
      SizeModel,
      [
        {
          sizename: req.body.sizename,
        },
        { shortname: req.body.shortname },
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
    if (size.length > 0) {
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
    return await saveData(SizeModel, data, 'Size successfully created', res);
  } catch (err) {
    return catchError(err, res);
  }
};

module.exports.deleteSize = async (req, res, next) => {
  const sizeId = req.params.sizeId;
  if (!sizeId) {
    return res.status(401).json({
      success: false,
      message: 'Size ID not provided',
    });
  }
  // error message
  let msg = 'Size Not Found';

  // find check
  let size = await findOne(
    {
      _id: sizeId,
      store: req.storeData._id,
      isDeleted: false,
    },
    res,
    SizeModel,
    msg
  );

  try {
    size.isDeleted = true;
    return await saveData(SizeModel, size, 'Size Deleted', res);
  } catch (err) {
    return catchError(err, res, 'Size Not Found');
  }
};

module.exports.getSize = async (req, res, next) => {
  const sizeId = req.params.sizeId;
  if (!sizeId) {
    return res.status(401).json({
      success: false,
      message: 'Size ID not provided',
    });
  }
  // error message
  let msg = 'Size Not Found';

  // get size
  let size = await findOne(
    {
      _id: sizeId,
      store: req.storeData._id,
      isDeleted: false,
    },
    res,
    SizeModel,
    msg
  );

  try {
    return res.status(200).json({
      success: true,
      message: 'Size',
      data: size,
    });
  } catch (err) {
    return catchError(err, res, msg);
  }
};

module.exports.getSizes = async (req, res, next) => {
  try {
    const sizes = await SizeModel.find({
      store: req.storeData._id,
      isDeleted: false,
    })
      .sort({ date: -1 })
      .exec();
    return res.status(200).json({
      success: true,
      message: 'All Size',
      data: sizes,
    });
  } catch (err) {
    return catchError(err, res);
  }
};

module.exports.updateSize = async (req, res, next) => {
  const sizeId = req.params.sizeId;
  if (!sizeId) {
    return res.status(401).json({
      success: false,
      message: 'Size ID not provided',
    });
  }
  // validate
  const validate = await handleValidation(
    req.body,
    res,
    'validateSize',
    validation
  );
  // return validate
  if (validate != null) return validate;

  // set error message
  let msg = 'Size Not Found';

  // get size data
  let size = await findOne(
    { _id: sizeId, isDeleted: false },
    res,
    SizeModel,
    msg
  );

  try {
    // map data
    for (const key in req.body) {
      size[key] = req.body[key];
    }

    // save data
    return await saveData(SizeModel, size, 'Size successfull updated', res);
  } catch (err) {
    return catchError(err, res, msg);
  }
};

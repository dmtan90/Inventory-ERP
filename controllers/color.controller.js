const mongoose = require('mongoose');
const { ColorModel } = require('../models/product.model');
const {
  colorValidation,
  handleValidation,
  catchError,
} = require('../utils/validation');

const { checkIfExist, saveData, findOne } = require('../services/services');

const validation = { validateColor: colorValidation };

module.exports.createColor = async (req, res, next) => {
  // validate
  const validate = await handleValidation(
    req.body,
    res,
    'validateColor',
    validation
  );
  //   return validate result
  if (validate != null) return validate;
  try {
    //   check if data exist
    let color = await checkIfExist(
      ColorModel,
      [
        {
          colorname: req.body.colorname,
        },
        {
          colorhexcode: req.body.colorhexcode,
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
    if (color.length > 0) {
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
    return await saveData(ColorModel, data, 'Color successfully created', res);
  } catch (err) {
    return catchError(err, res);
  }
};

module.exports.deleteColor = async (req, res, next) => {
  const colorId = req.params.colorId;
  if (!colorId) {
    return res.status(401).json({
      success: false,
      message: 'Color ID not provided',
    });
  }
  // error message
  let msg = 'Color Not Found';
  //   find check
  let color = await findOne(
    {
      _id: colorId,
      store: req.storeData._id,
      isDeleted: false,
    },
    res,
    ColorModel,
    msg
  );
  try {
    color.isDeleted = true;
    return await saveData(ColorModel, color, 'Color Deleted', res);
  } catch (err) {
    return catchError(err, res, 'Color Not Found');
  }
};

module.exports.getColor = async (req, res, next) => {
  const colorId = req.params.colorId;
  if (!colorId) {
    return res.status(401).json({
      success: false,
      message: 'Color ID not provided',
    });
  }
  // error message
  let msg = 'Color Not Found';

  // get color
  let color = await findOne(
    {
      _id: colorId,
      store: req.storeData._id,
      isDeleted: false,
    },
    res,
    ColorModel,
    msg
  );
  try {
    return res.status(200).json({
      success: true,
      message: 'Color',
      data: color,
    });
  } catch (err) {
    return catchError(err, res, msg);
  }
};

module.exports.getColors = async (req, res, next) => {
  try {
    const colors = await ColorModel.find({
      store: req.storeData._id,
      isDeleted: false,
    })
      .sort({ date: -1 })
      .exec();
    return res.status(200).json({
      success: true,
      message: 'All Color',
      data: colors,
    });
  } catch (err) {
    return catchError(err, res);
  }
};

module.exports.updateColor = async (req, res, next) => {
  const colorId = req.params.colorId;
  if (!colorId) {
    return res.status(401).json({
      success: false,
      message: 'Color ID not provided',
    });
  }
  // validate
  const validate = await handleValidation(
    req.body,
    res,
    'validateColor',
    validation
  );
  // return validate
  if (validate != null) return validate;

  // set error message
  let msg = 'Color Not Found';

  // get color data
  let color = await findOne(
    { _id: colorId, isDeleted: false },
    res,
    ColorModel,
    msg
  );
  try {
    //   map data
    for (const key in req.body) {
      size[key] = req.body[key];
    }

    // save data
    return await saveData(ColorModel, size, 'Color successfull updated', res);
  } catch (err) {
    return catchError(err, res, msg);
  }
};

const { catchError } = require('../utils/validation');

exports.findOne = async (query, res, model, msg) => {
  try {
    const get = await model.findOne(query).exec();
    if (!get) {
      return res.status(404).json({
        success: false,
        message: msg,
      });
    }
    return get;
  } catch (err) {
    return catchError(err, res, msg);
  }
};

exports.findById = async (id, res, model, msg) => {
  try {
    const get = await model.findById(id);
    if (!get) {
      return res.status(404).json({
        success: false,
        message: msg,
      });
    }
    return get;
  } catch (err) {
    return catchError(err, res, msg);
  }
};

exports.checkIfExist = async (model, orQuery, andQuery) => {
  const check = await model
    .find({
      $or: orQuery,
      $and: andQuery,
    })
    .exec();
  return check;
};

exports.saveData = async (model, data, msg, res) => {
  const save = await new model(data).save();
  if (save) {
    return res.status(200).json({
      success: true,
      message: msg,
      data: save,
    });
  }
};

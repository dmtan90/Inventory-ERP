const router = require('express').Router();
const mongoose = require('mongoose');

const { PostModel } = require('../models/post.model');
const { catchError } = require('../utils/validation');

router.get('/', async (req, res, next) => {
  const post = await PostModel.find().exec();
  return res.status(200).json({
    success: true,
    message: 'All Post',
    post: post,
  });
});

router.post('/', async (req, res, next) => {
  console.log(req.body);

  try {
    let data = {};
    for (const key in req.body) {
      data[key] = req.body[key];
    }
    data['_id'] = new mongoose.Types.ObjectId();
    const saveData = await new PostModel(data).save();
    if (saveData) {
      return res.status(200).json({
        success: true,
        message: 'Post Saved',
        post: saveData,
      });
    }
  } catch (err) {
    catchError(err);
  }
});

module.exports = router;

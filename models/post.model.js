const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
exports.PostModel = mongoose.model('Post', postSchema);

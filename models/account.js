const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
// const { function } = require('@hapi/joi');

const accountSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    },
    password: { type: String, required: true },

    verifyToken: { type: String },
    isVerify: { type: Boolean, default: false },

    isActive: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

accountSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

accountSchema.methods.comparePassword = function (rawPass, hashPass) {
  return bcrypt.compareSync(rawPass, hashPass);
};

accountSchema.methods.generateAuthToken = function (expiretime) {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.jwtSecret,
    {
      // expiresIn: process.env.tokenExpire,
      expiresIn: expiretime,
    }
  );
  return token;
};

exports.AccountModel = mongoose.model('Account', accountSchema);

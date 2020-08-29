const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    verifyPin: { type: Number },
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
      expiresIn: expiretime,
    }
  );
  return token;
};

accountSchema.methods.generateVerifyPin = function () {
  const pin = Math.floor(1000 + Math.random() * 9000);
  return pin;
};

exports.AccountModel = mongoose.model('Account', accountSchema);

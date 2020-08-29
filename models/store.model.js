const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const storeSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    storename: { type: String, required: true },
    storephone: { type: String, required: true },
    storeemail: {
      type: String,
      required: true,
      unique: true,
      match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    },

    address: { type: String, required: true },
    lat: { type: String, required: true },
    lng: { type: String, required: true },

    verifyToken: { type: String },
    verifyPin: { type: Number },
    isVerify: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },

    isDeleted: { type: Boolean, default: false },

    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },

    // orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],

    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

storeSchema.methods.generateVerifyToken = function (expiretime) {
  const token = jwt.sign(
    {
      _id: this._id,
      storeemail: this.storeemail,
    },
    process.env.jwtSecret,
    {
      expiresIn: expiretime,
    }
  );
  return token;
};

storeSchema.methods.generateVerifyPin = function () {
  const pin = Math.floor(1000 + Math.random() * 9000);
  return pin;
};

exports.StoreModel = mongoose.model('Store', storeSchema);

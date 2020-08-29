const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    productname: { type: String, required: true },
    productdescription: { type: String, required: true },
    productprice: { type: Number, required: true },
    productquantity: { type: Number, required: true },

    productimage: [{ type: String }],
    productcategory: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    ],
    productsubcategory: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
    ],
    productbrand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    productsize: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Size' }],
    productcolor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Color' }],

    isAvailable: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model('Product', productSchema);

const brandSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    brandname: { type: String, required: true },

    isAvailable: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const BrandModel = mongoose.model('Brand', brandSchema);

const colorSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    colorname: { type: String, required: true },
    colorhexcode: { type: String, required: true },

    isAvailable: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const ColorModel = mongoose.model('Color', colorSchema);

const sizeSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    sizename: { type: String, required: true },
    shortname: { type: String, required: true },

    isAvailable: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const SizeModel = mongoose.model('Size', sizeSchema);

const couponSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    coupontitle: { type: String, required: true },
    coupondescription: { type: String, required: true },
    couponpercentage: { type: Number, required: true },
    coupondatefrom: { type: Date, required: true },
    coupondateto: { type: Date, required: true },
    couponstatus: { type: Boolean, default: false },

    isAvailable: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const CouponModel = mongoose.model('Coupon', couponSchema);

module.exports = {
  ProductModel,
  BrandModel,
  ColorModel,
  SizeModel,
  CouponModel,
};

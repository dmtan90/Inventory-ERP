const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    productname: { type: String, required: true },
    productdescription: { type: String, required: true },
    productprice: { type: Number, required: true },
    productquantity: { type: Number, required: true },
    productimage: [{ type: String }],
    productcategory: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    productsubcategory: [{ type: Schema.Types.ObjectId, ref: 'SubCategory' }],
    productbrand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    productsize: [{ type: Schema.Types.ObjectId, ref: 'Size' }],
    productcolor: [{ type: Schema.Types.ObjectId, ref: 'Color' }],

    isAvailable: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const ProductModel = mongoose.model('Product', productSchema);

const brandSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    brandname: { type: String, required: true },

    isAvailable: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const BrandModel = mongoose.model('Brand', brandSchema);

const colorSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    colorname: { type: String, required: true },
    colorhexcode: { type: String, required: true },

    isAvailable: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const ColorModel = mongoose.model('Color', colorSchema);

const sizeSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    sizename: { type: String, required: true },
    shortname: { type: String, required: true },

    isAvailable: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const SizeModel = mongoose.model('Size', sizeSchema);

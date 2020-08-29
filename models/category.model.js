const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    categoryname: { type: String, required: true },
    categorydescription: { type: String, required: true },

    isAvailable: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
const CategoryModel = mongoose.model('Category', categorySchema);

const subCategorySchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    subcategoryname: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    isAvailable: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const SubCategoryModel = mongoose.model('SubCategory', subCategorySchema);

module.exports = {
  CategoryModel,
  SubCategoryModel,
};

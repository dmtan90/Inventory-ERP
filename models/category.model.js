const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    categoryname: { type: String, required: true },
    categorydescription: { type: String, required: true },

    isAvailable: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
export const CategoryModel = mongoose.model('Category', categorySchema);

const subCategorySchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    subcategoryname: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },

    isAvailable: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const SubCategoryModel = mongoose.model(
  'SubCategory',
  subCategorySchema
);

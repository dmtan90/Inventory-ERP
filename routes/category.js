const router = require('express').Router();
const {
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  toggleAvailableStatus,
  deleteCategory,
} = require('../controllers/category.controller');

router.get('/', getCategories);

router.post('/', createCategory);

router.get('/:categoryId', getCategory);

router.put('/:categoryId', updateCategory);

// router.put('/available-status/:categoryId', toggleAvailableStatus);

router.put('/delete/:categoryId', deleteCategory);

module.exports = router;

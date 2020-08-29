const router = require('express').Router();

const { accountAuth } = require('../middlewares/authMiddleware');
const { storeAuth } = require('../middlewares/storeMiddleware');

const {
  createBrand,
  deleteBrand,
  updateBrand,
  getBrand,
  getBrands,
} = require('../controllers/brand.controller');

router.get('/:storeId', accountAuth, storeAuth, getBrands);

router.post('/:storeId', accountAuth, storeAuth, createBrand);

router.get('/:storeId/:brandId', accountAuth, storeAuth, getBrand);

router.put('/:storeId/:brandId', accountAuth, storeAuth, updateBrand);

router.put('/delete/:storeId/:brandId', accountAuth, storeAuth, deleteBrand);

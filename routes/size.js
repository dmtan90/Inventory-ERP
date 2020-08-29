const router = require('express').Router();

const { accountAuth } = require('../middlewares/authMiddleware');
const { storeAuth } = require('../middlewares/storeMiddleware');

const {
  createSize,
  deleteSize,
  updateSize,
  getSize,
  getSizes,
} = require('../controllers/size.controller');

router.get('/:storeId', accountAuth, storeAuth, getSizes);

router.post('/:storeId', accountAuth, storeAuth, createSize);

router.get('/:storeId/:sizeId', accountAuth, storeAuth, getSize);

router.put('/:storeId/:sizeId', accountAuth, storeAuth, updateSize);

// delete size
router.put('/delete/:storeId/:sizeId', accountAuth, storeAuth, deleteSize);

module.exports = router;

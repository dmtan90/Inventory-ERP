const router = require('express').Router();

const { accountAuth } = require('../middlewares/authMiddleware');
const { storeAuth } = require('../middlewares/storeMiddleware');

const {
  createColor,
  deleteColor,
  updateColor,
  getColor,
  getColors,
} = require('../controllers/color.controller');

router.get('/:storeId', accountAuth, storeAuth, getColors);

router.post('/:storeId', accountAuth, storeAuth, createColor);

router.get('/:storeId/:colorId', accountAuth, storeAuth, getColor);

router.put('/:storeId/:colorId', accountAuth, storeAuth, updateColor);

// delete size
router.put('/delete/:storeId/:colorId', accountAuth, storeAuth, deleteColor);

module.exports = router;

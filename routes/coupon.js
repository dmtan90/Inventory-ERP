const router = require('express').Router();

const { accountAuth } = require('../middlewares/authMiddleware');
const { storeAuth } = require('../middlewares/storeMiddleware');

const {
  createCoupon,
  deleteCoupon,
  updateCoupon,
  getCoupon,
  getCoupons,
} = require('../controllers/coupon.controller');

router.get('/:storeId', accountAuth, storeAuth, getCoupons);

router.post('/:storeId', accountAuth, storeAuth, createCoupon);

router.get('/:storeId/:couponId', accountAuth, storeAuth, getCoupon);

router.put('/:storeId/:couponId', accountAuth, storeAuth, updateCoupon);

// delete size
router.put('/delete/:storeId/:couponId', accountAuth, storeAuth, deleteCoupon);

module.exports = router;

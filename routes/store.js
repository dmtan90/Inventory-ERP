const router = require('express').Router();

const {
  deleteStore,
  createStore,
  resendVerificationToken,
  verifyStore,
  verifyStoreWithPin,
  getStore,
  getStores,
} = require('../controllers/store.controller');

const { accountAuth } = require('../middlewares/authMiddleware');
const { storeAuth } = require('../middlewares/storeMiddleware');

// create store
router.post('/', accountAuth, createStore);

// get all auth store
router.get('/', accountAuth, getStores);

// verify store
router.post('/verify/:token', accountAuth, verifyStore);
router.post('/verify', accountAuth, verifyStoreWithPin);
router.post('/resend-verify-token', accountAuth, resendVerificationToken);

// get store
router.get('/:storeId', accountAuth, storeAuth, getStore);
// delete store
router.put('/:storeId', accountAuth, storeAuth, deleteStore);

module.exports = router;

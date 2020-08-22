const router = require('express').Router();

const {
  register,
  verifyRegistration,
  resendVerificationToken,
  login,
  account,
  changePassword,
  sendPasswordResetToken,
  passwordReset,
} = require('../controllers/account.controller');

const { accountAuth } = require('../middlewares/authMiddleware');

// get profile
router.get('/', accountAuth, account);

// change password
router.post('/change-password', accountAuth, changePassword);

// login
router.post('/login', login);

// register
router.post('/register', register);

// verify account
router.post('/verify/:token', verifyRegistration);

// resend verification token
router.post('/resend-verify-token', resendVerificationToken);

// password reset token
router.post('/send-password-reset-token', sendPasswordResetToken);

// password reset
router.post('/password-reset/:token', passwordReset);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  checkAuth,
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/verifyToken');

// Public routes
router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/check-auth', verifyToken, checkAuth);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserRole,
} = require('../controllers/userController');
const { verifyToken } = require('../middleware/verifyToken');

// All routes are protected - require authentication
router.use(verifyToken);

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/:id', getUserById);

// @route   PATCH /api/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.patch('/:id/role', updateUserRole);

module.exports = router;
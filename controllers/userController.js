const asyncHandler = require('express-async-handler');
const { User } = require('../models/index.js');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
  
  const users = await User.findAll({
    attributes: { exclude: ['password'] }
  });
  
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  if (req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
  
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] }
  });
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  res.json(user);
});

// @desc    Update user role
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  if (req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
  
  const { role } = req.body;
  const user = await User.findByPk(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  await user.update({ role });
  
  const updatedUser = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] }
  });
  
  res.json(updatedUser);
});

module.exports = {
  getUsers,
  getUserById,
  updateUserRole,
};
const express = require('express');
const router = express.Router();
const {
  getTestSuites,
  getTestSuite,
  createTestSuite,
  updateTestSuite,
  deleteTestSuite,
} = require('../controllers/testsuiteController');
const { verifyToken } = require('../middleware/verifyToken');

// All routes are protected - require authentication
router.use(verifyToken);

// @route   GET /api/testsuites
// @desc    Get all test suites (optionally filter by project_id)
// @access  Private
router.get('/', getTestSuites);

// @route   GET /api/testsuites/:id
// @desc    Get a single test suite
// @access  Private
router.get('/:id', getTestSuite);

// @route   POST /api/testsuites
// @desc    Create a new test suite
// @access  Private
router.post('/', createTestSuite);

// @route   PUT /api/testsuites/:id
// @desc    Update a test suite
// @access  Private
router.put('/:id', updateTestSuite);

// @route   DELETE /api/testsuites/:id
// @desc    Delete a test suite
// @access  Private
router.delete('/:id', deleteTestSuite);

module.exports = router;
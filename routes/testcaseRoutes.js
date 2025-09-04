const express = require('express');
const router = express.Router();
const {
  getTestCases,
  getTestCase,
  createTestCase,
  updateTestCase,
  deleteTestCase,
} = require('../controllers/testcaseController');
const { verifyToken } = require('../middleware/verifyToken');

// All routes are protected - require authentication
router.use(verifyToken);

// @route   GET /api/testcases
// @desc    Get all test cases (optionally filter by test_plan_id or requirement_id)
// @access  Private
router.get('/', getTestCases);

// @route   GET /api/testcases/:id
// @desc    Get single test case
// @access  Private
router.get('/:id', getTestCase);

// @route   POST /api/testcases
// @desc    Create new test case
// @access  Private
router.post('/', createTestCase);

// @route   PUT /api/testcases/:id
// @desc    Update test case
// @access  Private
router.put('/:id', updateTestCase);

// @route   DELETE /api/testcases/:id
// @desc    Delete test case
// @access  Private
router.delete('/:id', deleteTestCase);

module.exports = router;
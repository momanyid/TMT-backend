const express = require('express');
const router = express.Router();
const {
  getTestCaseExecutions,
  getTestCaseExecution,
  createTestCaseExecution,
  updateTestCaseExecution,
  deleteTestCaseExecution,
} = require('../controllers/testcaseExecutionController.js');
const { verifyToken } = require('../middleware/verifyToken');

// All routes are protected - require authentication
router.use(verifyToken);

// @route   GET /api/testcaseexecutions
// @desc    Get all test case executions (optionally filter by project_id)
// @access  Private
router.get('/', getTestCaseExecutions);

// @route   GET /api/testcaseexecutions/:id
// @desc    Get a single test case execution
// @access  Private
router.get('/:id', getTestCaseExecution);

// @route   POST /api/testcaseexecutions
// @desc    Create a new test case execution
// @access  Private
router.post('/', createTestCaseExecution);

// @route   PUT /api/testcaseexecutions/:id
// @desc    Update a test case execution
// @access  Private
router.put('/:id', updateTestCaseExecution);

// @route   DELETE /api/testcaseexecutions/:id
// @desc    Delete a test case execution
// @access  Private
router.delete('/:id', deleteTestCaseExecution);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  getTestPlans,
  getTestPlan,
  createTestPlan,
  updateTestPlan,
  deleteTestPlan,
} = require('../controllers/testPlanController');
const { verifyToken } = require('../middleware/verifyToken');

// All routes are protected - require authentication
router.use(verifyToken);

// @route   GET /api/testplans
// @desc    Get all test plans (optionally filter by project)
// @access  Private
router.get('/', getTestPlans);

// @route   GET /api/testplans/:id
// @desc    Get single test plan
// @access  Private
router.get('/:id', getTestPlan);

// @route   POST /api/testplans
// @desc    Create new test plan
// @access  Private
router.post('/', createTestPlan);

// @route   PUT /api/testplans/:id
// @desc    Update test plan
// @access  Private
router.put('/:id', updateTestPlan);

// @route   DELETE /api/testplans/:id
// @desc    Delete test plan
// @access  Private
router.delete('/:id', deleteTestPlan);

module.exports = router;
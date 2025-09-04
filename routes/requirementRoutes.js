const express = require('express');
const router = express.Router();
const {
  createRequirement,
  getRequirementsByTestPlan,
  getRequirements,
  getRequirement,
  updateRequirement,
  deleteRequirement,
} = require('../controllers/requirementController');
const { verifyToken } = require('../middleware/verifyToken');

// All routes are protected - require authentication
router.use(verifyToken);

// @route   POST /api/requirements
// @desc    Create a new requirement (RTM entry) for a test plan
// @access  Private
router.post('/', createRequirement);

// @route   GET /api/requirements
// @desc    Get all requirements
// @access  Private
router.get('/', getRequirements);

// @route   GET /api/requirements/testplan/:testPlanId
// @desc    Get all requirements for a specific test plan (RTM for a test plan)
// @access  Private
router.get('/testplan/:testPlanId', getRequirementsByTestPlan);

// @route   GET /api/requirements/:id
// @desc    Get a single requirement by ID
// @access  Private
router.get('/:id', getRequirement);

// @route   PUT /api/requirements/:id
// @desc    Update a requirement
// @access  Private
router.put('/:id', updateRequirement);

// @route   DELETE /api/requirements/:id
// @desc    Delete a requirement
// @access  Private
router.delete('/:id', deleteRequirement);

module.exports = router;
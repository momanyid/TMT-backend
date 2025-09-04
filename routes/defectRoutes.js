const express = require('express');
const router = express.Router();
const {
  getDefects,
  createDefect,
  updateDefectStatus,
  getDefect,
  updateDefect,
  deleteDefect,
} = require('../controllers/defectController');
const { verifyToken } = require('../middleware/verifyToken');

// All routes are protected - require authentication
router.use(verifyToken);

// @route   GET /api/defects
// @desc    Get all defects (optionally filter by test_case_id)
// @access  Private
router.get('/', getDefects);

// @route   GET /api/defects/:id
// @desc    Get a single defect
// @access  Private
router.get('/:id', getDefect);

// @route   POST /api/defects
// @desc    Create a defect
// @access  Private
router.post('/', createDefect);

// @route   PUT /api/defects/:id
// @desc    Update a defect (full update)
// @access  Private
router.put('/:id', updateDefect);

// @route   PATCH /api/defects/:id/status
// @desc    Update defect status
// @access  Private
router.patch('/:id/status', updateDefectStatus);

// @route   DELETE /api/defects/:id
// @desc    Delete a defect
// @access  Private
router.delete('/:id', deleteDefect);

module.exports = router;
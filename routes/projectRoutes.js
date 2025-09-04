const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { verifyToken } = require('../middleware/verifyToken');

// All routes are protected - require authentication
router.use(verifyToken);

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', createProject);

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get('/', getProjects);

// @route   GET /api/projects/:id
// @desc    Get a single project by ID
// @access  Private
router.get('/:id', getProjectById);

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', deleteProject);

module.exports = router;
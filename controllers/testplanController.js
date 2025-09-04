const asyncHandler = require('express-async-handler');
const { TestPlan, Project, User, Requirement, TestCase } = require('../models/index.js');

// @desc    Get all test plans
// @route   GET /api/testplans
// @access  Private
// Optionally filter by project
const getTestPlans = asyncHandler(async (req, res) => {
  const { project } = req.query;
  const filter = project ? { projectId: project } : {};
  
  const plans = await TestPlan.findAll({
    where: filter,
    include: [
      { model: Project, as: 'project', attributes: ['id', 'projectName'] },
      { model: User, as: 'uploader', attributes: ['id', 'username', 'email'] }
    ]
  });
  
  res.json(plans);
});

// @desc    Get single test plan
// @route   GET /api/testplans/:id
// @access  Private
const getTestPlan = asyncHandler(async (req, res) => {
  const plan = await TestPlan.findByPk(req.params.id, {
    include: [
      { model: Project, as: 'project', attributes: ['id', 'projectName'] },
      { model: User, as: 'uploader', attributes: ['id', 'username', 'email'] },
      { model: Requirement, as: 'requirements', attributes: ['id', 'reqId', 'description'] },
      { model: TestCase, as: 'testCases', attributes: ['id', 'testCaseId', 'title', 'status'] }
    ]
  });
  
  if (!plan) {
    res.status(404);
    throw new Error('Test plan not found');
  }
  
  res.json(plan);
});

// @desc    Create new test plan
// @route   POST /api/testplans
// @access  Private
const createTestPlan = asyncHandler(async (req, res) => {
  const { title, description, projectId, link, startDate, endDate, status } = req.body;
  
  if (!title || !projectId) {
    res.status(400);
    throw new Error('Test plan title and project are required');
  }

  // Verify project exists
  const project = await Project.findByPk(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  
  const plan = await TestPlan.create({
    title,
    description,
    projectId,
    link,
    startDate,
    endDate,
    status,
    uploadedBy: req.user.id
  });
  
  res.status(201).json(plan);
});

// @desc    Update test plan
// @route   PUT /api/testplans/:id
// @access  Private
const updateTestPlan = asyncHandler(async (req, res) => {
  const plan = await TestPlan.findByPk(req.params.id);
  
  if (!plan) {
    res.status(404);
    throw new Error('Test plan not found');
  }
  
  if (plan.uploadedBy !== req.user.id || req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to update this test plan');
  }
  
  const { title, description, projectId, link, startDate, endDate, status } = req.body;
  
  await plan.update({
    title,
    description,
    projectId,
    link,
    startDate,
    endDate,
    status
  });
  
  const updated = await TestPlan.findByPk(req.params.id, {
    include: [
      { model: Project, as: 'project', attributes: ['id', 'projectName'] },
      { model: User, as: 'uploader', attributes: ['id', 'username', 'email'] }
    ]
  });
  
  res.json(updated);
});

// @desc    Delete test plan
// @route   DELETE /api/testplans/:id
// @access  Private
const deleteTestPlan = asyncHandler(async (req, res) => {
  const plan = await TestPlan.findByPk(req.params.id);
  
  if (!plan) {
    res.status(404);
    throw new Error('Test plan not found');
  }
  
  if (plan.uploadedBy !== req.user.id && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to delete this test plan');
  }
  
  await plan.destroy();
  res.json({ message: 'Test plan removed' });
});

module.exports = {
  getTestPlans,
  getTestPlan,
  createTestPlan,
  updateTestPlan,
  deleteTestPlan,
};
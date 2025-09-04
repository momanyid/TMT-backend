const asyncHandler = require('express-async-handler');
const { TestCase, TestPlan, Requirement, User, Defect } = require('../models/index.js');

// @desc    Get all test cases
// @route   GET /api/testcases
// @access  Private
// Optionally filter by test_plan_id or requirement_id
const getTestCases = asyncHandler(async (req, res) => {
  const { test_plan_id, requirement_id } = req.query;
  let filter = {};
  
  if (test_plan_id) filter.testPlanId = test_plan_id;
  if (requirement_id) filter.requirementId = requirement_id;
  
  const cases = await TestCase.findAll({
    where: filter,
    include: [
      { model: TestPlan, as: 'testPlan', attributes: ['id', 'title'] },
      { model: Requirement, as: 'requirement', attributes: ['id', 'reqId', 'description'] },
      { model: User, as: 'writer', attributes: ['id', 'username', 'email'] },
      { model: User, as: 'executor', attributes: ['id', 'username', 'email'] },
      { model: Defect, as: 'defects', attributes: ['id', 'defectId', 'title', 'status'] }
    ]
  });
  
  res.json(cases);
});

// @desc    Get single test case
// @route   GET /api/testcases/:id
// @access  Private
const getTestCase = asyncHandler(async (req, res) => {
  const testCase = await TestCase.findByPk(req.params.id, {
    include: [
      { model: TestPlan, as: 'testPlan', attributes: ['id', 'title'] },
      { model: Requirement, as: 'requirement', attributes: ['id', 'reqId', 'description'] },
      { model: User, as: 'writer', attributes: ['id', 'username', 'email'] },
      { model: User, as: 'executor', attributes: ['id', 'username', 'email'] },
      { model: Defect, as: 'defects', attributes: ['id', 'defectId', 'title', 'status'] }
    ]
  });
  
  if (!testCase) {
    res.status(404);
    throw new Error('Test case not found');
  }
  
  res.json(testCase);
});

// @desc    Create new test case
// @route   POST /api/testcases
// @access  Private
const createTestCase = asyncHandler(async (req, res) => {
  const { 
    testPlanId, 
    requirementId, 
    title, 
    preconditions, 
    testSteps, 
    testData,
    testSuite,
    expectedResults, 
    actualResults, 
    status, 
    testType, 
    executedByUserId, 
    executionDate, 
    remarks, 
    writtenByUserId,
    linkToTestplan
  } = req.body;
  
  if (!testPlanId || !title) {
    res.status(400);
    throw new Error('Test plan and title are required');
  }
  
  // Verify test plan exists
  const testPlan = await TestPlan.findByPk(testPlanId);
  if (!testPlan) {
    res.status(404);
    throw new Error('Test plan not found');
  }
  
  // Verify requirement exists and belongs to test plan (if provided)
  if (requirementId) {
    const requirement = await Requirement.findByPk(requirementId);
    if (!requirement) {
      res.status(404);
      throw new Error('Requirement (RTM entry) not found');
    }
    if (requirement.testPlanId !== testPlanId) {
      res.status(400);
      throw new Error('Requirement does not belong to the specified test plan');
    }
  }
  
  const testCase = await TestCase.create({
    testPlanId,
    requirementId,
    title,
    preconditions,
    testSteps,
    testData,
    testSuite,
    expectedResults,
    actualResults,
    status,
    testType,
    executedByUserId,
    executionDate,
    remarks,
    writtenByUserId: writtenByUserId || req.user.id,
    linkToTestplan
  });
  
  const createdTestCase = await TestCase.findByPk(testCase.id, {
    include: [
      { model: TestPlan, as: 'testPlan', attributes: ['id', 'title'] },
      { model: Requirement, as: 'requirement', attributes: ['id', 'reqId', 'description'] },
      { model: User, as: 'writer', attributes: ['id', 'username', 'email'] },
      { model: User, as: 'executor', attributes: ['id', 'username', 'email'] }
    ]
  });
  
  res.status(201).json(createdTestCase);
});

// @desc    Update test case
// @route   PUT /api/testcases/:id
// @access  Private
const updateTestCase = asyncHandler(async (req, res) => {
  const testCase = await TestCase.findByPk(req.params.id);
  
  if (!testCase) {
    res.status(404);
    throw new Error('Test case not found');
  }
  
  if (testCase.writtenByUserId && testCase.writtenByUserId !== req.user.id && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to update this test case');
  }
  
  await testCase.update(req.body);
  
  const updated = await TestCase.findByPk(req.params.id, {
    include: [
      { model: TestPlan, as: 'testPlan', attributes: ['id', 'title'] },
      { model: Requirement, as: 'requirement', attributes: ['id', 'reqId', 'description'] },
      { model: User, as: 'writer', attributes: ['id', 'username', 'email'] },
      { model: User, as: 'executor', attributes: ['id', 'username', 'email'] }
    ]
  });
  
  res.json(updated);
});

// @desc    Delete test case
// @route   DELETE /api/testcases/:id
// @access  Private
const deleteTestCase = asyncHandler(async (req, res) => {
  const testCase = await TestCase.findByPk(req.params.id);
  
  if (!testCase) {
    res.status(404);
    throw new Error('Test case not found');
  }
  
  if (testCase.writtenByUserId && testCase.writtenByUserId !== req.user.id && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to delete this test case');
  }
  
  await testCase.destroy();
  res.json({ message: 'Test case removed' });
});

module.exports = {
  getTestCases,
  getTestCase,
  createTestCase,
  updateTestCase,
  deleteTestCase,
};
const asyncHandler = require('express-async-handler');
const { TestCaseExecution, Project, User, TestCase, Defect } = require('../models/index.js');

// Get all test case executions (optionally filter by project)
const getTestCaseExecutions = asyncHandler(async (req, res) => {
  const { project_id } = req.query;
  const filter = project_id ? { projectId: project_id } : {};
  
  const executions = await TestCaseExecution.findAll({
    where: filter,
    include: [
      { model: Project, as: 'project', attributes: ['id', 'projectName'] },
      { model: User, as: 'assignee', attributes: ['id', 'username', 'email'] },
      { 
        model: TestCase, 
        as: 'testCases', 
        attributes: ['id', 'testCaseId', 'title', 'status'],
        through: { attributes: [] }
      },
      { model: Defect, as: 'bug', attributes: ['id', 'defectId', 'title', 'status'] }
    ]
  });
  
  res.json(executions);
});

// Get a single test case execution
const getTestCaseExecution = asyncHandler(async (req, res) => {
  const execution = await TestCaseExecution.findByPk(req.params.id, {
    include: [
      { model: Project, as: 'project', attributes: ['id', 'projectName'] },
      { model: User, as: 'assignee', attributes: ['id', 'username', 'email'] },
      { 
        model: TestCase, 
        as: 'testCases', 
        attributes: ['id', 'testCaseId', 'title', 'status'],
        through: { attributes: [] }
      },
      { model: Defect, as: 'bug', attributes: ['id', 'defectId', 'title', 'status'] }
    ]
  });
  
  if (!execution) {
    res.status(404);
    throw new Error('Test case execution not found');
  }
  
  res.json(execution);
});

// Create a new test case execution
const createTestCaseExecution = asyncHandler(async (req, res) => {
  const { 
    testSuiteName, 
    projectId, 
    status, 
    startDate, 
    endDate, 
    bugId, 
    executedBy, 
    executedDate, 
    assignedToUserId, 
    remarks, 
    testCaseIds
  } = req.body;
  
  if (!testSuiteName || !projectId || !testCaseIds || !Array.isArray(testCaseIds) || testCaseIds.length === 0) {
    res.status(400);
    throw new Error('Test suite name, project, and at least one test case are required');
  }
  
  // Verify project exists
  const project = await Project.findByPk(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  
  // Validate test_case_ids exist
  const testCases = await TestCase.findAll({ 
    where: { id: testCaseIds },
    attributes: ['id']
  });
  
  if (testCases.length !== testCaseIds.length) {
    res.status(400);
    throw new Error('One or more test cases not found');
  }
  
  const execution = await TestCaseExecution.create({
    testSuiteName,
    projectId,
    status,
    startDate,
    endDate,
    bugId,
    executedBy,
    executedDate,
    assignedToUserId,
    remarks
  });
  
  // Associate test cases with the test case execution using the junction table
  await execution.setTestCases(testCaseIds);
  
  const createdExecution = await TestCaseExecution.findByPk(execution.id, {
    include: [
      { model: Project, as: 'project', attributes: ['id', 'projectName'] },
      { model: User, as: 'assignee', attributes: ['id', 'username', 'email'] },
      { 
        model: TestCase, 
        as: 'testCases', 
        attributes: ['id', 'testCaseId', 'title', 'status'],
        through: { attributes: [] }
      },
      { model: Defect, as: 'bug', attributes: ['id', 'defectId', 'title', 'status'] }
    ]
  });
  
  res.status(201).json(createdExecution);
});

// Update a test case execution
const updateTestCaseExecution = asyncHandler(async (req, res) => {
  const execution = await TestCaseExecution.findByPk(req.params.id);
  
  if (!execution) {
    res.status(404);
    throw new Error('Test case execution not found');
  }
  
  const { testCaseIds, ...updateData } = req.body;
  
  // Update the execution data
  await execution.update(updateData);
  
  // Update test case associations if provided
  if (testCaseIds && Array.isArray(testCaseIds)) {
    // Validate test case IDs exist
    const testCases = await TestCase.findAll({ 
      where: { id: testCaseIds },
      attributes: ['id']
    });
    
    if (testCases.length !== testCaseIds.length) {
      res.status(400);
      throw new Error('One or more test cases not found');
    }
    
    await execution.setTestCases(testCaseIds);
  }
  
  const updated = await TestCaseExecution.findByPk(req.params.id, {
    include: [
      { model: Project, as: 'project', attributes: ['id', 'projectName'] },
      { model: User, as: 'assignee', attributes: ['id', 'username', 'email'] },
      { 
        model: TestCase, 
        as: 'testCases', 
        attributes: ['id', 'testCaseId', 'title', 'status'],
        through: { attributes: [] }
      },
      { model: Defect, as: 'bug', attributes: ['id', 'defectId', 'title', 'status'] }
    ]
  });
  
  res.json(updated);
});

// Delete a test case execution
const deleteTestCaseExecution = asyncHandler(async (req, res) => {
  const execution = await TestCaseExecution.findByPk(req.params.id);
  
  if (!execution) {
    res.status(404);
    throw new Error('Test case execution not found');
  }
  
  await execution.destroy();
  res.json({ message: 'Test case execution deleted' });
});

module.exports = {
  getTestCaseExecutions,
  getTestCaseExecution,
  createTestCaseExecution,
  updateTestCaseExecution,
  deleteTestCaseExecution
};
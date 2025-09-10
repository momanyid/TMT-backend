const asyncHandler = require('express-async-handler');
const { sequelize, TestSuite, Project, User, TestCase, Defect } = require('../models/index.js');

// Get all test suites (optionally filter by project)
const getTestSuites = asyncHandler(async (req, res) => {
  const { project_id } = req.query;
  const filter = project_id ? { projectId: project_id } : {};

  const suites = await TestSuite.findAll({
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

  res.json(suites);
});

// Get a single test suite
const getTestSuite = asyncHandler(async (req, res) => {
  const suite = await TestSuite.findByPk(req.params.id, {
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

  if (!suite) {
    res.status(404);
    throw new Error('Test suite not found');
  }

  res.json(suite);
});

// Create a new test suite (transaction-safe)
const createTestSuite = asyncHandler(async (req, res) => {
  const {
    testSuiteName,
    projectId,
    startDate,
    endDate,
    bugId,
    executedBy,
    executedDate,
    assignedToUserId,
    testCaseIds
  } = req.body;

  if (!testSuiteName || !projectId || !testCaseIds || !Array.isArray(testCaseIds) || testCaseIds.length === 0) {
    res.status(400);
    throw new Error('Test suite name, project, and at least one test case are required');
  }

  // Validate project exists
  const project = await Project.findByPk(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Validate test cases
  const testCases = await TestCase.findAll({
    where: { id: testCaseIds },
    attributes: ['id']
  });
  if (testCases.length !== testCaseIds.length) {
    res.status(400);
    throw new Error('One or more test cases not found');
  }

  // Transaction for atomicity
  const result = await sequelize.transaction(async (t) => {
    const suite = await TestSuite.create(
      {
        testSuiteName,
        projectId,
        startDate,
        endDate,
        bugId,
        executedBy,
        executedDate,
        assignedToUserId
      },
      { transaction: t }
    );

    await suite.setTestCases(testCaseIds, { transaction: t });

    return await TestSuite.findByPk(suite.id, {
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
      ],
      transaction: t
    });
  });

  res.status(201).json(result);
});

// Update a test suite (transaction-safe)
const updateTestSuite = asyncHandler(async (req, res) => {
  const { testCaseIds, ...updateData } = req.body;

  // Validate suite exists
  const suite = await TestSuite.findByPk(req.params.id);
  if (!suite) {
    res.status(404);
    throw new Error('Test suite not found');
  }

  // Validate test cases before touching DB
  if (testCaseIds && Array.isArray(testCaseIds)) {
    const testCases = await TestCase.findAll({
      where: { id: testCaseIds },
      attributes: ['id']
    });
    if (testCases.length !== testCaseIds.length) {
      res.status(400);
      throw new Error('One or more test cases not found');
    }
  }

  // Transaction ensures update + associations are atomic
  const result = await sequelize.transaction(async (t) => {
    await suite.update(updateData, { transaction: t });

    if (testCaseIds && Array.isArray(testCaseIds)) {
      await suite.setTestCases(testCaseIds, { transaction: t });
    }

    return await TestSuite.findByPk(req.params.id, {
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
      ],
      transaction: t
    });
  });

  res.json(result);
});

// Delete a test suite (transaction-safe)
const deleteTestSuite = asyncHandler(async (req, res) => {
  const suite = await TestSuite.findByPk(req.params.id);
  if (!suite) {
    res.status(404);
    throw new Error('Test suite not found');
  }

  await sequelize.transaction(async (t) => {
    await suite.destroy({ transaction: t });
  });

  res.json({ message: 'Test suite deleted' });
});

module.exports = {
  getTestSuites,
  getTestSuite,
  createTestSuite,
  updateTestSuite,
  deleteTestSuite
};

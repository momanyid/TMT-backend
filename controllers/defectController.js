const asyncHandler = require('express-async-handler');
const { Defect, TestCase, User } = require('../models/index.js');

// @desc    Get all defects
// @route   GET /api/defects
// @access  Private
// Optionally filter by test_case_id
const getDefects = asyncHandler(async (req, res) => {
  const { test_case_id } = req.query;
  const filter = test_case_id ? { testCaseId: test_case_id } : {};
  
  const defects = await Defect.findAll({
    where: filter,
    include: [
      { 
        model: TestCase, 
        as: 'testCase', 
        attributes: ['id', 'testCaseId', 'title'] 
      },
      { 
        model: User, 
        as: 'reporter', 
        attributes: ['id', 'username', 'email'] 
      },
      { 
        model: User, 
        as: 'assignee', 
        attributes: ['id', 'username', 'email'] 
      }
    ]
  });
  
  res.json(defects);
});

// @desc    Get a single defect
// @route   GET /api/defects/:id
// @access  Private
const getDefect = asyncHandler(async (req, res) => {
  const defect = await Defect.findByPk(req.params.id, {
    include: [
      { 
        model: TestCase, 
        as: 'testCase', 
        attributes: ['id', 'testCaseId', 'title'] 
      },
      { 
        model: User, 
        as: 'reporter', 
        attributes: ['id', 'username', 'email'] 
      },
      { 
        model: User, 
        as: 'assignee', 
        attributes: ['id', 'username', 'email'] 
      }
    ]
  });
  
  if (!defect) {
    res.status(404);
    throw new Error('Defect not found');
  }
  
  res.json(defect);
});

// @desc    Create a defect
// @route   POST /api/defects
// @access  Private
const createDefect = asyncHandler(async (req, res) => {
  const { 
    testCaseId, 
    title, 
    description, 
    status, 
    priority,
    severity,
    stepsToReproduce,
    expectedResult,
    actualResult,
    attachments,
    environment,
    assignedToUserId,
    remarks
  } = req.body;
  
  if (!testCaseId || !title || !description) {
    res.status(400);
    throw new Error('Test case, title, and description are required');
  }
  
  // Verify test case exists
  const testCase = await TestCase.findByPk(testCaseId);
  if (!testCase) {
    res.status(404);
    throw new Error('Test case not found');
  }
  
  const defect = await Defect.create({
    testCaseId,
    title,
    description,
    status,
    priority,
    severity,
    stepsToReproduce,
    expectedResult,
    actualResult,
    attachments,
    environment,
    assignedToUserId,
    reportedByUserId: req.user.id,
    dateReported: new Date(),
    remarks
  });
  
  const createdDefect = await Defect.findByPk(defect.id, {
    include: [
      { 
        model: TestCase, 
        as: 'testCase', 
        attributes: ['id', 'testCaseId', 'title'] 
      },
      { 
        model: User, 
        as: 'reporter', 
        attributes: ['id', 'username', 'email'] 
      },
      { 
        model: User, 
        as: 'assignee', 
        attributes: ['id', 'username', 'email'] 
      }
    ]
  });
  
  res.status(201).json(createdDefect);
});

// @desc    Update a defect (full update)
// @route   PUT /api/defects/:id
// @access  Private
const updateDefect = asyncHandler(async (req, res) => {
  const defect = await Defect.findByPk(req.params.id);
  
  if (!defect) {
    res.status(404);
    throw new Error('Defect not found');
  }
  
  await defect.update(req.body);
  
  const updated = await Defect.findByPk(req.params.id, {
    include: [
      { 
        model: TestCase, 
        as: 'testCase', 
        attributes: ['id', 'testCaseId', 'title'] 
      },
      { 
        model: User, 
        as: 'reporter', 
        attributes: ['id', 'username', 'email'] 
      },
      { 
        model: User, 
        as: 'assignee', 
        attributes: ['id', 'username', 'email'] 
      }
    ]
  });
  
  res.json(updated);
});

// @desc    Update defect status
// @route   PATCH /api/defects/:id/status
// @access  Private
const updateDefectStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const defect = await Defect.findByPk(req.params.id);
  
  if (!defect) {
    res.status(404);
    throw new Error('Defect not found');
  }
  
  await defect.update({ status });
  
  const updated = await Defect.findByPk(req.params.id, {
    include: [
      { 
        model: TestCase, 
        as: 'testCase', 
        attributes: ['id', 'testCaseId', 'title'] 
      },
      { 
        model: User, 
        as: 'reporter', 
        attributes: ['id', 'username', 'email'] 
      },
      { 
        model: User, 
        as: 'assignee', 
        attributes: ['id', 'username', 'email'] 
      }
    ]
  });
  
  res.json(updated);
});

// @desc    Delete a defect
// @route   DELETE /api/defects/:id
// @access  Private
const deleteDefect = asyncHandler(async (req, res) => {
  const defect = await Defect.findByPk(req.params.id);
  
  if (!defect) {
    res.status(404);
    throw new Error('Defect not found');
  }
  
  await defect.destroy();
  res.json({ message: 'Defect deleted' });
});

module.exports = {
  getDefects,
  createDefect,
  updateDefectStatus,
  getDefect,
  updateDefect,
  deleteDefect,
};
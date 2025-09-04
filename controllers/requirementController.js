const { Requirement, TestPlan, TestCase } = require('../models/index.js');

// Create a new Requirement (RTM entry) for a TestPlan
exports.createRequirement = async (req, res) => {
  try {
    const { reqId, description, testPlanId, mainFeature, featureSubsection, remarks, status, testStatus, testcaseIds, actions } = req.body;
    
    if (!reqId || !description || !testPlanId) {
      return res.status(400).json({ message: 'reqId, description, and testPlanId are required' });
    }
    
    // Ensure the testPlan exists
    const plan = await TestPlan.findByPk(testPlanId);
    if (!plan) {
      return res.status(404).json({ message: 'TestPlan not found' });
    }
    
    const requirement = await Requirement.create({
      reqId,
      description,
      testPlanId,
      mainFeature,
      featureSubsection,
      remarks,
      status,
      testStatus,
      testcaseIds,
      actions
    });
    
    res.status(201).json(requirement);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Requirement ID already exists' });
    }
    res.status(500).json({ message: err.message });
  }
};

// Get all requirements for a test plan (RTM for a test plan)
exports.getRequirementsByTestPlan = async (req, res) => {
  try {
    const { testPlanId } = req.params;
    const requirements = await Requirement.findAll({
      where: { testPlanId },
      include: [
        {
          model: TestPlan,
          as: 'testPlan',
          attributes: ['id', 'title']
        },
        {
          model: TestCase,
          as: 'testCases',
          attributes: ['id', 'testCaseId', 'title', 'status']
        }
      ]
    });
    res.status(200).json(requirements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all requirements
exports.getRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.findAll({
      include: [
        {
          model: TestPlan,
          as: 'testPlan',
          attributes: ['id', 'title']
        },
        {
          model: TestCase,
          as: 'testCases',
          attributes: ['id', 'testCaseId', 'title', 'status']
        }
      ]
    });
    res.status(200).json(requirements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single requirement by ID
exports.getRequirement = async (req, res) => {
  try {
    const requirement = await Requirement.findByPk(req.params.id, {
      include: [
        {
          model: TestPlan,
          as: 'testPlan',
          attributes: ['id', 'title']
        },
        {
          model: TestCase,
          as: 'testCases',
          attributes: ['id', 'testCaseId', 'title', 'status']
        }
      ]
    });
    
    if (!requirement) return res.status(404).json({ message: 'Requirement not found' });
    res.status(200).json(requirement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a requirement
exports.updateRequirement = async (req, res) => {
  try {
    const requirement = await Requirement.findByPk(req.params.id);
    
    if (!requirement) return res.status(404).json({ message: 'Requirement not found' });
    
    await requirement.update(req.body);
    
    const updated = await Requirement.findByPk(req.params.id, {
      include: [
        {
          model: TestPlan,
          as: 'testPlan',
          attributes: ['id', 'title']
        },
        {
          model: TestCase,
          as: 'testCases',
          attributes: ['id', 'testCaseId', 'title', 'status']
        }
      ]
    });
    
    res.status(200).json(updated);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Requirement ID already exists' });
    }
    res.status(500).json({ message: err.message });
  }
};

// Delete a requirement
exports.deleteRequirement = async (req, res) => {
  try {
    const requirement = await Requirement.findByPk(req.params.id);
    if (!requirement) return res.status(404).json({ message: 'Requirement not found' });
    
    await requirement.destroy();
    res.status(200).json({ message: 'Requirement deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
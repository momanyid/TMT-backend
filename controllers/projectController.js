const { Project, TestPlan } = require('../models/index.js');

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { projectName, description, projectStatus, teamSize, startDate, endDate } = req.body;
    if (!projectName) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    const project = await Project.create({ projectName, description, projectStatus, teamSize, startDate, endDate });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{
        model: TestPlan,
        as: 'testPlans',
        attributes: ['id', 'title', 'status']
      }]
    });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [{
        model: TestPlan,
        as: 'testPlans',
        attributes: ['id', 'title', 'status', 'startDate', 'endDate']
      }]
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const { projectName, description, projectStatus, teamSize, startDate, endDate } = req.body;
    const project = await Project.findByPk(req.params.id);
    
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    await project.update({ projectName, description, projectStatus, teamSize, startDate, endDate });
    
    const updatedProject = await Project.findByPk(req.params.id, {
      include: [{
        model: TestPlan,
        as: 'testPlans',
        attributes: ['id', 'title', 'status']
      }]
    });
    
    res.status(200).json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    await project.destroy();
    res.status(200).json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
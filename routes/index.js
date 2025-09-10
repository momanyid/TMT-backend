const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const projectRoutes = require('./projectRoutes');
const testPlanRoutes = require('./testplanRoutes');
const requirementRoutes = require('./requirementRoutes');
const testCaseRoutes = require('./testcaseRoutes');
const defectRoutes = require('./defectRoutes');
const testSuiteRoutes = require('./testsuiteRoutes');
const testCaseExecutionRoutes = require('./testcaseExecutionRoutes');

// Define route prefixes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/testplans', testPlanRoutes);
router.use('/requirements', requirementRoutes);
router.use('/testcases', testCaseRoutes);
router.use('/defects', defectRoutes);
router.use('/testsuites', testSuiteRoutes);
router.use('/testcase-executions', testCaseExecutionRoutes);


// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ 
    message: 'Test Management API is running', 
    timestamp: new Date().toISOString() 
  });
});

module.exports = router;
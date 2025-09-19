const { Sequelize } = require('sequelize');

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/testmanagement', {
  dialect: 'postgres',
  logging: console.log, // Set to false in production
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Import models
const User = require('./userModel')(sequelize);
const Project = require('./projectModel')(sequelize);
const TestPlan = require('./testplanModel')(sequelize);
const Requirement = require('./requirementModel')(sequelize);
const TestCase = require('./testcaseModel')(sequelize);
const Defect = require('./defectModel')(sequelize);
const TestSuite = require('./testSuiteModel')(sequelize);
const TestCaseExecution = require('./TestcaseExecutionModel')(sequelize);
const Report = require('./reportModel')(sequelize);
const TestSuiteTestCases = require('./testSuiteTestCaseModel')(sequelize);
const TestCaseExecutionTestCases = require('./testCaseExecutionTestCasesModel')(sequelize);

// Define associations
const setupAssociations = () => {
  // User associations
  User.hasMany(TestPlan, { foreignKey: 'uploadedBy', as: 'uploadedTestPlans' });
  User.hasMany(TestCase, { foreignKey: 'executedByUserId', as: 'executedTestCases' });
  User.hasMany(TestCase, { foreignKey: 'writtenByUserId', as: 'writtenTestCases' });
  User.hasMany(Defect, { foreignKey: 'assignedToUserId', as: 'assignedDefects' });
  User.hasMany(Defect, { foreignKey: 'reportedByUserId', as: 'reportedDefects' });
  User.hasMany(TestSuite, { foreignKey: 'assignedToUserId', as: 'assignedTestSuites' });
  User.hasMany(TestCaseExecution, { foreignKey: 'assignedToUserId', as: 'assignedTestCaseExecutions' });
  User.hasMany(Report, { foreignKey: 'generatedByUserId', as: 'generatedReports' });

  // Project associations
  Project.hasMany(TestPlan, { foreignKey: 'projectId', as: 'testPlans' });
  Project.hasMany(TestSuite, { foreignKey: 'projectId', as: 'testSuites' });
  Project.hasMany(TestCaseExecution, { foreignKey: 'projectId', as: 'testCaseExecutions' });

  // TestPlan associations
  TestPlan.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
  TestPlan.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });
  TestPlan.hasMany(Requirement, { foreignKey: 'testPlanId', as: 'requirements' });
  TestPlan.hasMany(TestCase, { foreignKey: 'testPlanId', as: 'testCases' });

  // Requirement associations
  Requirement.belongsTo(TestPlan, { foreignKey: 'testPlanId', as: 'testPlan' });
  Requirement.hasMany(TestCase, { foreignKey: 'requirementId', as: 'testCases' });

  // TestCase associations
  TestCase.belongsTo(TestPlan, { foreignKey: 'testPlanId', as: 'testPlan' });
  TestCase.belongsTo(Requirement, { foreignKey: 'requirementId', as: 'requirement' });
  TestCase.belongsTo(User, { foreignKey: 'executedByUserId', as: 'executor' });
  TestCase.belongsTo(User, { foreignKey: 'writtenByUserId', as: 'writer' });
  TestCase.hasMany(Defect, { foreignKey: 'testCaseId', as: 'defects' });
  
  // Many-to-many associations
  TestCase.belongsToMany(TestSuite, { 
    through: TestSuiteTestCases, 
    foreignKey: 'test_case_id',
    otherKey: 'test_suite_id',
    as: 'testSuites'
  });

  TestCase.belongsToMany(TestCaseExecution, { 
    through: TestCaseExecutionTestCases, 
    foreignKey: 'test_case_id',
    otherKey: 'test_case_execution_id',
    as: 'testCaseExecutions' 
  });

  // Defect associations
  Defect.belongsTo(TestCase, { foreignKey: 'testCaseId', as: 'testCase' });
  Defect.belongsTo(User, { foreignKey: 'assignedToUserId', as: 'assignee' });
  Defect.belongsTo(User, { foreignKey: 'reportedByUserId', as: 'reporter' });
  Defect.hasMany(TestSuite, { foreignKey: 'bugId', as: 'testSuites' });
  Defect.hasMany(TestCaseExecution, { foreignKey: 'bugId', as: 'testCaseExecutions' });

  // TestSuite associations
  TestSuite.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
  TestSuite.belongsTo(Defect, { foreignKey: 'bugId', as: 'bug' });
  TestSuite.belongsTo(User, { foreignKey: 'assignedToUserId', as: 'assignee' });
  TestSuite.belongsToMany(TestCase, { 
    through: TestSuiteTestCases, 
    foreignKey: 'test_suite_id',
    otherKey: 'test_case_id',
    as: 'testCases' 
  });

  // TestCaseExecution associations
  TestCaseExecution.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
  TestCaseExecution.belongsTo(Defect, { foreignKey: 'bugId', as: 'bug' });
  TestCaseExecution.belongsTo(User, { foreignKey: 'assignedToUserId', as: 'assignee' });
  TestCaseExecution.belongsToMany(TestCase, { 
    through: TestCaseExecutionTestCases, 
    foreignKey: 'test_case_execution_id',
    otherKey: 'test_case_id',
    as: 'testCases' 
  });

  // Report associations
  Report.belongsTo(User, { foreignKey: 'generatedByUserId', as: 'generator' });
};

// Initialize associations
setupAssociations();

module.exports = {
  sequelize,
  User,
  Project,
  TestPlan,
  Requirement,
  TestCase,
  Defect,
  TestSuite,
  TestCaseExecution,
  TestCaseExecutionTestCases,
  Report,
};

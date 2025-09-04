const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TestCase = sequelize.define('TestCase', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    testCaseId: { type: DataTypes.STRING(50), unique: true, field: 'test_case_id' },
    testPlanId: { type: DataTypes.UUID, allowNull: false, field: 'test_plan_id', references: { model: 'test_plans', key: 'id' } },
    requirementId: { type: DataTypes.UUID, field: 'requirement_id', references: { model: 'requirements', key: 'id' } },
    title: { type: DataTypes.STRING(500), allowNull: false },
    preconditions: { type: DataTypes.TEXT },
    testSteps: { type: DataTypes.TEXT, field: 'test_steps' },
    testData: { type: DataTypes.TEXT, field: 'test_data' },
    testSuite: { type: DataTypes.STRING, field: 'test_suite' },
    expectedResults: { type: DataTypes.TEXT, field: 'expected_results' },
    actualResults: { type: DataTypes.TEXT, field: 'actual_results' },
    status: { type: DataTypes.STRING(50) },
    testType: { type: DataTypes.ENUM('Manual', 'Automated', 'Performance'), defaultValue: 'Manual', field: 'test_type' },
    executedByUserId: { type: DataTypes.UUID, field: 'executed_by_user_id', references: { model: 'users', key: 'id' } },
    executionDate: { type: DataTypes.DATE, field: 'execution_date' },
    remarks: { type: DataTypes.TEXT },
    writtenByUserId: { type: DataTypes.UUID, field: 'written_by_user_id', references: { model: 'users', key: 'id' } },
    linkToTestplan: { type: DataTypes.STRING(500), field: 'link_to_testplan' }
  }, {
    tableName: 'test_cases',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (testCase) => {
        if (!testCase.testCaseId) {
          const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
          const count = await TestCase.count() + 1;
          testCase.testCaseId = `TC-${date}-${String(count).padStart(4, '0')}`;
        }
      }
    }
  });

  return TestCase;
};
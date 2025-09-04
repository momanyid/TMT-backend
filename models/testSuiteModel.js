const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TestSuite = sequelize.define('TestSuite', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    testSuiteName: { type: DataTypes.STRING, allowNull: false, field: 'test_suite_name' },
    projectId: { type: DataTypes.UUID, allowNull: false, field: 'project_id', references: { model: 'projects', key: 'id' } },
    startDate: { type: DataTypes.DATEONLY, field: 'start_date' },
    endDate: { type: DataTypes.DATEONLY, field: 'end_date' },
    bugId: { type: DataTypes.UUID, field: 'bug_id', references: { model: 'defects', key: 'id' } },
    executedBy: { type: DataTypes.STRING, field: 'executed_by' },
    executedDate: { type: DataTypes.STRING(50), field: 'executed_date' },
    assignedToUserId: { type: DataTypes.UUID, field: 'assigned_to_user_id', references: { model: 'users', key: 'id' } }
  }, {
    tableName: 'test_suites',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return TestSuite;
};
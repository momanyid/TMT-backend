const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('TestCaseExecutionTestCases', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    test_case_execution_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    test_case_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'test_case_execution_test_cases',
    timestamps: false
  });
};

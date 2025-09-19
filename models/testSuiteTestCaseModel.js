const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('TestSuiteTestCases', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    test_suite_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    test_case_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'test_suite_test_cases',
    timestamps: false
  });
};

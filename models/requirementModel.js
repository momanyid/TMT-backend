const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Requirement = sequelize.define('Requirement', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    reqId: { type: DataTypes.STRING(100), allowNull: false, unique: true, field: 'req_id' },
    description: { type: DataTypes.TEXT, allowNull: false },
    testPlanId: { type: DataTypes.UUID, allowNull: false, field: 'test_plan_id', references: { model: 'test_plans', key: 'id' } },
    mainFeature: { type: DataTypes.STRING, field: 'main_feature' },
    featureSubsection: { type: DataTypes.STRING, field: 'feature_subsection' },
    remarks: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING(50) },
    testStatus: { type: DataTypes.ENUM('Pass', 'Fail'), field: 'test_status' },
    testcaseIds: { type: DataTypes.TEXT, field: 'testcase_ids' },
    actions: { type: DataTypes.TEXT }
  }, {
    tableName: 'requirements',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Requirement;
};
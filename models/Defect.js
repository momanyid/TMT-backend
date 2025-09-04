const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Defect = sequelize.define('Defect', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    defectId: { type: DataTypes.STRING(50), unique: true, field: 'defect_id' },
    testCaseId: { type: DataTypes.UUID, allowNull: false, field: 'test_case_id', references: { model: 'test_cases', key: 'id' } },
    title: { type: DataTypes.STRING(500), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING(50) },
    priority: { type: DataTypes.STRING(20) },
    severity: { type: DataTypes.STRING(20) },
    stepsToReproduce: { type: DataTypes.TEXT, field: 'steps_to_reproduce' },
    expectedResult: { type: DataTypes.TEXT, field: 'expected_result' },
    actualResult: { type: DataTypes.TEXT, field: 'actual_result' },
    attachments: { type: DataTypes.TEXT },
    environment: { type: DataTypes.STRING },
    assignedToUserId: { type: DataTypes.UUID, field: 'assigned_to_user_id', references: { model: 'users', key: 'id' } },
    reportedByUserId: { type: DataTypes.UUID, allowNull: false, field: 'reported_by_user_id', references: { model: 'users', key: 'id' } },
    dateReported: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'date_reported' },
    remarks: { type: DataTypes.TEXT }
  },
  {
    tableName: 'defects',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (defect) => {
        if (!defect.defectId) {
          const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
          const count = await Defect.count() + 1;
          defect.defectId = `BUG-${date}-${String(count).padStart(4, '0')}`;
        }
      }
    }
  });

  return Defect;
};
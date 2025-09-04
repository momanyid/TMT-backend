const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TestPlan = sequelize.define('TestPlan', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    projectId: { type: DataTypes.UUID, allowNull: false, field: 'project_id', references: { model: 'projects', key: 'id' } },
    link: { type: DataTypes.STRING(500), allowNull: false },
    startDate: { type: DataTypes.DATEONLY, field: 'start_date' },
    endDate: { type: DataTypes.DATEONLY, field: 'end_date' },
    status: { type: DataTypes.ENUM('Draft', 'In Progress', 'Completed'), defaultValue: 'Draft' },
    uploadedBy: { type: DataTypes.UUID, allowNull: false, field: 'uploaded_by', references: { model: 'users', key: 'id' } }
  }, {
    tableName: 'test_plans',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return TestPlan;
};
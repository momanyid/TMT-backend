const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    projectName: { type: DataTypes.STRING, allowNull: false, field: 'project_name' },
    startDate: { type: DataTypes.DATEONLY, field: 'start_date' },
    endDate: { type: DataTypes.DATEONLY, field: 'end_date' }
  },
  {
    tableName: 'projects',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Project;
};
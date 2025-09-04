const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Report = sequelize.define('Report', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    reportName: { type: DataTypes.STRING, allowNull: false, field: 'report_name' },
    reportType: { type: DataTypes.STRING(100), allowNull: false, field: 'report_type' },
    generatedByUserId: { type: DataTypes.UUID, allowNull: false, field: 'generated_by_user_id', references: { model: 'users', key: 'id' } },
    generationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'generation_date' },
    linkToFile: { type: DataTypes.STRING(500), field: 'link_to_file' }
  }, {
    tableName: 'reports',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Report;
};
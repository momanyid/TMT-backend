const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
    lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING(20), field: 'phone_number' },
    role: { type: DataTypes.ENUM('Tester', 'Lead', 'Admin', 'QA', 'Developer'), defaultValue: 'Tester' },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_verified' },
    resetPasswordToken: { type: DataTypes.STRING, field: 'reset_password_token' },
    resetPasswordExpiresAt: { type: DataTypes.DATE, field: 'reset_password_expires_at' },
    verificationToken: { type: DataTypes.STRING, field: 'verification_token' },
    verificationTokenExpiresAt: { type: DataTypes.DATE, field: 'verification_token_expires_at' }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return User;
};
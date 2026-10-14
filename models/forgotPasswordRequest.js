const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const ForgotPasswordRequests = sequelize.define('forgotpasswordrequest', {
  id: {
    type: DataTypes.STRING, // Stores the UUID string
    primaryKey: true,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

module.exports = ForgotPasswordRequests;
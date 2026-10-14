const Sequelize = require('sequelize');

// Replace with your actual MySQL database credentials
const sequelize = new Sequelize('rst', 'root', 'Mahi@1234', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('locadora_ads', 'root', '', { 
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
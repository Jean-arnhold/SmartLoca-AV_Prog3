const Sequelize = require('sequelize');    
const sequelize = require('../config/db');  
const { DataTypes } = Sequelize;            

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.Cliente = require('./cliente.js')(sequelize, DataTypes);
db.Carro = require('./carro.js')(sequelize, DataTypes);
db.Locacao = require('./locacao.js')(sequelize, DataTypes);


db.Cliente.hasMany(db.Locacao, { foreignKey: 'cliente_id' });
db.Locacao.belongsTo(db.Cliente, { foreignKey: 'cliente_id' });

db.Carro.hasMany(db.Locacao, { foreignKey: 'carro_id' });
db.Locacao.belongsTo(db.Carro, { foreignKey: 'carro_id' });

module.exports = db;
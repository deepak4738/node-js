const Sequelize = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(
    config.mysql.db,
    config.mysql.user,
    config.mysql.password,
     {
       host: config.mysql.host,
       dialect: 'mysql'
     }
);

module.exports = sequelize;
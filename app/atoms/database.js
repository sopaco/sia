var sequelize;

function setup() {
    let envConf = require('../../config/env');
    let mysqlConf = envConf.mysql;
    let Sequelize = require('sequelize');
    sequelize = new Sequelize(mysqlConf.schema, mysqlConf.username, mysqlConf.password, {
        host: mysqlConf.host,
        dialect: 'mysql',
        pool: {
            max: mysqlConf.pool.max,
            min: mysqlConf.pool.min,
            idle: mysqlConf.pool.idle,
        },
    });
}

function getDatabase() {
    return sequelize;
}

module.exports = {
    setup,
    getDatabase,
}
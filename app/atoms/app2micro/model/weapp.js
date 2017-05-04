let Sequelize = require('sequelize');
var WeApp = null;
module.exports = sequelize => {
    if(WeApp) {
        return WeApp;
    }
    WeApp = sequelize.define(
        'app2micro_weapp',
        {
            minapp_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            minapp_rating: {
                type: Sequelize.INTEGER,
                defaultValue: 4,
            },
            name: {//名称
                type: Sequelize.STRING,
                allowNull: false,
            },
            qr_url: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_time_at_wechat: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            icon_url: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT
            }
        },
        {
            freezeTableName: true,
            paranoid: false
        }
    );

    var ScreenShot = require('./screenshot')(sequelize);
    ScreenShot.belongsTo(WeApp);
    WeApp.hasMany(ScreenShot, {as: 'ScreenShots'});
    return WeApp;
};
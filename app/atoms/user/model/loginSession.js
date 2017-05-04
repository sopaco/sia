let Sequelize = require('sequelize');
var LoginSession = null;
module.exports = sequelize => {
    if(LoginSession) {
        return LoginSession;
    }
    LoginSession = sequelize.define(
        'loginSession',
        {
            value: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM,
                values: ['self', 'open_platform'],
                allowNull: false,
            },
            deviceId: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

        },
        {
            freezeTableName: true,
            paranoid: false,
        }
    );
    // var User = require('./user');
    // User.hasMany(Comment);
    // Comment.belongsTo(User);
    return LoginSession;
}
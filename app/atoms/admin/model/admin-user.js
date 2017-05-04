var Sequelize = require('sequelize');
var AdminUser = null;
module.exports = sequelize => {
    if(AdminUser) {
        return AdminUser;
    }
    AdminUser = sequelize.define(
        'admin_user',
        {
            phone: {
                type: Sequelize.STRING,
                allowNull: true,
                unique: true,
                validate: {
                    is: /^1[3|4|5|7|8][0-9]\d{8}$/,
                },
            },
            email: {
                type: Sequelize.STRING,
                allowNull: true,
                validate: {
                    isEmail: true,
                },
            },
            nickname: {
                type: Sequelize.STRING(64),
                allowNull: true,
                unique: false,
            },
            verifyBin: {
                type: Sequelize.TEXT,
                allowNull: false,
            }
        },
        {
            freezeTableName: true,
            paranoid: false,
            indexes: [
            {
                unique: true,
                fields: ['phone']
            },
            {
                unique: true,
                fields: ['email']
            },
            {
                unique: true,
                fields: ['nickname']
            },
        ],
        }
    );

    let AdminUserGroups = require('./admin-usergroups')(sequelize);
    AdminUser.belongsTo(AdminUserGroups);
    // AdminUserGroups.hasMany(AdminUser);

    return AdminUser;
}
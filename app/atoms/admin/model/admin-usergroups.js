var Sequelize = require('sequelize');
var AdminUserGroups = null;
module.exports = sequelize => {
    if(AdminUserGroups) {
        return AdminUserGroups;
    }
    AdminUserGroups = sequelize.define(
        'admin_usergroups',
        {
            name: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            acceptedKeys: {
                type: Sequelize.TEXT,
            }
        },
        {
            freezeTableName: true,
            paranoid: false,
            indexes: [
            {
                unique: true,
                fields: ['name']
            }
        ],
        }
    );
    return AdminUserGroups;
}
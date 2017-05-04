let Sequelize = require('sequelize');
var UserBizInfo = null;
module.exports = sequelize => {
    if(UserBizInfo) {
        return UserBizInfo;
    }
    UserBizInfo = sequelize.define(
        'userBizInfo',
        {
            articlesNum: {
                type: Sequelize.INTEGER,
            },
        },
        {
            freezeTableName: true,
            paranoid: true,
        }
    );
    return UserBizInfo;
}
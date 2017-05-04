let Sequelize = require('sequelize');
var User = null;
module.exports = sequelize => {
    if(User) {
        return User;
    }
    User = sequelize.define(
        'user',
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
                allowNull: false,
                unique: false,
            },
            avatar: {
                type: Sequelize.STRING(64),
                allowNull: true
            },
            sex: {
                type: Sequelize.ENUM,
                values: ['male', 'female', 'unset'],
                defaultValue: 'unset',
            },
            freeze: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            birthday: {
                type: Sequelize.DATE,
                allowNull: true
            },
            latitude: {
                type: Sequelize.DOUBLE,
                allowNull: true,
                defaultValue: null,
                validate: { min: -90, max: 90 }
            },
            longitude: {
                type: Sequelize.DOUBLE,
                allowNull: true,
                defaultValue: null,
                validate: { min: -180, max: 180 }
            },
            verifyBin: {
                type: Sequelize.TEXT,
                allowNull: false,
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
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
                unique: false,
                fields: ['nickname']
            },
        ],
        }
    );

    var UserBizInfo = require('./userBizInfo')(sequelize);
    /* 
    * User的实例对象将拥有getAccount、setAccount、addAccount方法
    */
    User.hasOne(UserBizInfo);
    /*
    * UserBizInfo的实例对象将拥有getUser、setUser、addUser方法
    */
    UserBizInfo.belongsTo(User);

    var Issue = require('./issue')(sequelize);
    var Releationship_UserIssue = require('./releationship_user_issue')(sequelize);
    User.belongsToMany(Issue, {through: Releationship_UserIssue});
    Issue.belongsToMany(User, {through: Releationship_UserIssue});

    var Question = require('./question')(sequelize);
    var Releationship_UserQuestion = require('./releationship_user_question')(sequelize);
    User.belongsToMany(Question, {through: Releationship_UserQuestion});
    Issue.belongsToMany(User, {through: Releationship_UserQuestion});

    var Comment = require('./comment')(sequelize);
    User.hasMany(Comment);
    Comment.belongsTo(User);

    var LoginSession = require('./loginSession')(sequelize);
    User.hasMany(LoginSession);
    LoginSession.belongsTo(User);
    return User;
}
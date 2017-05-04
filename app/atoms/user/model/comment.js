let Sequelize = require('sequelize');
var Comment = null;
module.exports = sequelize => {
    if(Comment) {
        return Comment;
    }
    Comment = sequelize.define(
        'comment',
        {
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            targetType: {
                type: Sequelize.ENUM,
                values: ['issue', 'question'],
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
            paranoid: true,
        }
    );

    // var User = require('./user');
    // User.hasMany(Comment);
    // Comment.belongsTo(User);

    return Comment;
}
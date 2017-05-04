let Sequelize = require('sequelize');
var Question = null;
module.exports = sequelize => {
    if(Question) {
        return Question;
    }
    Question = sequelize.define(
        'question',
        {
            title: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
            paranoid: true,
        }
    );

    var Comment = require('./comment')(sequelize);
    Question.hasMany(Comment);
    Comment.belongsTo(Question);
    return Question;
}
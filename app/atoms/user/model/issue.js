let Sequelize = require('sequelize');
var Issue = null;
module.exports = sequelize => {
    if(Issue) {
        return Issue;
    }
    Issue = sequelize.define(
        'issue',
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
    Issue.hasMany(Comment);
    Comment.belongsTo(Issue);
    return Issue;
}
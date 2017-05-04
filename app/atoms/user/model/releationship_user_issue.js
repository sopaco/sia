let Sequelize = require('sequelize');
var Releationship_UserIssue = null;
module.exports = sequelize => {
    if(Releationship_UserIssue) {
        return Releationship_UserIssue;
    }
    Releationship_UserIssue = sequelize.define('releationship_user_issue',
        {
            type: {
                type: Sequelize.ENUM,
                values: ['owner', 'follow', 'commentOnly'],
                allowNull: false,
            },
            extra: {
                type: Sequelize.TEXT,
            }
        }
    );
    return Releationship_UserIssue;
}
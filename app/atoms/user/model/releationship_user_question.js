let Sequelize = require('sequelize');
var Releationship_UserQuestion = null;
module.exports = sequelize => {
    if(Releationship_UserQuestion) {
        return Releationship_UserQuestion;
    }
    Releationship_UserQuestion = sequelize.define('releationship_user_question',
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
    return Releationship_UserQuestion;
}
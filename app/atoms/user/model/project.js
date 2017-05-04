let Sequelize = require('sequelize');
var Project = null;
module.exports = sequelize => {
    if(Project) {
        return Project;
    }
    Project = sequelize.define(
        'project',
        {
            name: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            githubUrl: {
                type: Sequelize.TEXT,
                allowNull: false,
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
        }
    );

    /*
    * Project的实例对象将拥有getIssues、setIssues、addIssue、createIssue、removeIssue、hasIssue方法
    */
    var Issue = require('./issue')(sequelize);
    Project.hasMany(Issue);
    /*
    * Note的实例对象将拥有getProject、setProject、createProject方法
    */
    Issue.belongsTo(Project);
    return Project;
}
let Sequelize = require('sequelize');
var ScreenShot = null;
module.exports = sequelize => {
    if(ScreenShot) {
        return ScreenShot;
    }
    ScreenShot = sequelize.define(
        'app2micro_screenshot',
        {
            imageUrl: {
                type: Sequelize.STRING,
            }
        },
        {
            freezeTableName: true,
            paranoid: false
        }
    );
    return ScreenShot;
}
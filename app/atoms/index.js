var parallel = require('../../salibs/utils/parallel-toolkit')

async function setup(context, option) {
    let config = require('./setup-config');
    let {
        app,
        express 
    } = context.express;

    //setup database via sequelizeJS
    let database = require('./database');
    database.setup();
    let sequelize = database.getDatabase();
        
    let routerExtend = require('../../salibs/express/routerExtend');
    for(let module of config.modules) {
        let moduleIndex = require(`${module.module_path}`);

        //setup router
        if(module.route) {
            let router = express.Router();
            routerExtend.enhance(router);
            require(`${module.module_path}/route`)(router, context);
            app.use(`${module.route.routePrefix}`, router);
        }

        //setup model
        if(module.model) {
            for(let type of module.model.types) {
                let typeDefine = require(`${module.module_path}/model/${type}`)(sequelize);
                await typeDefine.sync(option.sequelize);
            }
        }

        //execute post install
        if(moduleIndex && moduleIndex.postInstall) {
            await moduleIndex.postInstall();
        }
    }
};

module.exports = setup;
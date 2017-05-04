module.exports = (router, context) => {
    let {
        app,
        express 
    } = context.express;

    let routeCreateAction = () => {
        let routerExtend = require('../../../../salibs/express/routerExtend');
        let router = express.Router();
        routerExtend.enhance(router);
        return router;
    }

    let adminAccountRouter = routeCreateAction();
    require('./admin-account')(adminAccountRouter);
    router.use(`/account`, adminAccountRouter);
    
    let adminDataTellerRouter = routeCreateAction();
    require('./admin-data-teller')(adminDataTellerRouter);
    router.use(`/data-teller`, adminDataTellerRouter);
    
    let adminUploadsRouter = routeCreateAction();
    require('./admin-uploads')(adminUploadsRouter);
    router.use(`/upload`, adminUploadsRouter);

    let adminUserGroupsRouter = routeCreateAction();
    require('./admin-usergroups')(adminUserGroupsRouter);
    router.use(`/admin-usergroups`, adminUserGroupsRouter);
}
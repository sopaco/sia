var envConf = require('../../../../config/env');

module.exports = (router, context) => {
    let {
        app,
        express
    } = context.express;
    //static public assets
    router.use('/public', express.static('public'));
    router.use('/ugc/images', express.static(envConf.uploads.paths.ugc_image));
}
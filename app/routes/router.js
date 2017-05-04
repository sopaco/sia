var express = require('express');
import {
  loginAuth,
  adminAuth
} from '../middlewares/authorization';

let atomModules = require('../atoms');

let apiResultWrapper = require('../../salibs/api/apiResultWrapper');
let apiWarrantGuard = require('../../salibs/api/apiWarrantGuard');
let apiBehaviorGuard = require('../../salibs/api/apiBehaviorGuard');
let apiErrorHandler = require('../../salibs/api/apiErrorHandler');
let easeToDebug = require('../../salibs/debug/easeToDebug');
let sessionContextMaker = require('../middlewares/sessionContextMaker');
let crossOrigin = require('../../salibs/security/crossOrigin');
let responseTime = require('response-time');

var session = require('express-session');
var FileStore = require('session-file-store')(session);

var apiPrefix = '/api';
var adminPrefix = '/api-admin';

var envConf = require('../../config/env');

exports.routesOn = app => {
    app.use(session({
        store: new FileStore({
            ttl: 7200,
            path: envConf.session.args.path,
        }),
        secret: 'sopaco-session-store-secret-L1UI-DHNF-1M3N-ZAP9'
    }));

    if(envConf.ext.enableEaseToDebug) {
        app.use('/', easeToDebug);   
    }
    app.use('/', responseTime());
    //apply middlewares before process atom modules
    apiWarrantGuard.applyOn((apiPath, rule) => {
        app.use(`${apiPrefix}${apiPath}`, rule);
    }, require('../../config/apiwarrant'));
    app.use(`${apiPrefix}`, crossOrigin);
    app.use(`${apiPrefix}`, apiBehaviorGuard);
    app.use(`${apiPrefix}`, sessionContextMaker);
    app.use(`${apiPrefix}`, apiResultWrapper);

    atomModules({
        express: {
            app,
            express
        }
    }, {
        sequelize: {
            force: false
        }
    });

    //route for admin
    app.use('/admin/uploads', adminAuth, express.static(envConf.uploads.paths.admin_image));//consider secure

    //apply middlewares after process atom modules
    app.use(`${adminPrefix}`, crossOrigin);
    app.use(`${adminPrefix}`, apiResultWrapper);

    //global error handler
    app.use(apiErrorHandler);
}
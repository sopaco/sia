async function startup() {
   try {
        var express = require('express');
        var http = require('http');
        var router = require('./routes/router');
        var app = express();
        var bodyParser = require('body-parser');
        var log4js = require('../salibs/log/log4js');
        var logger = log4js.getLogger('server');
        var compression = require('compression');
        var envConf = require('../config/env');
        log4js.use(app, logger);
        logger.info(`env config:${JSON.stringify(envConf)}`);

        //设置router基础设施
        app.disable('x-powered-by');
        app.use(compression());
        app.use(bodyParser.json()); // for parsing application/json
        app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
        //设置业务router
        router.routesOn(app);
        const ip = envConf.machine.ip;
        const port = envConf.machine.port;

        http.createServer(app).listen(port, ip, function () {
            logger.info(`Application worker pid=${process.pid} started...@${ip}:${port}`);
        });
   } catch(err) {
       console.log(err);
       logger.error(err);
   }
}

// 启动及端口
exports.start = startup;
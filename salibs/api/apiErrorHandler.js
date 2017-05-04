var log4js = require('../log/log4js');
var serverErrorLogger = log4js.getLogger('api_error_server');
var clientErrorLogger = log4js.getLogger('api_error_client');

module.exports = (error, req, resp, next) => {
    console.log('enter api error handler');
    let code = 500;
    let errorMsg = 'Oops! This is an unexpected error, we will fix it soon.';
    let errorStr = null;
    if(error instanceof Error) {
        errorStr = error.toString();
    } else if(error instanceof Object) {
        errorStr = JSON.stringify(error);
        if(error.code) {
            code = error.code;
            errorMsg = error.message;
        } 
    } else {
        errorStr = error;
    }
    try {
        resp.status(code).send({
            code,
            error: errorMsg,
            extra: errorStr,
        })
        if(code >= 500) {
            serverErrorLogger.error(error)
        } else {
            clientErrorLogger.error(error)
        }
    } catch(ex) {
        console.log('OMG!!!');
        console.log(ex);
    }
    // next();
}
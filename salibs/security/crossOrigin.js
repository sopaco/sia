/**
 * 允许跨域访问
 */
module.exports = (req, resp, next) => {
    resp.header('Access-Control-Allow-Origin', '*');
    // resp.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8000');
    resp.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
    resp.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
    resp.header('Access-Control-Allow-Credentials','true');
    next();
}
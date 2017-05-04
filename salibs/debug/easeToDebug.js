/**
 * 方便调试排查的middleware
 *  打印所有上下行数据
 */
module.exports = (req, resp, next) => {
    console.log(`easeToDebug:
    headers=${JSON.stringify(req.headers)},
    protocol=${req.protocol}, 
    url=${req.originalUrl}, 
    ip=${req.ip}, 
    query＝${JSON.stringify(req.query)}, 
    params=${JSON.stringify(req.params)}, 
    body=${JSON.stringify(req.body)}, 
    method=${req.method}`);
    next();
}
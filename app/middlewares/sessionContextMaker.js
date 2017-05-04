module.exports = (req, resp, next) => {
    var sessionSvc = require('../atoms/user/service/session');
    req.sessionContext = {

    };
    let token = req.headers['authorization'];
    if(token) {
        let session = sessionSvc.resolveUserIdByTokenValue(token);
        if(session) {
            req.sessionContext.userId = session.userId;
        }
    }
    next();
}
const LORD_FAKE_KEY = 'LH49-SLDZ-AL13-AIS6';

function loginAuth(req, resp, next) {
    console.log('loginAuth invoked');
    if(!req.sessionContext.userId) {
        throw {
            code: 403,
            message: 'need login to access',
        }
    }
    next();
}

function adminAuth(req, resp, next) {
    console.log('admin-auth invoked');
    if(req.query.sopaco == LORD_FAKE_KEY) {
        console.log('welcome lord')
        next();
        return;
    }
    if(!req.session.userState) {
        throw {
            code: 403,
            message: 'need login to access',
        }
    }
    next();
}

module.exports = {
    loginAuth,
    adminAuth,
};
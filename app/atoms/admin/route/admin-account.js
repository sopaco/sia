import {
  loginAuth,
  adminAuth
} from '../../../middlewares/authorization';

var crypto = require('crypto');
function createVerifyBinFromPwd(username, password) {
    return crypto.createHash('sha256').update(`${username}#!${password}`).digest('base64');
}

function AdminUser() {
    return require('../model/admin-user')();
}

module.exports = router => {
    router.postAsync('/login', async function(req, res) {
        let params = req.body;
        let {
            username,
            password
        } = params;
        let verifyBin = createVerifyBinFromPwd(username, password);
        let userProfile = await AdminUser().findOne({
            where: {
                phone: params.username,
                verifybin: verifyBin,
            }
        });
        if(!userProfile) {
            req.session.userState = null;
            res.toApiJson({
                hasError: true,
                errorCode: -1,
                errorMessage: '用户名或密码错误'
            });
        }
        req.session.userState = {
            id: userProfile.id
        };
        res.toApiJson({
            userProfile,
        });
    });

    router.post('/logout', function(req, res) {
        req.session.userState = null;
        res.toApiJson({});
    });

    router.post('/session-detect', adminAuth, (req, res) => {
        res.toApiJson({});
    });

    router.post('/selfInfo', adminAuth, async (req, res) => {
        let userId = req.session.userState.id;
        let user = await AdminUser().findOne({
            where: {
                id: userId
            }
        })
        res.toApiJson(user);
    });   
}
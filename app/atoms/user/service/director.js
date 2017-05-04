/**
 * operations for self only
 */

var crypto = require('crypto');
var sessionStore = require('../service/session');
var verify_sms = require('../service/verify_sms');

function createVerifyBinFromPwd(phone, password) {
    return crypto.createHash('sha256').update(`${phone}#!${password}`).digest('base64');
}

function Session() {
    return require('../model/loginSession')();
}

function User() {
    return require('../model/user')();
}

export async function doLogin(params) {
    let originalPassword = params.password;
    let verifyBin = createVerifyBinFromPwd(params.phone, params.password);
    let userProfile = await User().findOne({
        paranoid: true,
        where: {
            phone: params.phone,
            verifybin: verifyBin,
        }
    });
    if(!userProfile) {
        return {
            hasError: true,
            errorCode: -1,
            errorMessage: '用户名或密码错误',
        }
    }
    if(userProfile.freeze == true) {
        return {
            hasError: true,
            errorCode: -1,
            errorMessage: '该账户已被冻结，请与管理员联系',
        }
    }
    let loginSession = sessionStore.generateTokenBySelfLogin(userProfile, params.Terminal);
    await sessionStore.resetToken({
        userProfile, 
        loginSession,
    });
    return {
        userProfile,
        token: loginSession.value
    };
}

export async function doRegister(params) {
    let verifyResult = verify_sms.verifySms({
        mobile: params.phone,
        useage: 'register',
        verifyCode: params.verifyCode,        
    });
    if(!verifyResult.result) {
        if(verifyResult.verifyReason == verify_sms.VERIFY_REASON_SMS_NOT_MATCH) {
            return {
                hasError: true,
                errorCode: -1,
                errorMessage: '验证码不匹配',
            };
        }
        return {
            hasError: true,
            errorCode: -1,
            errorMessage: '您尚未接受到验证码',
        };
    }
    let tryFindUser = await User().findOne({
        where: {
            phone: params.phone,
        }
    });
    if(tryFindUser) {
        return {
            hasError: true,
            errorCode: -1,
            errorMessage: '该账号已经注册过，请直接登陆',
        };
    }
    
    let originalPassword = params.password;
    let verifyBin = createVerifyBinFromPwd(params.phone, params.password);
    let userProfile = await User().create({
        phone: params.phone,
        nickname: params.phone,
        verifyBin: verifyBin,
    });
    let loginSession = sessionStore.generateTokenBySelfLogin(userProfile, params.Terminal);
    await sessionStore.resetToken({
        userProfile, 
        loginSession,
    });
    return {
        userProfile,
        token: loginSession.value
    }
}

export async function doSendSmsRegister(params) {
    return await internalSendSmsForPurpose(params, 'register');
}

export async function doSendSmsForget(params) {
    return await internalSendSmsForPurpose(params, 'forget');
}

async function internalSendSmsForPurpose(params, purpose) {
    let sentResult = await verify_sms.sendSms({
        mobile: params.phone,
        useage: purpose,
    });
    if(sentResult.sent) {
        return '发送成功';
    }
    if(sentResult.reasonCode == verify_sms.SEND_REASON_SMS_AREADY_SENT) {
        return '短信刚刚已经发送了哦';
    }
    return {
        hasError: true,
        errorCode: -1,
        errorMessage: '无法发送短信，请稍后再试',
        errorExtra: sentResult,
    };
}

export async function doResetPassword(params) {
    let verifyResult = verify_sms.verifySms({
        mobile: params.phone,
        useage: 'forget',
        verifyCode: params.verifyCode,        
    });
    if(!verifyResult.result) {
        if(verifyResult.verifyReason == verify_sms.VERIFY_REASON_SMS_NOT_MATCH) {
            return {
                hasError: true,
                errorCode: -1,
                errorMessage: '验证码不匹配',
            };
        }
        return {
            hasError: true,
            errorCode: -1,
            errorMessage: '您尚未接受到验证码',
        };
    }
    let originalPassword = params.password;
    let verifyBin = createVerifyBinFromPwd(params.phone, params.password);
    await User().update({
        verifyBin: verifyBin,
    }, {
        where: {
            phone: params.phone,
        }
    });
    let userProfile = await User().findOne({
        where: {
            phone: params.phone,
        }
    });
    let loginSession = sessionStore.generateTokenBySelfLogin(userProfile, params.Terminal);
    await sessionStore.resetToken({
        userProfile, 
        loginSession,
    });
    return {
        userProfile,
        token: loginSession.value
    }
}

export async function doGetProfile(params) {
    let sessionContext = params.sessionContext;
    return await User().findOne({
        paranoid: true,
        where: {
            id: sessionContext.userId,
        }
    });
}

export async function doUpdateProfile(params) {
    let sessionContext = params.sessionContext;
    return await User().update({
        nickname: params.nickname,
        avatar: params.avatar,
        sex: params.sex,
        birthday: params.birthday,
    }, {
        where: {
            id: sessionContext.userId,
        }
    });
}

export async function doLogout(params) {
    
}

export async function doGetAppConfig(params) {
    
}

export async function doUpdateAppConfig(params) {
    
}
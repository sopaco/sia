var memTokensMap = {};
var lastSyncTime = 0;

function Session() {
    return require('../model/loginSession')();
}

export function generateTokenBySelfLogin(userInfo, terminal) {
    var crypto = require('crypto');
    let tokenSource = `${userInfo.id}-${Date()}-${terminal.platform}-${terminal.udid}`;
    let tokenValue = crypto.createHash('sha256').update(tokenSource).digest('base64');
    return {
        value: tokenValue,
        type: 'self',
        platform: terminal.platform,
        deviceId: terminal.udid, 
    };
}

export function resolveUserIdByTokenValue(tokenValue) {
    syncFromPersist(false);
    console.log(JSON.stringify(memTokensMap))
    return memTokensMap[tokenValue];
}

export async function resetToken(params) {
    var {
        userProfile, loginSession
    } = params;
    let previousTokens = await Session().findAll({
        attributes: ['value'],
        where: {
            userId: userProfile.id,
        }
    })
    previousTokens.forEach(pt => {
        delete memTokensMap[pt.value]; 
    });
    await Session().destroy({
        where: {
            userId: userProfile.id,
        }
    });
    attachToken(params);
}

export async function attachToken(params) {
    var {
        userProfile, loginSession
    } = params;
    let loginSessionInDb = await Session().create(loginSession);
    userProfile.addLoginSession(loginSessionInDb);
    memTokensMap[loginSessionInDb.value] = loginSessionInDb;
}

export function syncToPersist() {

}

export async function syncFromPersist(immediately) {
    let timestamp = new Date().valueOf();
    if(!immediately) {
        if(timestamp - lastSyncTime < 10 * 60 * 1000) {
            return;
        }
    }
    let existedSessions = await Session().findAll();
    lastSyncTime = timestamp;
    existedSessions.forEach(es => {
        memTokensMap[es.value] = es;
    });
}
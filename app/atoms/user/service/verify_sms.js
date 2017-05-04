var smsState = {};

export const SEND_REASON_SMS_AREADY_SENT = -1;

export const VERIFY_REASON_SMS_NOT_EXISTED = 20;
export const VERIFY_REASON_SMS_NOT_MATCH = 21;

export const STATE_WAITING = 50;
export const STATE_ARRIVED = 51;
export const STATE_CANCELED = 52;

const MAX_LIMITED_IN_STATE = 2000;
const EXPIRED_TIME_PHONESTATE = 5 * 60 * 1000;

/**
 * params= {
 *  mobile,useage,verifyCode,
 * }
 */
export async function sendSms(params) {
    purgeToClear();
    let useagePhonesMap = smsState[params.useage];
    if(!useagePhonesMap) {
        return internalSendSms(params);
    }
    let existedState = useagePhonesMap[params.mobile];
    if(!existedState) {
        return internalSendSms(params);
    }
    if(new Date().getTime() - existedState.createAt > 60 * 1000) {
        delete useagePhonesMap[params.mobile];
        return internalSendSms(params);
    }
    return {
        sent: false,
        reasonCode: SEND_REASON_SMS_AREADY_SENT,
        state: existedState,
        reason: '已发送过验证码',
    }
}

export function verifySms(params) {
    let useagePhonesMap = smsState[params.useage];
    if(!useagePhonesMap || !useagePhonesMap[params.mobile]) {
        return {
            result: false,
            verifyReason: VERIFY_REASON_SMS_NOT_EXISTED,
        }
    }
    if(useagePhonesMap[params.mobile].verifyCode == params.verifyCode) {
        delete useagePhonesMap[params.mobile];
        return {
            result: true,
        }
    }
    return {
        result: false,
        verifyReason: VERIFY_REASON_SMS_NOT_MATCH,
    }
}

export function purgeToClear() {
    let purposeKeys = Object.keys(smsState);
    purposeKeys.forEach(purposeKey => {
        let useagePhonesMap = smsState[purposeKey];
        if(useagePhonesMap == null) {
            return;
        }
        let stateKeys = Object.keys(useagePhonesMap);
        if(stateKeys.length < MAX_LIMITED_IN_STATE) {
            return;
        }
        console.debug(`the number of state for verify-sms-useage_${purposeKey} is ${stateKeys.length}, more than ${MAX_LIMITED_IN_STATE}, I would purge them to reduce`)
        let pendingToReducedNum = stateKeys.length - MAX_LIMITED_IN_STATE * 2 / 3;
        for(let phoneStateKey of stateKeys) {
            if(pendingToReducedNum <= 0) {
                return;
            }
            if(new Date().getTime() - useagePhonesMap[phoneStateKey].createAt > 5 * 60 * 1000) {
                console.debug(`the item would be purged...${JSON.stringify(useagePhonesMap[phoneStateKey])}`);
                delete useagePhonesMap[phoneStateKey];
                pendingToReducedNum -= 1;
            }
        }
        console.debug(`the state for verify-sms-useage_${purposeKey} has been reduced, now the capacity is ${Object.keys(useagePhonesMap)}`)
    });
}

export function clearAllState() {
    
}

function internalSendSms(params) {
    let useagePhonesMap = smsState[params.useage];
    if(!useagePhonesMap) {
        useagePhonesMap = {};
        smsState[params.useage] = useagePhonesMap;
    }
    useagePhonesMap[params.mobile] = {
        createAt: new Date().getTime(),
        useage: params.useage,
        mobile: params.mobile,
        status: STATE_WAITING,
        verifyCode: '1949'
    }
    //TODO:send verify code via sms
    return {
        sent: true,
        state: useagePhonesMap[params.mobile],
    }
}
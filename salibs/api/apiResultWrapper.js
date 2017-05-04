/**
 * 
 * 正常结果范式
 * {
 *  code: '正确状态码',
 *  data: '业务数据',
 * }
 * 错误结果范式
 * {
 *  code: '错误码'',
 *  error: 'human readable错误信息',
 *  extra: '附加信息',
 * }
 */
function wrapResult(result) {
    if(result.hasError) {
        return {
            code: result.errorCode,
            error: result.errorMessage,
            extra: result.errorExtra,
        };
    }
    return {
        code: 200,
        data: result,
    };
}

module.exports = (req, resp, next) => {
        resp.toApiJson = resp.toApiText = (message) => {
            let respResult = wrapResult(message);
            resp.json(respResult);
        };
        next();
    }
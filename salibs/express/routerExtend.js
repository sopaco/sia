let apiErrorHandler = require('../../salibs/api/apiErrorHandler');

export function enhance(router) {
    router.getAsync = (path, ...fn) => {
        router.get(path, async (req, resp, next) => {
            try {
                for(let subFn of fn) {
                    await subFn(req, resp, () => {});
                }
            } catch(err) {
                console.log('error error error!!!!')
                apiErrorHandler(err, req, resp, () => {});
            }
        })  
    };
    router.postAsync = (path, ...fn) => {
        router.post(path, async (req, resp, next) => {
            try {
                for(let subFn of fn) {
                    await subFn(req, resp, () => {});
                }
            } catch(err) {
                console.log('error error error!!!!')
                apiErrorHandler(err, req, resp, () => {});
            }
        })  
    };
}
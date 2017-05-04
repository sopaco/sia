/**
 * 
 * api授权访问控制
 */
export function applyOn(applyAction, config) {
    let avaliableKeys = config.keys;
    avaliableKeys.map(area => {
        applyAction(area.applyOnRoute, (req, resp, next) => {
            if(req.method == 'OPTIONS') {
                console.log(`pass the options request for ${req.url}`);
                next();
                return;
            }
            let apiKey = req.headers['warrantwho'] || req.headers['WarrantWho'];
            if(!apiKey) {
                throw {
                    code: 403,
                    message: 'do you know who is Warrant?',
                }
            }
            let targetItem = area.who.find(item => item.api_key == apiKey)
            if(!targetItem) {
                throw {
                    code: 403,
                    message: 'your Warrant is invalid?',
                }
            }
            next();
        });
    });
    //req.headers['Authorization']
}
export async function runAsync(actions) {
    let asyncTaskResults = [];
    for(let action of actions) {
        asyncTaskResults.push(action());
    }
    return new Promise(async (resolve, reject) => {
        try {
            let result = [];
            for(let asyncTaskResult of asyncTaskResults) {
                result.push(await asyncTaskResult);
            }
            resolve(result);
        } catch(ex) {
            reject();
        }
    });
}
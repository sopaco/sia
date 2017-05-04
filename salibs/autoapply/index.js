export function select(args) {
    var {
        envName,
        confFilesDir
    } = args;
    let baseConfig = require(`${confFilesDir}/base`);
    let modifyConfig = require(`${confFilesDir}/${envName}`);
    let combinedConfig = Object.assign(baseConfig, modifyConfig);
    return combinedConfig;
}
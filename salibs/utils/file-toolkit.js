var fs = require("fs");
var path = require("path");

export function mkdirsSync(dirpath, mode) {
    let exists = fs.existsSync(dirpath);
    if(exists) {
        return true;
    }
    if(!mkdirsSync(path.dirname(dirpath), mode)) {
        return false;
    }
    fs.mkdirSync(dirpath, mode);
    return fs.existsSync(dirpath);
};
var crypto = require('crypto');
var arguments = process.argv.splice(2);
var username = arguments[0];
var password = arguments[1];
var verifyBin = crypto.createHash('sha256').update(`${username}#!${password}`).digest('base64');
console.log(verifyBin);
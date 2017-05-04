require("babel-core/register");
require('babel-polyfill');
// require('oneapm');
// require('tingyun');

var server = require('./app/server');
var moment = require('moment')

console.log('service is starting')
server.start();
console.log('service startup at: ' + moment().format())
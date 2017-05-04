function Rad(d) {
    return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
}
//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function getDistance(lat1, lng1, lat2, lng2) {

    var radLat1 = Rad(lat1);
    var radLat2 = Rad(lat2);
    var a = radLat1 - radLat2;
    var b = Rad(lng1) - Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000; //输出为公里
    //s=s.toFixed(4);
    return s;
}

function test(args) {
    console.log('test invoked');
}

let testInst = new test();
test.prototype.extProperty = '111';
test.prototype.extFunction = function() {
    console.log('ext function invoked');
    for(var prop in this) {
        console.log(prop);
    }
    var i = 0;
    for (var prop in this) { i++; }
    return i;
};

testInst.a = 1;
console.log(testInst.extFunction());
console.log(getDistance(1, 1, 1.1111, 1.1111))

console.log(Object.assign(
    {a: {a: 1}}, 
    {a: 2}
));
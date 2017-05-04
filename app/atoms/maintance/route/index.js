module.exports = router => {
    const sysInfo = require('../service/sys-info');

    router.get('/sysinfo/gen', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache, no-store');
        res.end(JSON.stringify(sysInfo['gen']()));
    });

    router.get('/sysinfo/poll', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache, no-store');
        res.end(JSON.stringify(sysInfo['poll']()));
    });   
}
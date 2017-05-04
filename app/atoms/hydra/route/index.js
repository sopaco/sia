const exec = require('child_process').exec; 
const url = require('url');

const envConf = require('../../../../config/env');
const downloadPath = envConf.uploads.paths.open_api_download;

if(!require('../../../../salibs/utils/file-toolkit').mkdirsSync(downloadPath)) {
  console.error(`create download directory for open-api failure...${downloadPath}`);
}

module.exports = (router, context) => {
    let {
        app,
        express
    } = context.express;
    router.use('/history', express.static(envConf.uploads.paths.open_api_download));
    
    router.get('/download', function (req, res) {
        let file_url = req.query.target;
        if(!file_url) {
            res.json({message: 'target is empty'});
            return;
        }
        return new Promise((resolve, reject) => {
            let file_name = `${new Date().getTime()}_${url.parse(file_url).pathname.split('/').pop()}`;
            let wget = `wget -O ${downloadPath}/${file_name} ${file_url}`;
            // let wget = 'wget -P ' + downloadPath + ' ' + file_url;
            let child = exec(wget, function (err, stdout, stderr) {
                if (err) {
                    reject(err);
                    return;
                }
                console.log(`download to...${downloadPath}/${file_name}`);
                res.download(`${downloadPath}/${file_name}`, file_name);
                resolve();
            });
        });
    });
}
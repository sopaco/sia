import {
  loginAuth,
  adminAuth
} from '../../../middlewares/authorization';

var imageMulter = require('multer');
var envConf = require('../../../../config/env');
var uploadPath = envConf.uploads.paths.admin_image;
if(!require('../../../../salibs/utils/file-toolkit').mkdirsSync(uploadPath)) {
  console.error(`create upload path for ugc failure...${uploadPath}`);
}
var storage = imageMulter.diskStorage({
destination: function (req, file, cb) {
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + '_' + (Math.random() * 10000).toFixed(0) + '.png')
    }
})
var imageUpload = imageMulter({storage}); // for parsing multipart/form-data

module.exports = router => {
    router.post('/image', adminAuth, imageUpload.any(), (req, res) => {
        console.log('>>:keys of array=' + JSON.stringify(req.body));
        console.log('>>keys of files=' + JSON.stringify(req.files));
        res.json(req.files);
    });
}
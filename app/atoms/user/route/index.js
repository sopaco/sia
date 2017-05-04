import {
    loginAuth,
} from '../../../middlewares/authorization';

module.exports = router => {
  var multer = require('multer');
  var envConf = require('../../../../config/env');
  var uploadPath = envConf.uploads.paths.ugc_image;
  if(!require('../../../../salibs/utils/file-toolkit').mkdirsSync(uploadPath)) {
    console.error(`create upload path for ugc failure...${uploadPath}`);
  }
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '_' + Date.now() + '_' + (Math.random() * 10000).toFixed(0) + '.jpg')
    }
  })
  let upload = multer({storage}); // for parsing multipart/form-data
  var accountDirector = require('../service/director')

  router.postAsync('/login', async (req, res) => {
    let params = req.body;
    let result = await accountDirector.doLogin({
      phone: params.phone,
      password: params.password,
      Terminal: params.Terminal,
    });
    res.toApiJson(result);
  });

  router.postAsync('/register', async (req, res) => {
    let params = req.body;
    let result = await accountDirector.doRegister({
      phone: params.phone,
      password: params.password,
      verifyCode: params.verifyCode,
      Terminal: params.Terminal,
    });
    res.toApiJson(result);
  });

  router.postAsync('/send_sms_register', async (req, res) => {
    let params = req.body;
    let result = await accountDirector.doSendSmsRegister({
      phone: params.phone,
      Terminal: params.Terminal,
    });
    res.toApiJson(result);
  });

  router.postAsync('/send_sms_forget', async (req, res) => {
    let params = req.body;
    let result = await accountDirector.doSendSmsForget({
      phone: params.phone,
      Terminal: params.Terminal,
    });
    res.toApiJson(result);
  });

  router.postAsync('/reset_password', async (req, res) => {
    let params = req.body;
    let result = await accountDirector.doResetPassword({
      phone: params.phone,
      password: params.password,
      verifyCode: params.verifyCode,
      Terminal: params.Terminal,
    });
    res.toApiJson(result);
  });

  router.postAsync('/logout', async (req, res) => {
    let params = req.body;
    let result = await accountDirector.doLogout({
      Terminal: params.Terminal,
    });
    res.toApiJson(result);
  });

  router.postAsync('/profile', loginAuth, async (req, res) => {
    let params = req.body;
    let result = await accountDirector.doGetProfile({
      sessionContext: req.sessionContext,
    });
    res.toApiJson(result);
  });

  router.postAsync('/updateProfile', loginAuth, async (req, res) => {
    let params = req.body;
    let result = await accountDirector.doUpdateProfile({
      sessionContext: req.sessionContext,
      userInfo: params.userInfo,
      Terminal: params.Terminal,
    });
    res.toApiJson(result);
  });

  router.post('/uploadAvatar', loginAuth, upload.any(), (req, res) => {
    console.log('>>body=' + JSON.stringify(req.body));
    console.log('>>keys of files=' + JSON.stringify(req.files));
    res.toApiJson({files: req.files});
  });

  router.postAsync('/appConfig', loginAuth, async (req, res) => {
    let params = req.body;
    let result = await accountDirector.doGetAppConfig({
      sessionContext: req.sessionContext,
    });
    res.toApiJson(result);
  });

  router.postAsync('/updateAppConfig', loginAuth, async (req, res) => {  
    let params = req.body;
    let result = await accountDirector.doUpdateAppConfig({
      appConfig: params.appConfig,
      sessionContext: req.sessionContext,
    });
    res.toApiJson(result);
  });
};
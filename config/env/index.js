var autoApply = require('../../salibs/autoapply');
module.exports = autoApply.select({
    envName: process.env.NODE_ENV || 'develop',
    confFilesDir: '../../config/env'
});
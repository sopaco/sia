const env = process.env;
module.exports = {
    name: 'production',
    mysql: {
        host: env.OPENSHIFT_MYSQL_DB_HOST,
        schema: 'tentacle',
        username: env.OPENSHIFT_MYSQL_DB_USERNAME,
        password: env.OPENSHIFT_MYSQL_DB_PASSWORD,
        pool: {
            max: 50,
            min: 5,
            idle: 50,
        }
    },
    uploads: {
        paths: {
            ugc_image: `${process.env.DATA_DIR}/uploads/ugc/images`,
            admin_image: `${process.env.DATA_DIR}/uploads/admin/images`,
            open_api_download: `${process.env.DATA_DIR}/open_api/download`,
        }
    },
    session: {
        provider: 'session-file-store',
        args: {
            path: './.tmp/session',
        }
    }
};
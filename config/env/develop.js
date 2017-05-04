module.exports = {
    name: 'develop',
    machine: {
        ip: '127.0.0.1',
        // ip: '192.168.0.9',
        port: 8086
    },
    dataDir: './.tmp/',
    uploads: {
        paths: {
            ugc_image: './.tmp/uploads/ugc/images',
            admin_image: './.tmp/uploads/admin/images',
            open_api_download: './.tmp/open_api/download',
        }
    },
    mysql: {
        host: 'localhost',
        schema: 'db_nodesvc',
        username: 'root',
        password: 'unikey',
        pool: {
            max: 10,
            min: 1,
            idle: 10,
        }
    },
    session: {
        provider: 'session-file-store',
        args: {
            path: './.tmp/session',
        }
    },
    ext: {
        enableEaseToDebug: true   
    }
};
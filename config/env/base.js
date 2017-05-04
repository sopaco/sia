const env = process.env;

module.exports = {
    name: env.NODE_ENV,
    machine: {
        ip: env.NODE_IP,
        port: env.NODE_PORT,
    },
    dataDir: env.DATA_DIR,
    uploads: {
        paths: {
            ugc: '',
            admin: '',
        }
    },
    mysql: {
        host: env.MYSQL_DB_HOST,
        schema: env.MYSQL_DB_SCHEMA,
        username: env.MYSQL_DB_USERNAME,
        password: env.MYSQL_DB_PASSWORD,
        pool: {
            max: 50,
            min: 5,
            idle: 50,
        }
    },
    session: {
        provider: '',
        args: {
            path: '',
        }
    },
    ext: {
        
    }
}
var Sequelize = require('sequelize');

var sequelize = new Sequelize('db_nodesvc', 'root', 'unikey', {
	host: 'localhost',
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		idle: 10000,
	},
});

var User = sequelize.define('user_test', {
	firstName: {
		type: Sequelize.STRING,
		field: 'first_name',
	},
	lastName: {
		type: Sequelize.STRING,
	},
    description: {
        type: Sequelize.TEXT,
    },
    birthday: {
        type: Sequelize.DATE,
    },
    status: {
        type: Sequelize.ENUM,
        values: ['deactived', 'actived', 'freeze']
    },
    latitude: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: { min: -90, max: 90 }
    },
    longitude: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: { min: -180, max: 180 }
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            is: ["^[a-z]+$",'i'],
            not: ["[a-z]",'i'],
            isEmail: true,            // checks for email format (foo@bar.com)
            isUrl: true,              // checks for url format (http://foo.com)
            isIP: true,               // checks for IPv4 (129.89.23.1) or IPv6 format
            isIPv4: true,             // checks for IPv4 (129.89.23.1)
            isIPv6: true,             // checks for IPv6 format
            isAlpha: true,            // will only allow letters
            isAlphanumeric: true,     // will only allow alphanumeric characters, so "_abc" will fail
            isNumeric: true,          // will only allow numbers
            isInt: true,              // checks for valid integers
            isFloat: true,            // checks for valid floating point numbers
            isDecimal: true,          // checks for any numbers
            isLowercase: true,        // checks for lowercase
            isUppercase: true,        // checks for uppercase
            notNull: true,            // won't allow null
            isNull: true,    
            notEmpty: true,
            len: [2,10], 
            max: 23, 
            min: 23, 
            isEven: function(value) {
                if(parseInt(value) % 2 != 0) {
                    throw new Error('Only even values are allowed!')
                    // we also are in the model's context here, so this.otherField
                    // would get the value of otherField if it existed
                }
            }    
        },
    },
}, {
    paranoid: true,//偏执模式，不会物理删除而是delete_At
    indexes: [
        // Create a unique index on email
        {
            unique: true,
            fields: ['email']
        },
        // By default index name will be [table]_[fields]
        // Creates a multi column partial index
        {
            name: 'actived_user',
            fields: ['email', 'status'],
            where: {
                status: 'actived'
            }
        },
    ],
	freezeTableName: true,
    // getterMethods: {
    //     fullName: () => {
    //         return `${this.firstName} ${this.lastName}`;
    //     },
    // },
    // setterMethods: {
    //     fullName: (value) => {
    //         this.setDataValue('firstName', value.split(' ')[0]);
    //         this.setDataValue('lastName', value.split(' ')[0]);
    //     },
    // }
});

async function initialize() {
    //http://docs.sequelizejs.com/en/v3/docs/schema/    
    try {
        await User.sync({force: true});
        await User.create({
            firstName: 'John',
            lastName: 'Hancock',
            status: 'freeze',
        });
        await echo();
    } catch(err) {
        console.log(err)
    }
}

async function echo() {
        let user = await User.findOne();
        console.log(`a user found...${JSON.stringify(user)}`);
        let multiQueryResult = await User.findAndCountAll({
            where: {
                firstName: {
                    $like: '%J%'
                },
                status: 'freeze',
                $or: [
                    { id: [1,2,3] },
                    { id: { $gt: 10 } }
                ]
            },
            offset: 20,
            limit: 10,
        });
        console.log(`${multiQueryResult.count} - ${multiQueryResult.rows}`);
}

initialize();


//http://www.phperz.com/article/15/1113/169037.html

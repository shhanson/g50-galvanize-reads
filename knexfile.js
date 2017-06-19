module.exports ={
    development: {
        client: 'pg',
        connection: process.env.DATABASE_URL || 'postgres://localhost/greads_dev'
    },

    test: {

    },

    production: {

    }

};

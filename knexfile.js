module.exports ={
    development: {
        client: 'pg',
        connection: 'postgres://localhost/greads_dev'
    },

    test: {

    },

    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL || 'postgres://localhost/greads_prod'

    }

};

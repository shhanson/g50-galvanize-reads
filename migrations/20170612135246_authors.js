'use strict';

//Create the 'authors' table in the database
exports.up = knex =>
    knex.schema.createTable('authors', (table) => {
        table.increments('id');
        table.string('first_name').notNullable().defaultTo('');
        table.string('last_name').notNullable().defaultTo('');
        table.text('bio').notNullable().defaultTo('');
        table.text('portrait_url').notNullable().defaultTo('');
        table.timestamps(true, true);
    });

//Drop the 'authors' table from the database
exports.down = knex => knex.schema.dropTable('authors');

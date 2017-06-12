'use strict';

//Create the 'books' table in the database
exports.up = knex =>
    knex.schema.createTable('books', (table) => {
        table.increments('id');
        table.string('title').notNullable().defaultTo('');
        table.string('genre').notNullable().defaultTo('');
        table.text('description').notNullable().defaultTo('');
        table.text('cover_url').notNullable().defaultTo('');
        table.timestamps(true, true);
    });

//Drop the 'books' table from the database
exports.down = knex => knex.schema.dropTable('books');

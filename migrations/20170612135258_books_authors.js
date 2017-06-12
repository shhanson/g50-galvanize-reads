'use strict';

//Create the 'books_authors' table in the database
exports.up = knex =>
    knex.schema.createTable('books_authors', (table) => {
        table.integer('book_id');
        table.integer('author_id');
    });


//Drop the 'books_authors' table from the database
exports.down = knex => knex.schema.dropTable('books_authors');

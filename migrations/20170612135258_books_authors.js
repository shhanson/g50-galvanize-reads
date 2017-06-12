'use strict';

//Create the 'books_authors' table in the database
exports.up = knex =>
    knex.schema.createTable('books_authors', (table) => {
        table.integer('book_id').references('id').inTable('books');
        table.integer('author_id').references('id').inTable('authors');
        table.timestamps(true, true);
    });


//Drop the 'books_authors' table from the database
exports.down = knex => knex.schema.dropTable('books_authors');

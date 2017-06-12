'use strict';

//Import books_authorsSeedData and store in booksAuthorsArray
const booksAuthorsArray = require('../books_authorsSeedData');

//Delete any rows in 'authors' and insert authorsArray data
exports.seed = knex => knex('books_authors').del()
    .then(() => knex('books_authors').insert(booksAuthorsArray));

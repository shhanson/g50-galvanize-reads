'use strict';

//Import booksSeedData and store in booksArray
const booksArray = require('../booksSeedData');

//Delete any rows in 'books' and insert booksArray data
exports.seed = knex => knex('books').del()
    .then(() => knex('books').insert(booksArray))
    .then(() => knex.raw("SELECT setval('books_id_seq', (SELECT MAX(id) FROM books))"));

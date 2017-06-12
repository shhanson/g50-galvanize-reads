'use strict';

//Import authorsSeedData and store in authorsArray
const authorsArray = require('../authorsSeedData');

//Delete any rows in 'authors' and insert authorsArray data
exports.seed = knex => knex('authors').del()
    .then(() => knex('authors').insert(authorsArray))
    .then(() => knex.raw("SELECT setval('authors_id_seq', (SELECT MAX(id) FROM authors))"));

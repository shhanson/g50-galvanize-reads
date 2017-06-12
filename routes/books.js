'use strict';

//Setup for knex stuff
const env = 'development';
const config = require('../knexfile')[env];
const knex = require('knex')(config);

//Setup for express server and router
const express = require('express');
const router = express.Router();

//GET all books
router.get('/books', (req, res) => {

});


//GET a book with the specified id
router.get('/books/:id', (req, res) => {

});

//POST (add) a new book
router.post('/books', (req, res) =>{

});

//PATCH (edit) a book with the specified id
router.patch('/books/:id', (req, res) => {

});

//DELETE a book with the specified id
router.delete('/books/:id', (req, res) =>{

});

module.exports = router;

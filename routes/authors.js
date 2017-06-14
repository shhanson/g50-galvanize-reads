'use strict';

//Setup for knex stuff
const env = 'development';
const config = require('../knexfile')[env];
const knex = require('knex')(config);

//Setup for express server and router
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

function isValidID(id) {
    return (id >= 1 && !Number.isNaN(id));
}

function getAuthor(id){
    return knex('authors').where('authors.id', id);
}

function getBooksForAuthors(authorID){

}


router.get('/authors', (req, res, next) => {


});

router.get('/authors/:id', (req, res, next) => {

});

router.post('/authors', (req, res, next) => {

});

router.put('/authors/:id', (req, res, next) => {

});

router.delete('/authors/:id', (req, res, next) => {

});

module.exports = router;

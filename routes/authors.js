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

function getAuthor(id) {
    return knex('authors').where('authors.id', id);
}

function getBooksForAuthor(authorID) {
    return knex('books').join('books_authors', 'books.id', 'books_authors.book_id').where('books_authors.author_id', authorID);
}

function getAuthorWithBooks(authorID){
    return Promise.all([
        getAuthor(authorID),
        getBooksForAuthor(authorID)
    ]).then((result) => {
        let [author, books] = result;
        return [author, books];
    });
}

function knexError(err) {
    console.error(err);
    err.status = 500;
    knex.destroy();
    return err;
}


router.get('/authors', (req, res, next) => {
    knex('authors').then((result) => {
        res.render('pages/authors', {
            data: result
        });
    }).catch((err) => {
        next(knexError(err));
    });

});

router.get('/authors/:id', (req, res, next) => {
    let authorID = Number.parseInt(req.params.id);
    if(!isValidID(authorID)){
        next();
    } else {
        getAuthorWithBooks(authorID).then((result) => {
            if(result[0][0] === undefined){
                next();
            } else {
                res.render('pages/author', {
                    author: result[0][0],
                    books: result[1]
                });
            }
        }).catch((err) => {
            next(knexError(err));
        });
    }

});

router.post('/authors', (req, res, next) => {
    

});

router.put('/authors/:id', (req, res, next) => {

});

router.delete('/authors/:id', (req, res, next) => {

});

module.exports = router;

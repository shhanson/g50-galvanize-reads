'use strict';

//Setup for knex stuff
const env = 'development';
const config = require('../knexfile')[env];
const knex = require('knex')(config);

//Setup for express server and router
const express = require('express');
const router = express.Router();

function getBook(id) {
    //Query to fetch a book from "books" with the given id
    return knex('books')
        .where('books.id', id);
}

function getAuthorsForBook(bookID) {
    //Query that joins the 'authors' table with 'books_authors' and returns entries with book_id equal to the bookID provided
    return knex('authors')
        .join('books_authors', 'authors.id', 'books_authors.author_id')
        .where('books_authors.book_id', bookID);
}

function getBookWithAuthors(bookID) {
    //Calls getBook and getAuthorsForBook functions,
    //'result' is an array with the following format:
    // [ [array containing the requested book (length=1)] , [array of authors]]
    return Promise.all([
            getBook(bookID),
            getAuthorsForBook(bookID)
        ])
        .then((result) => {
            let [book, authors] = result;
            return [book, authors];
        });
    //Do I need a catch here? or will it be handled below?
}

//GET all books
router.get('/books', (req, res, next) => {
    knex('books')
        .then((result) => {
            res.render('pages/books', {
                data: result
            });
        }) //END THEN
        .catch((err) => {
            console.error(err);
            err.status = 500;
            next(err);
            knex.destroy();
        }) //END CATCH
}); //END GET


//GET a book with the specified id
router.get('/books/:id', (req, res, next) => {
    //Grab id from URL and check if it's valid
    const bookID = Number.parseInt(req.params.id);
    if (bookID < 1 || Number.isNaN(bookID)) {
        next();
    } else {
        getBookWithAuthors(bookID).then((result) => {
                //'result' is an array with the following format:
                // [ [array containing the requested book (length=1)] , [array of authors]]
                res.render('pages/book', {
                    book: result[0][0],
                    authors: result[1]
                });
            })
            .catch((err) => {
                console.error(err);
                err.status = 500;
                next(err);
                knex.destroy();
            })
    } //END ELSE
}); //END GET :id

//POST (add) a new book
router.post('/books', (req, res) => {

    //If all book attributes are provided
    if(req.body.title && req.body.genre && req.body.description && req.body.cover_url){
        knex('book').insert({
            title: req.body.title,
            genre: req.body.genre,
            description: req.body.description,
            cover_url: req.body.cover_url
        }).then( (result) => {
            res.render('pages/bookadded', {
                data: result
            });
        }).catch( (err) => {
            console.error(err);
            err.status = 500;
            next(err);
            knex.destroy();
        });

    } else {
        next();
    }
});

//PATCH (edit) a book with the specified id
router.patch('/books/:id', (req, res) => {

});

//DELETE a book with the specified id
router.delete('/books/:id', (req, res) => {

});

module.exports = router;

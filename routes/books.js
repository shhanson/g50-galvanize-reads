'use strict';

//Setup for knex stuff
const env = 'development';
const config = require('../knexfile')[env];
const knex = require('knex')(config);

//Setup for express server and router
const express = require('express');
const router = express.Router();

function getBook(id) {
    return knex('books')
        //.join('books_authors', 'books.id', 'books_authors.book_id')
        .where('books.id', id);
}

function getAuthorsForBook(bookID) {
    return knex('authors')
        .join('books_authors', 'authors.id', 'books_authors.author_id')
        .where('books_authors.book_id', bookID);
}

function getBookWithAuthors(bookID){
    return Promise.all([
        getBook(bookID),
        getAuthorsForBook(bookID)
    ])
    .then( (result) => {
        let book = result[0][0];
        let bookObj = {};
        bookObj.title = book.title;
        bookObj.genre = book.genre;
        bookObj.description = book.description;
        bookObj.cover_url = book.cover_url;
        bookObj.authors = result[1];
        for(let i = 0; i < bookObj.authors.length; i++){
            console.log(bookObj.authors[i]);
        }
        return bookObj;
    });
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

    const bookID = Number.parseInt(req.params.id);
    if (bookID < 1 || Number.isNaN(bookID)) {
        console.log("ILLEGAL ID");
        next();
    } else {
        getBookWithAuthors(bookID).then( (result) => {
            res.render('pages/book', {data: result});
        })
        .catch( (err) => {

        })
        //res.render('pages/book', {data: getBookWithAuthors(bookID)});
    } //END ELSE
}); //END GET :id

//POST (add) a new book
router.post('/books', (req, res) => {

});

//PATCH (edit) a book with the specified id
router.patch('/books/:id', (req, res) => {

});

//DELETE a book with the specified id
router.delete('/books/:id', (req, res) => {

});

module.exports = router;

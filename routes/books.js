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

function deleteBookFromJoinTable(bookID) {
    return knex('books_authors').where('book_id', bookID).del();
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
}

function knexError(err) {
    console.error(err);
    err.status = 500;
    knex.destroy();
    return err;
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
            next(knexError(err));
        }) //END CATCH
}); //END GET

//GET a book with the specified id
router.get('/books/:id', (req, res, next) => {
    const bookID = Number.parseInt(req.params.id);
    if (!isValidID(bookID)) {
        next();
    } else {
        getBookWithAuthors(bookID).then((result) => {
                res.render('pages/book', {
                    book: result[0][0],
                    authors: result[1]
                });
            })
            .catch((err) => {
                next(knexError(err));
            });
    } //END ELSE
}); //END GET :id

//POST (add) a new book
router.post('/books', (req, res, next) => {

    knex('books').returning('id').insert({
        title: req.body.title,
        genre: req.body.genre,
        description: req.body.description,
        cover_url: req.body.cover_url
    }).then((idArray) => {
        getBook(idArray[0]).then((result) => {
            res.render('pages/book', {
                book: result[0],
                authors: undefined
            });
        }).catch((err) => {
            next(knexError(err));
        });

    }).catch((err) => {
        next(knexError(err));
    });
});

//PUT (edit) a book with the specified id
router.put('/books/:id', (req, res, next) => {

    let bookID = Number.parseInt(req.params.id);
    if (!isValidID(bookID)) {
        next();
    } else {
        //Query to fetch the book to be updated
        getBook(bookID).then((result) => {
            let bookOrig = result[0];
            //If user did not provide info for a particular field, retain the former field info
            let bookUpdated = {
                title: req.body.title || bookOrig.title,
                genre: req.body.genre || bookOrig.genre,
                description: req.body.description || bookOrig.description,
                cover_url: req.body.cover_url || bookOrig.cover_url
            };
            //Query to replace the book with the given ID with the updated book
            knex('books').returning('id').where('id', bookID).update(bookUpdated).then((idArray) => {
                //Query to fetch the book with its authors and render
                getBookWithAuthors(idArray[0]).then((bookInfo) => {
                        res.render('pages/book', {
                            book: bookInfo[0][0],
                            authors: bookInfo[1]
                        });
                    })
                    .catch((err) => {
                        next(knexError(err));
                    });

            }).catch((err) => {
                next(knexError(err));
            });

        }).catch((err) => {
            next(knexError(err));
        });

    } //END ELSE

}); //END PUT

//DELETE a book with the specified id
router.delete('/books/:id', (req, res, next) => {
    let bookID = Number.parseInt(req.params.id);
    if (!isValidID(bookID)) {
        next();
    } else {
        //book must be deleted from join table 'books_authors' before it can be removed from 'books'
        deleteBookFromJoinTable(bookID).then( () => {
            knex('books').where('id', bookID).del().then(()=> {
                res.sendStatus(200);
            }).catch((err) => {
                next(knexError(err));
            })
        }).catch((err) => {
            next(knexError(err));
        })
    }
});

module.exports = router;

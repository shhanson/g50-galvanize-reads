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
router.use(bodyParser.urlencoded({ extended: false }));

//Helper functions
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
        .where('books_authors.book_id', bookID).orderBy('authors.last_name');
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
    knex('books').orderBy('title')
        .then((result) => {
            res.render('pages/books', {
                data: result
            });
        }) //END THEN
        .catch((err) => {
            next(knexError(err));
        }) //END CATC
}); //END GET

//GET a book with the specified id
router.get('/books/:id', (req, res, next) => {
    const bookID = Number.parseInt(req.params.id);
    if (!isValidID(bookID)) {
        next();
    } else {
        getBookWithAuthors(bookID).then((result) => {
                if (result[0][0] === undefined) {
                    next();
                } else {
                    res.render('pages/book', {
                        book: result[0][0],
                        authors: result[1]
                    });
                }
            })
            .catch((err) => {
                next(knexError(err));
            });
    } //END ELSE
}); //END GET :id

//GET method to render the addBook page. Sends all author names to populate form.
router.get('/books/add', (req, res, next) => {
    knex.select('id', 'first_name', 'last_name').from('authors').then((result) => {
        res.render('pages/addBook', {authors: result});
    }).catch((err) => {
        next(knexError(err));
    });
});

//GET method to render the editBook page.
//Sends current book data to populate fields.
router.get('/books/edit/:id', (req, res, next) => {
    let bookID = Number.parseInt(req.params.id);
    if (!isValidID(bookID)) {
        next();
    } else {
        getBookWithAuthors(bookID).then((result) => {
                if (result[0][0] === undefined) {
                    next();
                } else {

                    knex('authors').then((authors) => {

                        let allAuthors = authors;
                        let actualAuthors = result[1];

                        for(let i = 0; i < allAuthors.length; i++){
                            for(let j = 0; j < actualAuthors.length; j++){
                                if(allAuthors[i].id === actualAuthors[j].id){
                                    allAuthors[i].checked = true;
                                }
                            }
                        }
                        res.render('pages/editBook', {
                            book: result[0][0],
                            authors: allAuthors
                        });
                    }).catch((err) => {
                        next(knexError(err));
                    });
                }
            })
            .catch((err) => {
                next(knexError(err));
            });
    }
});

//POST (add) a new book
router.post('/books', (req, res, next) => {
    knex('books').returning('id').insert({
        title: req.body.title,
        genre: req.body.genre,
        description: req.body.description,
        cover_url: req.body.cover_url
    }).then((idArray) => {
        getBook(idArray[0]).then(() => {
            res.send(JSON.stringify(idArray[0]));
        }).catch((err) => {
            next(knexError(err));
        });
    }).catch((err) => {
        next(knexError(err));
    });
});

//POST entry to the books_authors table whenever a new book is added
router.post('/booksauthors', (req, res, next) => {
    knex('books_authors').insert({
        book_id: req.body.book_id,
        author_id: req.body.author_id
    }).then(()=>{
        res.sendStatus(200);
    }).catch((err) => {
        next(knexError(err));
    });
});

router.delete('/booksauthors/:id', (req, res, next) => {
    let bookID = Number.parseInt(req.params.id);
    if(!isValidID(bookID)){
        next();
    } else {
        knex('books_authors').where('book_id', bookID).del().then(()=> {
            res.sendStatus(200);
        }).catch((err)=> {
            next(knexError(err));
        });
    }

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
                title: req.body.title,
                genre: req.body.genre,
                description: req.body.description,
                cover_url: req.body.cover_url,
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
        deleteBookFromJoinTable(bookID).then((result) => {
            // if (result === 0) {
            //     next();
            // } else {
                knex('books').where('id', bookID).del().then(() => {
                    res.sendStatus(200);
                }).catch((err) => {
                    next(knexError(err));
                });
            //}
        }).catch((err) => {
            next(knexError(err));
        })
    }
});

module.exports = router;

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

function isValidID(id) {
    return (id >= 1 && !Number.isNaN(id));
}

//Query to return an author with the specified ID
function getAuthor(id) {
    return knex('authors').where('authors.id', id);
}

function getBooksForAuthor(authorID) {
    //Query that joins the 'books' table with 'books_authors' and returns entries with author_id equal to the authorID provided
    return knex('books').join('books_authors', 'books.id', 'books_authors.book_id').where('books_authors.author_id', authorID);
}

function getAuthorWithBooks(authorID) {
    //Calls getAuthor and getBooksForAuthor functions,
    //'result' is an array with the following format:
    // [ [array containing the requested author (length=1)] , [array of books]]
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

function deleteAuthorFromJoinTable(authorID){
    return knex('books_authors').where('author_id', authorID).del();
}

//GET method to render the addAuthor page (form)
router.get('/authors/add', (req, res) => {
    res.render('pages/addAuthor');
});

//GET method to render the editAuthor page
//Sends current author data to populate fields
router.get('/authors/edit/:id', (req, res, next) =>{
    let authorID = Number.parseInt(req.params.id);
    if(!isValidID(authorID)){
        next();
    } else{
        knex('authors').where('id', authorID).then((result) => {
            if(result[0] === undefined){
                next();
            } else {
                res.render('pages/editAuthor', {data: result[0]});
            }

        }).catch((err) => {
            next(knexError(err));
        });
    }
});

//GET all authors
router.get('/authors', (req, res, next) => {
    knex('authors').then((result) => {
        res.render('pages/authors', {
            data: result
        });
    }).catch((err) => {
        next(knexError(err));
    });

});

//GET an author with the specified ID
router.get('/authors/:id', (req, res, next) => {
    let authorID = Number.parseInt(req.params.id);
    if (!isValidID(authorID)) {
        next();
    } else {
        //Gather all books associated with author
        getAuthorWithBooks(authorID).then((result) => {
            if (result[0][0] === undefined) {
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

//POST (add) a new author
router.post('/authors', (req, res, next) => {

    knex('authors').returning('id').insert({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        bio: req.body.bio,
        portrait_url: req.body.portrait_url
    }).then((idArray) => {
        //Render page with new author
        getAuthor(idArray[0]).then(() => {
            // res.render('pages/author', {
            //     author: result[0],
            //     books: undefined
            // });
            res.send(JSON.stringify(idArray[0]));
        }).catch((err) => {
            next(knexError(err));
        });
    }).catch((err) => {
        next(knexError(err));
    });
});

//PUT (edit) an author with the specified ID
router.put('/authors/:id', (req, res, next) => {
    let authorID = Number.parseInt(req.params.id);
    if(!isValidID(authorID)){
        next();
    } else {
        getAuthor(authorID).then( (result) => {
            //If only some of the author info was provided for the edit, retain the previous //information
            let authorOrig = result[0];
            let updatedAuthor = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                bio: req.body.bio,
                portrait_url: req.body.portrait_url
            };
            knex('authors').returning('id').where('id', authorID).update(updatedAuthor).then((idArray) => {

                //Render page showing updated author information
                getAuthorWithBooks(idArray[0]).then((authorInfo) => {
                    res.render('pages/author', {
                        author: authorInfo[0][0],
                        books: authorInfo[1]
                    });

                }).catch((err) => {
                    next(knexError(err));
                });

            }).catch((err) => {
                next(knexError(err));
            });

        }).catch((err) => {
            next(knexError(err));
        });
    }
});

//DELETE an author with the specified ID
router.delete('/authors/:id', (req, res, next) => {
    let authorID = Number.parseInt(req.params.id);
    if(!isValidID(authorID)){
        next();
    } else {
        //Author must be deleted from the books_authors table before deleting from authors table
        deleteAuthorFromJoinTable(authorID).then( (result) => {
            // if(result === 0){
            //     next();
            // } else {
                knex('authors').where('id', authorID).del().then(() => {
                    res.sendStatus(200);

                }).catch((err) => {
                    next(knexError(err));
                });
            //}

        }).catch((err) => {
            next(knexError(err));
        });
    }
});

module.exports = router;

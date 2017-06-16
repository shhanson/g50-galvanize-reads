$(document).ready(function() {
    //Initialize multiselect author menu
    $('select').material_select();
    // console.log("READY");

    //Event handler for submitting the add book form
    $('#addBookForm').submit((event) => {
        event.preventDefault();

        //For storing the ID of the newly created book.
        let newBookID;

        //Object to store the new book data
        let newBook = {
            title: $('#title').val(),
            genre: $('#genre').val(),
            description: $('#description').val(),
            cover_url: $('#cover_url').val()
        };

        $.post('/books', newBook).done((id) => {

            newBookID = id;
            //Store the array of selected authors from the authors menu
            let selectedAuthors = $('#authorsMenu').children(":selected");

            //Loop through each selected author and POST to books_authors for each author
            for(let i = 0; i < selectedAuthors.length; i++){
                //console.log(`BOOK_ID: ${newBookID}, AUTHOR_ID: ${selectedAuthors[i].id}`);
                let newEntry = {
                    book_id: newBookID,
                    author_id: selectedAuthors[i].id
                };

                $.post('/booksauthors', newEntry).done( ()=> {
                    if(i === selectedAuthors.length-1){
                        window.location.replace(`/books/${newBookID}`);
                    }
                });//END BOOKSAUTHORSPOST

            }//END AUTHOR LOOP

        }); //END BOOKS POST


        //Display book page

    }); //END ADDBOOK FORM SUBMISSION






}); //END

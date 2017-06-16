$(document).ready(function() {

    function getIDFromURL(){
        return window.location.pathname.match(/\d+$/)[0];
    }

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
                }).error(()=>{
                    console.error("BOOKSAUTHORS POST ERROR");
                });//END BOOKSAUTHORSPOST

            }//END AUTHOR LOOP

        }).error(()=> {
            console.error("BOOKS POST ERROR");
        }); //END BOOKS POST


        //Display book page

    }); //END ADDBOOK FORM SUBMISSION


    $('#editBookForm').submit((event) => {
        event.preventDefault();

        let bookID = getIDFromURL();

        let editedBook = {
            title: $('#title').val(),
            genre: $('#genre').val(),
            description: $('#description').val(),
            cover_url: $('#cover_url').val()
        };

        $.ajax({
            type: 'PUT',
            url: `/books/${bookID}`,
            data: editedBook,
            success: () => {

                $.ajax({
                    type: 'DELETE',
                    url: `/booksauthors/${bookID}`,
                    success: () => {

                        let selectedAuthors = $('#authorsMenu').children(":selected");
                        for(let i = 0; i < selectedAuthors.length; i++){
                            let newEntry = {
                                book_id: bookID,
                                author_id: selectedAuthors[i].id
                            };


                            $.post('/booksauthors', newEntry).done(() =>{
                                if(i === selectedAuthors.length-1){
                                    window.location.replace(`/books/${bookID}`);
                                }

                            }).error( ()=> {
                                console.error("BOOKSAUTHORS POST ERROR");
                            });
                        }

                    }
                }).error(()=>{
                    console.error("BOOKSAUTHORS DELETE ERROR");

                });
            }
        }).error( ()=>{
            console.error("BOOK PUT ERROR");
        });

    }); //END EDITBOOK FORM SUBMISSION

    $('#editBookBtn').click(()=>{
        let bookID = getIDFromURL();
        window.location.replace(`/books/edit/${bookID}`);

    });

    $('#deleteBookBtn').click(()=> {
        let response = confirm("Are you sure you want to delete this book?");
        if(response){
            let bookID = getIDFromURL();

            $.ajax({
                type: 'DELETE',
                url: `/books/${bookID}`,
                success: () =>{
                    window.location.replace('/books');
                }
            }).error(()=>{
                console.error("DELETE BOOK ERROR");
            });
        }
    }); //END DELETEBOOK

}); //END

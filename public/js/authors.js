$(document).ready(function() {

    function getIDFromURL() {
        return window.location.pathname.match(/\d+$/)[0];
    }

    $('#editAuthorForm').submit((event) => {
        event.preventDefault();

        let authorID = getIDFromURL();

        let editedAuthor = {
            first_name: $('#first_name').val(),
            last_name: $('#last_name').val(),
            bio: $('#bio').val(),
            portrait_url: $('#portrait_url').val()
        };

        console.log(editedAuthor);

        $.ajax({
            type: 'PUT',
            url: `/authors/${authorID}`,
            data: editedAuthor,
            success: () => {
                window.location.replace(`/authors/${authorID}`);
            }
        }).error( ()=>{
            console.error("AUTHOR PUT ERROR");
        });
    }); //END EDITAUTHOR FORM SUBMISSION


    $("#deleteAuthorBtn").click(() => {
        let response = confirm("Are you sure you want to delete this author?");
        if(response){
            let authorID = getIDFromURL();

            $.ajax({
                type: 'DELETE',
                url: `/authors/${authorID}`,
                success: () => {
                    window.location.replace('/authors');
                }

            }).error(()=>{
                console.error("DELETE AUTHOR ERROR");
            });

        }


    }); //END DELETEAUTHOR

    $('#editAuthorBtn').click(() => {
        let authorID = getIDFromURL();
        window.location.replace(`/authors/edit/${authorID}`);

    }); //END EDIT AUTHOR BTN

}); //END

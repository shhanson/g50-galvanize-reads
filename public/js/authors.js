$(document).ready(function() {

    function getIDFromURL() {
        return window.location.pathname.match(/\d+$/)[0];
    }

    $('#addAuthorForm').submit((event) => {

        event.preventDefault();
        let newAuthorID;

        let newAuthor = {
            first_name: $('#first_name').val(),
            last_name: $('#last_name').val(),
            bio: $('#bio').val(),
            portrait_url: $('#portrait_url').val()
        };

        $.post('/author', newAuthor).done((id)=> {
            console.log(id);
            newAuthorID = id;
            window.location.replace(`/author/${newAuthorID}`);

        }).error(()=> {
            console.error("AUTHOR POST ERROR");
        });

    }); //END ADD AUTHOR FORM SUBMISSION

    $('#editAuthorForm').submit((event) => {
        event.preventDefault();

        let authorID = getIDFromURL();

        let editedAuthor = {
            first_name: $('#first_name').val(),
            last_name: $('#last_name').val(),
            bio: $('#bio').val(),
            portrait_url: $('#portrait_url').val()
        };


        $.ajax({
            type: 'PUT',
            url: `/author/${authorID}`,
            data: editedAuthor,
            success: () => {
                window.location.replace(`/author/${authorID}`);
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
                url: `/author/${authorID}`,
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
        window.location.replace(`/author/edit/${authorID}`);

    }); //END EDIT AUTHOR BTN

}); //END

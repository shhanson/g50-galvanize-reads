$(document).ready(function() {

    const options = {
        valueNames: ['id', 'name'],
        page: 10,
        pagination: true
    };

    const authorsList = new List('authorsList', options);

    //Display the total number of authors
    updateCount();

    //Event listener for searchbox submission
    $('#authorSearchSubmit').click((event)=>{
        event.preventDefault();
        let searchVal = $('#authorSearch').val();
        authorsList.search(searchVal);
        updateCount();
    });

    //Event listener for searchbox clear
    $('#clearAuthorSearch').click((event)=>{
        event.preventDefault();
        $('#authorSearch').val("");
        authorsList.search();
        updateCount();
    });

    //Helper function
    function updateCount(){
        $('#authorCount').text(`Showing ${authorsList.visibleItems.length} author${(authorsList.visibleItems.length === 1) ? '' : 's'}`);
    }

}); //END ALL

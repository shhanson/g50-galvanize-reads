$(document).ready(function() {

    let options = {
        valueNames: ['id', 'name'],
        page: 10,
        pagination: true
    };

    let authorsList = new List('authorsList', options);
    //console.log(authorsList);

    $('#authorCount').text(`Showing ${authorsList.size()} authors`);


    $('#authorSearchSubmit').click((event)=>{
        event.preventDefault();
        let searchVal = $('#authorSearch').val();
        authorsList.search(searchVal);
        $('#authorCount').text(`Showing ${authorsList.visibleItems.length} authors`);




    });

    $('#clearAuthorSearch').click((event)=>{
        event.preventDefault();
        $('#authorSearch').val("");
        authorsList.search();
        $('#authorCount').text(`Showing ${authorsList.size()} authors`);
    });





}); //END ALL

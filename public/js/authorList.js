$(document).ready(function() {

    let options = {
        valueNames: ['id', 'name'],
        page: 10,
        pagination: true
    };

    let authorsList = new List('authorsList', options);
    console.log(authorsList);

    $('#authorCount').text(`Showing ${authorsList.size()} authors`);


    $('#authorSearch').change(()=>{


        console.log($('#authorSearch').val());


    });

    $('#clearAuthorSearch').click(()=>{
        $('#authorSearch').val("");
    });





}); //END ALL

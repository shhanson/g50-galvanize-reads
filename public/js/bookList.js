$(document).ready(function() {

    let options = {
        valueNames: ['genre']
    };


    let booksList = new List('booksList', options);

    //let $genreList = $.map($(".genre"), $.text);
    let uniqueGenres = Array.from( new Set($.map($(".genre"), $.text)) );

    uniqueGenres.forEach((genre)=>{
        let $li = $('<li></li>');
        let $a = $('<a href="#"></a>');
        $li.append($a);
        $a.text(genre);

        $li.click(()=>{

        });
        $('#genreList').append($li);
    });


    $('#bookSearch').change(()=> {
        console.log($('#bookSearch').val())


    });

    $('#clearBookSearch').click(()=>{
        $('#bookSearch').val("");
    });












}); //END ALL

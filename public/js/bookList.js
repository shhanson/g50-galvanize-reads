$(document).ready(function() {

    let options = {
        valueNames: ['genre']
    };


    let booksList = new List('booksList', options);

    //let $genreList = $.map($(".genre"), $.text);
    let uniqueGenres = Array.from( new Set($.map($(".genre"), $.text)) );

    uniqueGenres.forEach((genre)=>{
        let $li = $('<li></li>');
        $li.text(genre);
        $('#genreList').append($li);
    });












}); //END ALL

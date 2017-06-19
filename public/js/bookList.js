$(document).ready(function() {

    let options = {
        valueNames: ['id', 'genre', 'title'],
        page: 10,
        pagination: true
    };

    let booksList = new List('booksList', options);

    $('#bookCount').text(`Showing ${booksList.size()} books`);

    let uniqueGenres = Array.from( new Set($.map($(".genre"), $.text)) );

    uniqueGenres.forEach(function(genre){

        let $li = $('<li></li>');
        let $a = $('<a href="#"></a>');
        $li.append($a);
        $a.text(genre);

        $li.click((event)=>{
            let clickedGenre = event.target.innerText;

            let filteredList = booksList.filter(function(item){
                if(item.values().genre === clickedGenre){
                    return true;
                } else{
                    return false;
                }
            });

            $('#bookCount').text(`Showing ${filteredList.length} books`);
        });

        $('#genreList').append($li);

    });


    $('#clearFilter').click(()=>{
        booksList.filter();
        $('#bookCount').text(`Showing ${booksList.size()} books`);
    });

    $('#bookSearch').change(()=> {
        console.log($('#bookSearch').val())


    });

    $('#clearBookSearch').click(()=>{
        $('#bookSearch').val("");

    });

}); //END ALL

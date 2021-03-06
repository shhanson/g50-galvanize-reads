$(document).ready(function() {

    const options = {
        valueNames: ['id', 'genre', 'title'],
        page: 10,
        pagination: true
    };

    const booksList = new List('booksList', options);

    //Displays the total number of books
    updateCount();

    //Gathers the elements with the "genre" class from the page and creates an Array
    //containing each genre (no dupes).
    let uniqueGenres = Array.from( new Set($.map($(".genre"), $.text)) );

    //For each genre in genreList, create an li element.
    //Create a listener for each genre li
    //When a genre is clicked, only the books with that genre will be displayed.
    uniqueGenres.forEach(function(genre){

        let $li = $('<li></li>');
        let $a = $('<a href="#" class="genreLink"></a>');
        $li.append($a);
        $a.text(genre);

        $li.click((event)=>{
            let clickedGenre = event.target.innerText;
            $('.genreLink').css('background-color', 'transparent');
            $a.css('background-color', 'yellow');
            booksList.filter((item) =>
                 (item.values().genre === clickedGenre) ? true : false);
            updateCount();
        });
        $('#genreList').append($li);
    });

    //Listener for "clear filter" link
    $('#clearFilter').click(()=>{
        $('.genreLink').css('background-color', 'transparent');
        booksList.filter();
        updateCount();
    });


    //Listener for searchbox
    $('#bookSearchSubmit').click((event)=> {
        event.preventDefault();
        let searchVal = $('#bookSearch').val();
        booksList.search(searchVal);
        updateCount();
    });

    //Listener for clear searchbox
    $('#clearBookSearch').click((event)=>{
        event.preventDefault();
        $('#bookSearch').val("");
        booksList.search();
        updateCount();
    });

    //Helper function
    function updateCount(){
        $('#bookCount').text(`Showing ${booksList.visibleItems.length} book${(booksList.visibleItems.length === 1) ? '' : 's'}`);
    }

}); //END ALL

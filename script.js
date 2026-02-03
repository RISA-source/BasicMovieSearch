const api_key = `3da926e9`

async function fetchData(movie) {
    try {
        console.log('Fetching data for:', movie);
        const response = await fetch(`https://www.omdbapi.com/?t=${movie}&apikey=${api_key}`)
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json()
        console.log('API Response:', data)

        if (data.Response === "False") {
            alert(`Error: ${data.Error}`);
            return;
        }

        const name = data.Title
        const postLink = data.Poster
        const genre = data.Genre
        const plot = data.Plot
        const language = data.Language
        const imdbRating = data.Ratings && data.Ratings[0] ? data.Ratings[0].Value : 'N/A'
        const release = data.Released
        const director = data.Director
        const writer = data.Writer
        const cast = data.Actors
        const run = data.Runtime
        const boxOffice = data.BoxOffice || 'N/A'

        elements.title.innerText = `${name}`
        elements.poster.src = postLink
        elements.genre.innerText = `Genre: ${genre}`
        elements.plot.innerText = `Synopsis: ${plot}`
        elements.language.innerText = `Language: ${language}`
        elements.imdbRating.innerText = `IMDB Rating: ${imdbRating}`
        elements.releaseDate.innerText = `Release Date: ${release}`
        elements.directedBy.innerText = `Directed By: ${director}`
        elements.writtenBy.innerText = `Written By: ${writer}`
        elements.cast.innerText = `Cast: ${cast}`
        elements.runTime.innerText = `Runtime: ${run}`
        elements.boxOffice.innerHTML = `Box Office: ${boxOffice}`

        document.body.style.backgroundImage = `url('${postLink}')`;
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

    } catch (error) {
        console.error('Fetch error:', error);
        alert('Error fetching movie data. Please try again.');
    }
}

const elements = {
    movieName: document.getElementById('movie'),
    searchButton: document.getElementById('search-button'),
    title: document.getElementById('movie-name'),
    poster: document.getElementById('poster'),
    genre: document.getElementById('genre'),
    plot: document.getElementById('plot'),
    language: document.getElementById('language'),
    imdbRating: document.getElementById('imdb-rating'),
    releaseDate: document.getElementById('release-date'),
    directedBy: document.getElementById('directed-by'),
    writtenBy: document.getElementById('written-by'),
    cast: document.getElementById('cast'),
    runTime: document.getElementById('run'),
    boxOffice: document.getElementById('box-office')
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, fetching initial movie...');
    fetchData('Joker');
});

const inputField = document.getElementById('movie');
inputField.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        console.log('Enter key pressed in input field');
        const movie = document.getElementById('movie').value.trim();
        if (movie) {
            fetchData(movie)
        } else {
            alert('Please enter a movie name.');
        }
    }
});

elements.searchButton.addEventListener('click', () => {
    const movie = document.getElementById('movie').value.trim();
    if (movie) {
        fetchData(movie)
    } else {
        alert('Please enter a movie name.');
    }
})

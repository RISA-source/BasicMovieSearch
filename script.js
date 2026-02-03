const api_key = `50d63ef5`

async function fetchData(movie) {
    try {
        const response = await fetch(`http://www.omdbapi.com/?t=${movie}&apikey=${api_key}`)
        const data = await response.json()
        console.log(data)

        const name = data.Title
        const postLink = data.Poster
        const genre = data.Genre
        const plot = data.Plot
        const language = data.Language
        const imdbRating = data.Ratings[0].Value
        const release = data.Released
        const director = data.Director
        const writer = data.Writer
        const cast = data.Actors
        const run = data.Runtime
        const boxOffice = data.BoxOffice

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
        document.body.style.backgroundSize = "cover"; // Adjusts the image to cover the entire background
        document.body.style.backgroundPosition = "center"; // Centers the image

    } catch (error) {
        throw new Error(error)
    }
}

fetchData('Joker')

const elements = {
    movieName: document.getElementById('movie').value,
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

const inputField = document.getElementById('movie');
inputField.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        console.log('Enter key pressed in input field');
        const movie = document.getElementById('movie').value
        if (movie) {
            fetchData(movie)
        } else {
            throw new Error('Please input the data.')
        }
    }
});

elements.searchButton.addEventListener('click', () => {
    const movie = document.getElementById('movie').value
    if (movie) {
        fetchData(movie)
    } else {
        throw new Error('Please input the data.')
    }
})

const api_key = `3da926e9`

// Show loading spinner
function showLoading() {
    const loader = document.getElementById('loading');
    loader.classList.remove('hidden');
}

// Hide loading spinner
function hideLoading() {
    const loader = document.getElementById('loading');
    loader.classList.add('hidden');
}

// Search History Functions
function getSearchHistory() {
    const history = localStorage.getItem('movieSearchHistory');
    return history ? JSON.parse(history) : [];
}

function saveToHistory(movieTitle) {
    let history = getSearchHistory();
    
    // Remove if already exists (to move to top)
    history = history.filter(item => item.toLowerCase() !== movieTitle.toLowerCase());
    
    // Add to beginning of array
    history.unshift(movieTitle);
    
    // Keep only last 5 searches
    history = history.slice(0, 5);
    
    // Save to localStorage
    localStorage.setItem('movieSearchHistory', JSON.stringify(history));
    
    // Update display
    displayHistory();
}

function displayHistory() {
    const history = getSearchHistory();
    const historyList = document.getElementById('history-list');
    
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<li class="no-history">No recent searches</li>';
        return;
    }
    
    history.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie;
        li.addEventListener('click', () => {
            elements.movieName.value = movie;
            hideHistoryDropdown();
            fetchData(movie);
        });
        historyList.appendChild(li);
    });
}

function clearHistory() {
    localStorage.removeItem('movieSearchHistory');
    displayHistory();
}

function showHistoryDropdown() {
    const dropdown = document.getElementById('history-dropdown');
    dropdown.classList.remove('hidden');
    displayHistory();
}

function hideHistoryDropdown() {
    const dropdown = document.getElementById('history-dropdown');
    dropdown.classList.add('hidden');
}

async function fetchData(movie) {
    showLoading(); // Show spinner when fetch starts
    
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
            hideLoading(); // Hide spinner on error
            return;
        }

        // Save successful search to history
        saveToHistory(movie);

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

        hideLoading(); // Hide spinner when data is loaded

    } catch (error) {
        console.error('Fetch error:', error);
        alert('Error fetching movie data. Please try again.');
        hideLoading(); // Hide spinner on error
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

// Show history dropdown when input is focused
elements.movieName.addEventListener('focus', () => {
    showHistoryDropdown();
});

// Hide history dropdown when clicking outside
document.addEventListener('click', (event) => {
    const searchWrapper = document.querySelector('.search-wrapper');
    if (!searchWrapper.contains(event.target)) {
        hideHistoryDropdown();
    }
});

// Clear history button
document.getElementById('clear-history').addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm('Clear all search history?')) {
        clearHistory();
    }
});

// Enter key search
const inputField = document.getElementById('movie');
inputField.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        console.log('Enter key pressed in input field');
        const movie = document.getElementById('movie').value.trim();
        if (movie) {
            hideHistoryDropdown();
            fetchData(movie)
        } else {
            alert('Please enter a movie name.');
        }
    }
});

// Search button click
elements.searchButton.addEventListener('click', () => {
    const movie = document.getElementById('movie').value.trim();
    if (movie) {
        hideHistoryDropdown();
        fetchData(movie)
    } else {
        alert('Please enter a movie name.');
    }
})
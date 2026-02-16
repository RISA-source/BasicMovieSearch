const api_key = `3da926e9`

// Show loading spinner
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

// Hide loading spinner
function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// Update hazy background with poster
function updateBackground(posterUrl) {
    const hazyBg = document.getElementById('hazy-bg');
    if (posterUrl && posterUrl !== 'N/A') {
        hazyBg.style.backgroundImage = `linear-gradient(rgba(10, 10, 10, 0.6), rgba(10, 10, 10, 0.9)), url('${posterUrl}')`;
    }
}

// Search History Functions
function getSearchHistory() {
    const history = localStorage.getItem('movieSearchHistory');
    return history ? JSON.parse(history) : [];
}

function saveToHistory(movieTitle) {
    let history = getSearchHistory();
    history = history.filter(item => item.toLowerCase() !== movieTitle.toLowerCase());
    history.unshift(movieTitle);
    history = history.slice(0, 5);
    localStorage.setItem('movieSearchHistory', JSON.stringify(history));
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
            document.getElementById('movie').value = movie;
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
    document.getElementById('history-dropdown').classList.remove('hidden');
    displayHistory();
}

function hideHistoryDropdown() {
    document.getElementById('history-dropdown').classList.add('hidden');
}

// Autocomplete Functions
let autocompleteTimeout;

function showAutocompleteDropdown() {
    document.getElementById('autocomplete-dropdown').classList.remove('hidden');
    hideHistoryDropdown();
}

function hideAutocompleteDropdown() {
    document.getElementById('autocomplete-dropdown').classList.add('hidden');
}

async function fetchAutocompleteSuggestions(query) {
    if (query.length < 2) {
        hideAutocompleteDropdown();
        return;
    }

    const autocompleteList = document.getElementById('autocomplete-list');
    autocompleteList.innerHTML = '<li class="autocomplete-loading">Searching...</li>';
    showAutocompleteDropdown();

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${api_key}`);
        const data = await response.json();

        if (data.Response === "False") {
            autocompleteList.innerHTML = '<li class="autocomplete-no-results">No movies found</li>';
            return;
        }

        autocompleteList.innerHTML = '';
        
        // Show first 6 results
        data.Search.slice(0, 6).forEach(movie => {
            const li = document.createElement('li');
            
            const poster = document.createElement('img');
            poster.className = 'movie-poster';
            poster.src = movie.Poster !== 'N/A' ? movie.Poster : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="60"><rect width="40" height="60" fill="%23333"/><text x="50%" y="50%" fill="%23666" text-anchor="middle" dy=".3em" font-size="10">No Image</text></svg>';
            poster.alt = movie.Title;
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'movie-info';
            
            const titleDiv = document.createElement('div');
            titleDiv.className = 'movie-title';
            titleDiv.textContent = movie.Title;
            
            const yearDiv = document.createElement('div');
            yearDiv.className = 'movie-year';
            yearDiv.textContent = `${movie.Year} • ${movie.Type}`;
            
            infoDiv.appendChild(titleDiv);
            infoDiv.appendChild(yearDiv);
            
            li.appendChild(poster);
            li.appendChild(infoDiv);
            
            li.addEventListener('click', () => {
                document.getElementById('movie').value = movie.Title;
                hideAutocompleteDropdown();
                fetchData(movie.Title);
            });
            
            autocompleteList.appendChild(li);
        });

    } catch (error) {
        console.error('Autocomplete error:', error);
        autocompleteList.innerHTML = '<li class="autocomplete-no-results">Error loading suggestions</li>';
    }
}


// Fetch Movie Data
async function fetchData(movie) {
    showLoading();
    
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
            hideLoading();
            return;
        }

        // Save successful search to history
        saveToHistory(movie);

        // Update background
        updateBackground(data.Poster);

        // Update movie details
        document.getElementById('movie-name').textContent = data.Title;
        document.getElementById('poster').src = data.Poster;
        document.getElementById('genre').textContent = data.Genre;
        document.getElementById('plot').textContent = data.Plot;
        document.getElementById('language').textContent = data.Language;
        
        const imdbRating = data.Ratings && data.Ratings[0] ? data.Ratings[0].Value.split('/')[0] : 'N/A';
        document.getElementById('imdb-rating').textContent = imdbRating;
        
        document.getElementById('release-date').textContent = data.Released;
        document.getElementById('directed-by').textContent = data.Director;
        document.getElementById('written-by').textContent = data.Writer;
        document.getElementById('cast').textContent = data.Actors;
        document.getElementById('run').textContent = data.Runtime;
        document.getElementById('box-office').textContent = data.BoxOffice || 'N/A';
        
        // Year and Runtime in header
        document.getElementById('year-runtime').textContent = `${data.Year} • ${data.Runtime}`;

        // Update page title
        document.title = `amazone | ${data.Title} (${data.Year})`;

        hideLoading();

    } catch (error) {
        console.error('Fetch error:', error);
        alert('Error fetching movie data. Please try again.');
        hideLoading();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, fetching initial movie...');
    fetchData('Joker');
});

// Show history dropdown when input is focused
document.getElementById('movie').addEventListener('focus', () => {
    const inputValue = document.getElementById('movie').value.trim();
    if (inputValue.length === 0) {
        showHistoryDropdown();
    }
});

// Autocomplete on input
document.getElementById('movie').addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    // Clear previous timeout
    clearTimeout(autocompleteTimeout);
    
    if (query.length === 0) {
        hideAutocompleteDropdown();
        return;
    }
    
    // Debounce: wait 300ms after user stops typing
    autocompleteTimeout = setTimeout(() => {
        fetchAutocompleteSuggestions(query);
    }, 300);
});

// Hide dropdowns when clicking outside
document.addEventListener('click', (event) => {
    const searchInput = document.getElementById('movie');
    const historyDropdown = document.getElementById('history-dropdown');
    const autocompleteDropdown = document.getElementById('autocomplete-dropdown');
    
    if (!searchInput.contains(event.target) && 
        !historyDropdown.contains(event.target) && 
        !autocompleteDropdown.contains(event.target)) {
        hideHistoryDropdown();
        hideAutocompleteDropdown();
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
document.getElementById('movie').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const movie = document.getElementById('movie').value.trim();
        if (movie) {
            hideHistoryDropdown();
            hideAutocompleteDropdown();
            fetchData(movie);
        } else {
            alert('Please enter a movie name.');
        }
    }
});

// Search button click
document.getElementById('search-button').addEventListener('click', () => {
    const movie = document.getElementById('movie').value.trim();
    if (movie) {
        hideHistoryDropdown();
        hideAutocompleteDropdown();
        fetchData(movie);
    } else {
        alert('Please enter a movie name.');
    }
});
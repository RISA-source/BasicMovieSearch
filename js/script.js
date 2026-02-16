const api_key = `3da926e9`

// Toast Notification System
function showToast(type, title, message, duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
        </button>
        <div class="toast-progress"></div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        toast.style.animation = 'slideInBottom 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}


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

// Update Ratings Display
function updateRatings(ratings) {
    // Default values
    document.getElementById('imdb-rating').textContent = 'N/A';
    document.getElementById('rt-rating').textContent = 'N/A';
    document.getElementById('metacritic-rating').textContent = 'N/A';
    
    // Hide all by default
    document.getElementById('rt-rating-container').classList.add('hidden');
    document.getElementById('metacritic-rating-container').classList.add('hidden');
    
    if (!ratings || ratings.length === 0) return;
    
    ratings.forEach(rating => {
        const source = rating.Source;
        const value = rating.Value;
        
        if (source === 'Internet Movie Database') {
            const imdbValue = value.split('/')[0];
            document.getElementById('imdb-rating').textContent = imdbValue;
        } 
        else if (source === 'Rotten Tomatoes') {
            document.getElementById('rt-rating').textContent = value;
            document.getElementById('rt-rating-container').classList.remove('hidden');
        } 
        else if (source === 'Metacritic') {
            const metacriticValue = value.split('/')[0];
            document.getElementById('metacritic-rating').textContent = metacriticValue;
            document.getElementById('metacritic-rating-container').classList.remove('hidden');
        }
    });
}

// Fetch Similar Movies
async function fetchSimilarMovies(movieTitle, genre) {
    try {
        // Extract first genre if multiple
        const mainGenre = genre ? genre.split(',')[0].trim() : '';
        
        if (!mainGenre) return;
        
        // Search for movies in the same genre
        const response = await fetch(`https://www.omdbapi.com/?s=${mainGenre}&type=movie&apikey=${api_key}`);
        const data = await response.json();
        
        if (data.Response === "False" || !data.Search) {
            return;
        }
        
        // Filter out the current movie and take 4 random movies
        const similarMovies = data.Search
            .filter(movie => movie.Title.toLowerCase() !== movieTitle.toLowerCase())
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
        
        displaySimilarMovies(similarMovies);
        
    } catch (error) {
        console.error('Error fetching similar movies:', error);
    }
}

// Display Similar Movies
function displaySimilarMovies(movies) {
    const container = document.getElementById('similar-movies-container');
    const section = document.getElementById('similar-movies-section');
    
    if (!movies || movies.length === 0) {
        section.classList.add('hidden');
        return;
    }
    
    container.innerHTML = '';
    section.classList.remove('hidden');
    
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'similar-movie-card';
        
        const posterUrl = movie.Poster !== 'N/A' 
            ? movie.Poster 
            : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><rect width="200" height="300" fill="%231a1a1a"/><text x="50%" y="50%" fill="%23666" text-anchor="middle" dy=".3em" font-size="14">No Poster</text></svg>';
        
        card.innerHTML = `
            <img src="${posterUrl}" alt="${movie.Title}">
            <div class="similar-movie-overlay">
                <div class="similar-movie-title">${movie.Title}</div>
                <div class="similar-movie-year">${movie.Year}</div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            document.getElementById('movie').value = movie.Title;
            fetchData(movie.Title);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        container.appendChild(card);
    });
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
            showToast('error', 'Movie Not Found', data.Error || 'Could not find the movie you searched for.');
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
        
        // Update all ratings
        updateRatings(data.Ratings);
        
        document.getElementById('release-date').textContent = data.Released;
        document.getElementById('directed-by').textContent = data.Director;
        document.getElementById('cast').textContent = data.Actors;
        document.getElementById('run').textContent = data.Runtime;
        document.getElementById('box-office').textContent = data.BoxOffice || 'N/A';
        
        // Year and Runtime in header
        document.getElementById('year-runtime').textContent = `${data.Year} • ${data.Runtime}`;

        // Update page title
        document.title = `amazone | ${data.Title} (${data.Year})`;

        // Show success toast
        showToast('success', 'Movie Loaded', `${data.Title} (${data.Year})`);

        // Fetch similar movies
        fetchSimilarMovies(data.Title, data.Genre);

        hideLoading();

    } catch (error) {
        console.error('Fetch error:', error);
        showToast('error', 'Connection Error', 'Unable to fetch movie data. Please check your connection and try again.');
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
    clearHistory();
    showToast('info', 'History Cleared', 'Your search history has been cleared.');
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
            showToast('warning', 'Empty Search', 'Please enter a movie name to search.');
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
        showToast('warning', 'Empty Search', 'Please enter a movie name to search.');
    }
});
# Movie Search App

A modern web application for searching movies and displaying comprehensive information using the OMDb API. Features a cinema-quality interface with glass-morphism design, dynamic backgrounds, and intelligent search capabilities.

## Demo

[Live Demo](https://risa-source.github.io/MovieSearch/)

## Features

### Core Functionality
- Real-time movie search with autocomplete suggestions
- Comprehensive movie information including multiple rating sources (IMDB, Rotten Tomatoes, Metacritic)
- Dynamic blurred background adapting to movie poster
- Similar movie recommendations based on genre
- Search history with localStorage persistence
- Toast notification system for user feedback

### User Experience
- Keyboard support (Enter key to search)
- Fully responsive design for mobile, tablet, and desktop
- Glass-morphism UI with backdrop blur effects
- Smooth animations and transitions
- Professional cinema-themed aesthetic

### Technical Features
- Debounced autocomplete for optimal API usage
- Error handling with user-friendly notifications
- Click-to-search on autocomplete and similar movie suggestions
- Automatic scroll-to-top on movie selection

## Technologies

- HTML5
- CSS3 (Glass-morphism, CSS Variables, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- Tailwind CSS via CDN
- Google Material Icons
- OMDb API

## Project Structure

```
BasicMovieSearch/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Custom styles and theme variables
├── js/
│   └── script.js      # Application logic and API integration
├── LICENSE            # MIT License
└── README.md          # Project documentation
```

## API Key Notice

This project is hosted on GitHub Pages as a static site for portfolio and demonstration purposes. The OMDb API key is visible in the client-side code (`js/script.js`), which is normal for static websites.

**Important notes:**
- The API key uses OMDb's free tier (1,000 requests/day)
- This is acceptable for demonstration and learning projects
- In production applications, API keys should be secured using:
  - Backend server/proxy
  - Environment variables
  - Serverless functions (Netlify/Vercel)

If you fork this project, please obtain your own API key from [OMDb API](https://www.omdbapi.com/apikey.aspx).

## Local Setup

1. Clone the repository:
```bash
git clone https://github.com/RISA-source/BasicMovieSearch.git
cd BasicMovieSearch
```

2. (Optional) Obtain your own API key from [OMDb API](https://www.omdbapi.com/apikey.aspx)

3. (Optional) Replace the API key in `js/script.js`:
```javascript
const api_key = 'your_api_key_here'
```

4. Open `index.html` in your browser or use a local server:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# VS Code Live Server
# Install "Live Server" extension and click "Go Live"
```

5. Navigate to `http://localhost:8000` in your browser

## Usage

1. Enter a movie title in the search bar
2. View autocomplete suggestions as you type
3. Press Enter, click Search, or select from suggestions
4. Browse comprehensive movie details including ratings, cast, and synopsis
5. Click on similar movie recommendations to explore related content
6. Access search history by clicking the search input

## API Reference

This project uses the [OMDb API](https://www.omdbapi.com/):
- **Endpoint:** `https://www.omdbapi.com/`
- **Methods:** 
  - Search by title: `?t={title}&apikey={key}`
  - Search suggestions: `?s={query}&apikey={key}`
- **Rate Limit:** 1,000 requests/day (free tier)
- **Response Format:** JSON

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

- API key is exposed in client-side code (intentional for static site demonstration)
- Rate limited to 1,000 API requests per day
- Requires active internet connection
- Similar movies based on genre matching only
- Search history limited to last 5 searches

## Performance Considerations

- Debounced autocomplete (300ms delay) to minimize API calls
- No caching of API responses (to stay within free tier limits)
- Optimized for modern browsers with CSS backdrop-filter support
- Lazy loading of similar movie recommendations

## Future Enhancements

- [ ] Implement service worker for offline capability
- [ ] Add movie trailer integration via YouTube API
- [ ] Create personal watchlist with localStorage
- [ ] Support for TV series search and information
- [ ] Advanced filtering options (year, rating, genre)
- [ ] Backend proxy for enhanced API key security
- [ ] Progressive Web App (PWA) capabilities
- [ ] User authentication for personalized features

## Contributing

Contributions are welcome. Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Movie data and ratings provided by [OMDb API](https://www.omdbapi.com/)
- Icons from [Google Material Symbols](https://fonts.google.com/icons)
- Styling framework: [Tailwind CSS](https://tailwindcss.com/)
- Default demonstration movie: "Joker" (2019)

---

**Note:** This project is designed for educational and portfolio purposes. For production use, implement proper API key management and consider rate limiting strategies.

# Movie Search App

A simple web application to search movies and display detailed information using the OMDb API. Features dynamic backgrounds that change to the selected movie's poster.

## Demo

[https://risa-source.github.io/BasicMovieSearch/](#) 

## Features

- Real-time movie search by title
- Detailed movie information (ratings, cast, plot, runtime, box office)
- Dynamic background with movie poster
- Keyboard support (Enter key to search)
- Responsive design
- Error handling for invalid searches

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- OMDb API

## ⚠️ API Key Notice

This project is hosted on GitHub Pages as a static site for portfolio/demonstration purposes. The OMDb API key is visible in the client-side code (`script.js`), which is normal for static websites.

**Important notes:**
- The API key uses OMDb's free tier (1,000 requests/day)
- This is acceptable for demonstration and learning projects
- In production applications, API keys should be secured using:
  - Backend server/proxy
  - Environment variables
  - Serverless functions (Netlify/Vercel)

If you fork this project, please get your own API key from [OMDb API](https://www.omdbapi.com/apikey.aspx).

## Local Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/movie-search-app.git
cd movie-search-app
```

2. (Optional) Get your own API key from [OMDb API](https://www.omdbapi.com/apikey.aspx)

3. (Optional) Replace the API key in `script.js`:
```javascript
const api_key = 'your_api_key_here'
```

4. Open `index.html` in your browser or use a local server:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server
```

## Usage

1. Enter a movie title in the search bar
2. Press Enter or click the "Search" button
3. View movie details with the poster as background

## API Reference

This project uses the [OMDb API](https://www.omdbapi.com/):
- **Endpoint:** `https://www.omdbapi.com/`
- **Method:** GET
- **Parameters:** `t` (title), `apikey`
- **Rate Limit:** 1,000 requests/day (free tier)

## Known Limitations

- API key is exposed (intentional for static site demo)
- No caching of API responses
- Limited to 1,000 searches per day
- Requires internet connection

## Future Improvements

- [ ] Add loading spinner during fetch
- [ ] Implement search suggestions/autocomplete
- [ ] Add favorite movies list with localStorage
- [ ] Support for TV series search
- [ ] Better mobile responsiveness
- [ ] Implement backend proxy for API key security

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Movie data provided by [OMDb API](https://www.omdbapi.com/)
- Default search: "Joker" (2019)

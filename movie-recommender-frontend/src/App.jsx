import { useState, useRef, useEffect } from "react";
import MovieCard from "./components/MovieCard";
import "./App.css";

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western"
];

function App() {
  const [movie, setMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  
  const moviesGridRef = useRef(null);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const resetApp = () => {
    setMovie("");
    setRecommendations([]);
    setError("");
    setSelectedGenres([]); 
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchRecommendations = async () => {
    setLoading(true);
    setError("");

    try {
      const [res] = await Promise.all([
        fetch("http://127.0.0.1:5000/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            movie: movie || null,
            genres: selectedGenres,
          }),
        }),
        delay(3000),
      ]);

      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError("Backend is unreachable. Please try again later.");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (recommendations.length > 0 && moviesGridRef.current) {
      setTimeout(() => {
        moviesGridRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [recommendations]);

  return (
    <div className="app">
      {loading && (
        <div className="loader-overlay">
          <div className="clapper-container">
            <div className="clapper-top"></div>
            <div className="clapper-middle"></div>
            <div className="clapper-bottom"></div>
          </div>
        </div>
      )}

      <div className="glass-container">
        <header className="header">
          <h1>Movie Recommender</h1>
          <p>Find movies similar to what you love</p>
        </header>

        <div className="search-section">
          <input
            type="text"
            placeholder="Enter a movie name..."
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
          />
          <button onClick={fetchRecommendations}>
            {loading ? "Finding..." : "Recommend"}
          </button>
          <button className="reset-btn" onClick={resetApp}>
            Reset
          </button>
        </div>

        <div className="genre-container">
          {GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              className={
                selectedGenres.includes(genre)
                  ? "genre-btn active"
                  : "genre-btn"
              }
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        {/* Recommended Movies Section */}
        {recommendations.length > 0 && (
          <div className="recommendations-section" ref={moviesGridRef}>
            <h2 className="recommendations-heading">🎬 Recommended Movies 🎬</h2>
            <div className="movies-grid">
              {recommendations.map((movie, index) => (
                <MovieCard key={index} title={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
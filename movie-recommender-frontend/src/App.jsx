import { useState } from "react";
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


  const fetchRecommendations = async () => {
  setLoading(true);
  setError("");

  try {
    const res = await fetch("http://127.0.0.1:5000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movie: movie || null,
        genres: selectedGenres
      }),
    });

    const data = await res.json();
    setRecommendations(data.recommendations || []);
  } catch (err) {
    setError("Backend is not running or an error occurred.");
  }

  setLoading(false);
};


  return (
  <div className="app">
    <div className="glass-container">
      <header className="header">
        <h1>🍿Movie Recommender🍿</h1>
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

      <div className="movies-grid">
        {recommendations.map((movie, index) => (
          <MovieCard key={index} title={movie} />
        ))}
      </div>
    </div>
  </div>
);

}

export default App;

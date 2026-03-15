import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { moviesAPI } from "../services/api";

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getAll();
      setMovies(response.data.movies);
    } catch (error) {
      console.error('Error loading movies:', error);
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="movie-rating">
        {"★".repeat(Math.floor(rating))}
        {"☆".repeat(5 - Math.floor(rating))}
        <span className="rating-number">{rating}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="movies-list-container">
        <div className="loading">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movies-list-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="movies-list-container">
      <div className="movies-grid">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <div className="movie-poster">
              <img 
                src={movie.poster} 
                alt={movie.title}
                onError={(e) => {
                  e.target.src = "https://picsum.photos/seed/default/300/450.jpg";
                }}
              />
            </div>
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <div className="movie-meta">
                <span className="movie-year">{movie.year}</span>
                <span className="movie-genre">{movie.genre}</span>
              </div>
              {renderStars(movie.averageRating || movie.rating)}
              <Link to={`/movie/${movie.id}`} className="view-details-btn">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoviesList;

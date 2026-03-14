import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import moviesData from "../data/movies.json";

function TopRated() {
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState("grid");

  // Sort movies based on selected criteria
  const sortedMovies = useMemo(() => {
    const sorted = [...moviesData];
    switch (sortBy) {
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "year":
        return sorted.sort((a, b) => b.year - a.year);
      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  }, [sortBy]);

  const renderStars = (rating) => {
    return (
      <div className="movie-rating">
        {"★".repeat(Math.floor(rating))}
        {"☆".repeat(5 - Math.floor(rating))}
        <span className="rating-number">{rating}</span>
      </div>
    );
  };

  return (
    <div className="top-rated-page">
      <div className="top-rated-container">
        <div className="top-rated-header">
          <h1>Top Rated Movies</h1>
          <div className="controls">
            <div className="sort-controls">
              <label htmlFor="sort-select" className="control-label">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="control-select"
              >
                <option value="rating">Rating</option>
                <option value="year">Year</option>
                <option value="title">Title</option>
              </select>
            </div>
            
            <div className="view-controls">
              <label htmlFor="view-select" className="control-label">
                View:
              </label>
              <select
                id="view-select"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="control-select"
              >
                <option value="grid">Grid</option>
                <option value="list">List</option>
              </select>
            </div>
          </div>
        </div>

        <div className={`top-movies-list ${viewMode}`}>
          {sortedMovies.map((movie, index) => (
            <div key={movie.id} className="top-movie-card">
              <div className="movie-rank">
                #{index + 1}
              </div>
              
              <Link to={`/movie/${movie.id}`} className="movie-link">
                <div className="movie-poster">
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    onError={(e) => {
                      e.target.src = "https://picsum.photos/seed/default/300/450.jpg";
                    }}
                  />
                  <div className="movie-overlay">
                    <div className="play-icon">▶</div>
                  </div>
                </div>
                
                <div className="movie-details">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-meta">
                    <span className="movie-year">{movie.year}</span>
                    <span className="movie-duration">{movie.duration}</span>
                    <span className="movie-genre">{movie.genre}</span>
                  </div>
                  <div className="movie-director">
                    <strong>Director:</strong> {movie.director}
                  </div>
                  {renderStars(movie.rating)}
                  <p className="movie-description">
                    {movie.description}
                  </p>
                  <button className="btn view-details-btn">
                    View Details
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {sortedMovies.length === 0 && (
          <div className="no-movies">
            <p>No top rated movies found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopRated;

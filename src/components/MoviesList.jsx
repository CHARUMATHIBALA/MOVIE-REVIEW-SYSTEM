import React from "react";
import { Link } from "react-router-dom";
import moviesData from '../data/movies.json';

function MoviesList() {
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
    <div className="movies-list-container">
      <div className="movies-grid">
        {moviesData.map(movie => (
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
              {renderStars(movie.rating)}
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

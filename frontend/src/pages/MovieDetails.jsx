import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { moviesAPI, reviewsAPI } from "../services/api";
import ReviewSystem from "../components/ReviewSystem";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load movie details
  useEffect(() => {
    loadMovie();
  }, [id]);

  const loadMovie = async () => {
    try {
      setIsLoading(true);
      const response = await moviesAPI.getById(id);
      setMovie(response.data.movie);
    } catch (error) {
      console.error('Error loading movie:', error);
      setError('Failed to load movie details');
    } finally {
      setIsLoading(false);
    }
  };

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="movie-details-page">
        <div className="container">
          <div className="loading">Loading movie details...</div>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="movie-details-page">
        <div className="container">
          <h1>Error</h1>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn primary-btn">Back to Home</button>
        </div>
      </div>
    );
  }

  // If movie not found, show error
  if (!movie) {
    return (
      <div className="movie-details-page">
        <div className="container">
          <h1>Movie Not Found</h1>
          <p>The movie you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn primary-btn">Back to Home</button>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return (
      <div className="movie-rating">
        {"★".repeat(fullStars)}
        {halfStar ? "☆" : ""}
        {"☆".repeat(emptyStars)}
        <span className="rating-number">{rating}</span>
      </div>
    );
  };

  return (
    <div className="movie-details-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <img src={movie.poster} alt={movie.title} />
        </div>
        <div className="hero-content">
          <div className="movie-info">
            <h1 className="movie-title">{movie.title}</h1>
            <div className="movie-meta">
              <span className="movie-year">{movie.year}</span>
              <span className="movie-genre">{movie.genre}</span>
              <span className="movie-rating">
                {renderStars(movie.averageRating || movie.rating)}
              </span>
            </div>
            <p className="movie-summary">{movie.description}</p>
            <div className="movie-actions">
              <button className="btn primary-btn">Watch Trailer</button>
              <button className="btn secondary-btn">Add to Watchlist</button>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="summary-section">
        <h2 className="section-title">Summary</h2>
        <p className="summary-text">{movie.description}</p>
      </section>

      {/* Cast Section */}
      {movie.cast && movie.cast.length > 0 && (
        <section className="cast-section">
          <h2 className="section-title">Cast</h2>
          <div className="cast-grid">
            {movie.cast.map((member, index) => (
              <div key={index} className="cast-card">
                <div className="cast-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="cast-info">
                  <div className="cast-name">{member.name}</div>
                  <div className="cast-character">{member.character}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2 className="section-title">Reviews</h2>
        <ReviewSystem />
      </section>
    </div>
  );
}

export default MovieDetails;


import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import moviesData from "../data/movies.json";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get search query from URL
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      setIsLoading(true);
      // Simulate search loading
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [searchParams]);

  // Filter movies based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return moviesData.filter(movie => 
      movie.title.toLowerCase().includes(query) ||
      movie.genre.toLowerCase().includes(query) ||
      movie.year.toString().includes(query)
    );
  }, [searchQuery]);

  const renderStars = (rating) => {
    return (
      <div className="movie-rating">
        {"★".repeat(Math.floor(rating))}
        {"☆".repeat(5 - Math.floor(rating))}
        <span className="rating-number">{rating}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="search-results-page">
        <div className="search-container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Searching for "{searchQuery}"...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="search-container">
        <div className="search-header">
          <h1>Search Results</h1>
          {searchQuery && (
            <p className="search-query">
              Found {searchResults.length} results for "{searchQuery}"
            </p>
          )}
        </div>

        {searchQuery && searchResults.length > 0 ? (
          <div className="search-results-grid">
            {searchResults.map(movie => (
              <div key={movie.id} className="search-movie-card">
                <Link to={`/movie/${movie.id}`} className="movie-link">
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
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h2>No results found</h2>
            <p>
              We couldn't find any movies matching "{searchQuery}".
              Try searching with different keywords or check your spelling.
            </p>
            <div className="search-suggestions">
              <h3>Search suggestions:</h3>
              <ul>
                <li>Try different movie titles</li>
                <li>Search by genre (Action, Drama, Comedy, etc.)</li>
                <li>Search by year (2024, 2023, etc.)</li>
                <li>Check for typos in your search</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="search-prompt">
            <div className="search-icon">🎬</div>
            <h2>Search for Movies</h2>
            <p>
              Use the search bar in the navigation to find movies by title, genre, or year.
              Discover your next favorite movie!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;

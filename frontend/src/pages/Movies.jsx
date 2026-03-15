import React, { useState } from "react";
import MoviesList from "../components/MoviesList";

function Movies() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("popularity");
  const [filterBy, setFilterBy] = useState("all");
  const [viewBy, setViewBy] = useState("grid");

  const genres = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Thriller", "Romance", "Sports", "Family", "Fantasy", "Adventure", "Biography"];
  const years = ["2024", "2023", "2022", "2021", "2020", "2019"];

  const handleGenreChange = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const moviesPerPage = 6;
  const totalPages = 15; // Simulated total pages

  return (
    <div className="movies-page">
      <div className="movies-container">
        {/* Sidebar Filters */}
        <aside className="sidebar">
          <div className="filter-section">
            <h3>Genre</h3>
            <div className="genre-filters">
              {genres.map(genre => (
                <label key={genre} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                  />
                  <span className="checkmark"></span>
                  {genre}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Year</h3>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="year-select"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h3>Rating</h3>
            <div className="rating-filter">
              <div className="range-slider">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={ratingRange[1]}
                  onChange={(e) => setRatingRange([ratingRange[0], parseInt(e.target.value)])}
                  className="slider"
                />
                <div className="range-labels">
                  <span>{ratingRange[0]}</span>
                  <span>{ratingRange[1]}</span>
                </div>
              </div>
              <button className="btn view-details-btn">View Details</button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="movies-main">
          {/* Sort/Filter Controls */}
          <div className="movies-controls">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="control-select"
            >
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="year">Year</option>
              <option value="title">Title</option>
            </select>
            
            <select 
              value={filterBy} 
              onChange={(e) => setFilterBy(e.target.value)}
              className="control-select"
            >
              <option value="all">All Movies</option>
              <option value="trending">Trending</option>
              <option value="new">New Releases</option>
              <option value="top-rated">Top Rated</option>
            </select>
            
            <select 
              value={viewBy} 
              onChange={(e) => setViewBy(e.target.value)}
              className="control-select"
            >
              <option value="grid">Grid View</option>
              <option value="list">List View</option>
            </select>
          </div>

          {/* Movies Grid - Using MoviesList Component */}
          <div className="movies-list-wrapper">
            <MoviesList />
          </div>

          {/* Pagination */}
          <div className="pagination">
            <div className="pagination-numbers">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button 
              className="btn next-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Movies;

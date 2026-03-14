
import React, { useState } from "react";

function Profile() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [movies, setMovies] = useState([
    { id: 1, title: "The Dark Knight", rating: 4.8, year: 2024, genre: "Action" },
    { id: 2, title: "Inception", rating: 4.7, year: 2023, genre: "Sci-Fi" },
    { id: 3, title: "The Shawshank Redemption", rating: 4.9, year: 2024, genre: "Drama" }
  ]);
  const [reviews, setReviews] = useState([
    { id: 1, movie: "The Dark Knight", author: "John D.", rating: 5, date: "2024-04-20", status: "approved" },
    { id: 2, movie: "Inception", author: "Sarah P.", rating: 4, date: "2024-04-18", status: "pending" },
    { id: 3, movie: "Edge of War", author: "Mike R.", rating: 5, date: "2024-04-15", status: "approved" }
  ]);

  const [newMovie, setNewMovie] = useState({
    title: "",
    genre: "",
    year: "",
    rating: "",
    description: ""
  });

  const [editingMovie, setEditingMovie] = useState(null);

  const handleAddMovie = () => {
    if (newMovie.title && newMovie.genre && newMovie.year) {
      const movieToAdd = {
        ...newMovie,
        id: movies.length + 1,
        rating: parseFloat(newMovie.rating) || 0
      };
      setMovies([...movies, movieToAdd]);
      setNewMovie({ title: "", genre: "", year: "", rating: "", description: "" });
      alert("Movie added successfully!");
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
  };

  const handleUpdateMovie = () => {
    if (editingMovie) {
      setMovies(movies.map(m => m.id === editingMovie.id ? editingMovie : m));
      setEditingMovie(null);
      alert("Movie updated successfully!");
    }
  };

  const handleDeleteMovie = (movieId) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      setMovies(movies.filter(m => m.id !== movieId));
      alert("Movie deleted successfully!");
    }
  };

  const handleApproveReview = (reviewId) => {
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, status: "approved" } : r
    ));
    alert("Review approved!");
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter(r => r.id !== reviewId));
      alert("Review deleted successfully!");
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

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Admin Dashboard</h1>
          <p>Manage movies, reviews, and system settings</p>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === "movies" ? "active" : ""}`}
            onClick={() => setActiveTab("movies")}
          >
            Movies
          </button>
          <button
            className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Movies</h3>
                <div className="stat-number">{movies.length}</div>
              </div>
              <div className="stat-card">
                <h3>Total Reviews</h3>
                <div className="stat-number">{reviews.length}</div>
              </div>
              <div className="stat-card">
                <h3>Pending Reviews</h3>
                <div className="stat-number">
                  {reviews.filter(r => r.status === "pending").length}
                </div>
              </div>
              <div className="stat-card">
                <h3>Average Rating</h3>
                <div className="stat-number">
                  {(movies.reduce((sum, m) => sum + m.rating, 0) / movies.length).toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Movies Tab */}
        {activeTab === "movies" && (
          <div className="movies-content">
            <div className="content-header">
              <h2>Manage Movies</h2>
              <div className="add-movie-form">
                <h3>Add New Movie</h3>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Movie Title"
                    value={newMovie.title}
                    onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Genre"
                    value={newMovie.genre}
                    onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
                    className="form-input"
                  />
                  <input
                    type="number"
                    placeholder="Year"
                    value={newMovie.year}
                    onChange={(e) => setNewMovie({...newMovie, year: e.target.value})}
                    className="form-input"
                  />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Rating"
                    value={newMovie.rating}
                    onChange={(e) => setNewMovie({...newMovie, rating: e.target.value})}
                    className="form-input"
                  />
                  <button onClick={handleAddMovie} className="btn add-btn">
                    Add Movie
                  </button>
                </div>
              </div>
            </div>

            <div className="movies-list">
              <h3>Existing Movies</h3>
              <div className="admin-movies-grid">
                {movies.map(movie => (
                  <div key={movie.id} className="admin-movie-card">
                    {editingMovie?.id === movie.id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editingMovie.title}
                          onChange={(e) => setEditingMovie({...editingMovie, title: e.target.value})}
                          className="form-input"
                        />
                        <input
                          type="text"
                          value={editingMovie.genre}
                          onChange={(e) => setEditingMovie({...editingMovie, genre: e.target.value})}
                          className="form-input"
                        />
                        <div className="edit-actions">
                          <button onClick={handleUpdateMovie} className="btn save-btn">
                            Save
                          </button>
                          <button onClick={() => setEditingMovie(null)} className="btn cancel-btn">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4>{movie.title}</h4>
                        <p>{movie.genre} • {movie.year}</p>
                        {renderStars(movie.rating)}
                        <div className="movie-actions">
                          <button onClick={() => handleEditMovie(movie)} className="btn edit-btn">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteMovie(movie.id)} className="btn delete-btn">
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="reviews-content">
            <div className="content-header">
              <h2>Manage Reviews</h2>
            </div>
            
            <div className="admin-reviews-list">
              {reviews.map(review => (
                <div key={review.id} className={`admin-review-card ${review.status}`}>
                  <div className="review-header">
                    <div className="review-info">
                      <h4>{review.movie}</h4>
                      <p>by {review.author} • {review.date}</p>
                    </div>
                    <div className="review-status">
                      <span className={`status-badge ${review.status}`}>
                        {review.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="review-rating">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  
                  <div className="review-actions">
                    {review.status === "pending" && (
                      <button 
                        onClick={() => handleApproveReview(review.id)} 
                        className="btn approve-btn"
                      >
                        Approve
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteReview(review.id)} 
                      className="btn delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

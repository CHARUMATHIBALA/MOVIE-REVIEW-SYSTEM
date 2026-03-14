
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function WriteReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [movieTitle, setMovieTitle] = useState("EDGE OF WAR");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  // Get movie title from location state or use default
  React.useEffect(() => {
    if (location.state?.movieTitle) {
      setMovieTitle(location.state.movieTitle);
    }
  }, [location.state]);

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue) => {
    setHoveredStar(starValue);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    
    if (reviewText.trim().length < 10) {
      alert("Please write at least 10 characters for your review");
      return;
    }

    // Here you would typically send the review to your backend
    console.log("Review submitted:", {
      movieTitle,
      rating,
      reviewText,
      date: new Date().toISOString()
    });

    alert("Review submitted successfully!");
    navigate(`/movie/${movieTitle.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? Your review will not be saved.")) {
      navigate(-1);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`star-btn ${i <= (hoveredStar || rating) ? 'active' : ''}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="write-review-page">
      <div className="review-container">
        <div className="review-header">
          <h1>Write a Review</h1>
          <p className="review-subtitle">Share your thoughts about this movie</p>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {/* Movie Title */}
          <div className="form-group">
            <label htmlFor="movieTitle" className="form-label">
              Movie Title
            </label>
            <input
              type="text"
              id="movieTitle"
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              className="form-input"
              placeholder="Enter movie title"
              required
            />
          </div>

          {/* Rating Input */}
          <div className="form-group">
            <label className="form-label">
              Rating
            </label>
            <div className="star-rating">
              {renderStars()}
              <span className="rating-text">
                {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Click to rate'}
              </span>
            </div>
          </div>

          {/* Review Text Area */}
          <div className="form-group">
            <label htmlFor="reviewText" className="form-label">
              Your Review
            </label>
            <textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="form-textarea"
              placeholder="Write your detailed review here... What did you think about the plot, acting, cinematography, and overall experience?"
              rows="8"
              required
              minLength="10"
              maxLength="1000"
            />
            <div className="character-count">
              {reviewText.length}/1000 characters
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn submit-btn"
              disabled={rating === 0 || reviewText.trim().length < 10}
            >
              Submit Review
            </button>
            <button
              type="button"
              className="btn cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Review Guidelines */}
        <div className="review-guidelines">
          <h3>Review Guidelines</h3>
          <ul>
            <li>Be specific and detailed in your review</li>
            <li>Focus on the movie's content, not personal opinions about others</li>
            <li>Keep your review respectful and constructive</li>
            <li>Avoid spoilers or mark them clearly</li>
            <li>Minimum 10 characters, maximum 1000 characters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WriteReview;

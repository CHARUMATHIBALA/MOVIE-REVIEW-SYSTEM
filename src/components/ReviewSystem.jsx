import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ReviewSystem() {
  const { movieId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    author: ""
  });
  const [editingReview, setEditingReview] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Mock user data - in real app, this would come from auth context
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsLoggedIn(true);
    }
  }, []);

  // Load reviews for this movie
  useEffect(() => {
    // In real app, this would be an API call
    const movieReviews = JSON.parse(localStorage.getItem(`movie_${movieId}_reviews`) || '[]');
    setReviews(movieReviews);
  }, [movieId]);

  const handleCreateReview = (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert('Please login to write a review');
      return;
    }

    if (newReview.rating === 0 || newReview.comment.trim() === "") {
      alert('Please provide both rating and comment');
      return;
    }

    const review = {
      id: Date.now(),
      author: currentUser.name || currentUser.email,
      rating: newReview.rating,
      comment: newReview.comment.trim(),
      date: new Date().toISOString(),
      movieId: parseInt(movieId)
    };

    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`movie_${movieId}_reviews`, JSON.stringify(updatedReviews));
    
    // Reset form
    setNewReview({ rating: 0, comment: "", author: "" });
    alert('Review added successfully!');
  };

  const handleUpdateReview = (reviewId, updatedData) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { ...review, ...updatedData, date: new Date().toISOString() }
        : review
    );
    
    setReviews(updatedReviews);
    localStorage.setItem(`movie_${movieId}_reviews`, JSON.stringify(updatedReviews));
    setEditingReview(null);
    alert('Review updated successfully!');
  };

  const handleDeleteReview = (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    setReviews(updatedReviews);
    localStorage.setItem(`movie_${movieId}_reviews`, JSON.stringify(updatedReviews));
    alert('Review deleted successfully!');
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : 'empty'} ${interactive ? 'interactive' : ''}`}
            onClick={() => interactive && onChange(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="review-system">
      {/* Create Review Section */}
      <div className="create-review-section">
        <h3>Write a Review</h3>
        
        {!isLoggedIn ? (
          <div className="login-prompt">
            <p>Please <a href="/login">login</a> to write a review</p>
          </div>
        ) : (
          <form onSubmit={handleCreateReview} className="review-form">
            <div className="rating-input">
              <label>Rating:</label>
              {renderStars(newReview.rating, true, (rating) => 
                setNewReview(prev => ({ ...prev, rating }))
              )}
            </div>
            
            <div className="comment-input">
              <label>Review:</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your thoughts about this movie..."
                rows="4"
                required
              />
            </div>
            
            <button type="submit" className="btn submit-review-btn">
              Submit Review
            </button>
          </form>
        )}
      </div>

      {/* Reviews List Section */}
      <div className="reviews-list-section">
        <h3>Reviews ({reviews.length})</h3>
        
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this movie!</p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-author-info">
                    <div className="review-avatar">
                      {review.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="review-author">{review.author}</div>
                      <div className="review-date">{formatDate(review.date)}</div>
                    </div>
                  </div>
                  
                  {/* Edit/Delete buttons for own reviews */}
                  {isLoggedIn && currentUser && 
                   (review.author === currentUser.name || review.author === currentUser.email) && (
                    <div className="review-actions">
                      <button
                        onClick={() => setEditingReview(review)}
                        className="btn edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="btn delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
                
                {editingReview && editingReview.id === review.id ? (
                  <div className="edit-review-form">
                    <div className="rating-input">
                      <label>Rating:</label>
                      {renderStars(editingReview.rating, true, (rating) => 
                        setEditingReview(prev => ({ ...prev, rating }))
                      )}
                    </div>
                    
                    <textarea
                      value={editingReview.comment}
                      onChange={(e) => setEditingReview(prev => ({ ...prev, comment: e.target.value }))}
                      rows="3"
                    />
                    
                    <div className="edit-actions">
                      <button
                        onClick={() => handleUpdateReview(review.id, {
                          rating: editingReview.rating,
                          comment: editingReview.comment
                        })}
                        className="btn save-btn"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingReview(null)}
                        className="btn cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="review-comment">
                    {review.comment}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewSystem;

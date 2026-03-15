import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { reviewsAPI, authAPI } from "../services/api";

function ReviewSystem() {
  const { id: movieId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    comment: ""
  });
  const [editingReview, setEditingReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in
  const isLoggedIn = authAPI.isAuthenticated();
  const currentUser = authAPI.getCurrentUserSync();
  
  // Validate movieId
  if (!movieId || movieId === 'undefined') {
    return (
      <div className="review-system">
        <div className="error-message">
          <p>Invalid movie ID. Please navigate to a valid movie page.</p>
        </div>
      </div>
    );
  }

  // Notification system
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
      color: white;
      padding: 15px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      font-weight: 600;
      animation: slideIn 0.3s ease;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }
    }, 3000);
  };

  // Shake element for validation errors
  const shakeElement = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.animation = 'shake 0.5s ease';
      element.style.borderColor = '#ef4444';
      setTimeout(() => {
        element.style.animation = '';
        element.style.borderColor = '';
      }, 500);
    }
  };

  // Lightning effect on successful review
  const createLightningEffect = () => {
    const lightning = document.createElement('div');
    lightning.className = 'lightning-effect';
    lightning.innerHTML = '⚡';
    lightning.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 60px;
      z-index: 9999;
      animation: lightningStrike 0.6s ease;
      pointer-events: none;
    `;
    
    document.body.appendChild(lightning);
    
    setTimeout(() => {
      if (lightning.parentNode) {
        document.body.removeChild(lightning);
      }
    }, 600);
  };

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    
    @keyframes lightningStrike {
      0% { 
        opacity: 0;
        transform: translate(-50%, -50%) scale(0) rotate(0deg);
      }
      50% { 
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.5) rotate(15deg);
        filter: brightness(2) drop-shadow(0 0 20px rgba(255, 255, 0, 0.8));
      }
      100% { 
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5) rotate(-15deg);
        filter: brightness(0) drop-shadow(0 0 40px rgba(255, 255, 0, 0.6));
      }
    }
  `;
  document.head.appendChild(style);

  // Load reviews for this movie
  useEffect(() => {
    loadReviews();
  }, [movieId]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const response = await reviewsAPI.getByMovie(movieId);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      showNotification('Please login to write a review', 'error');
      return;
    }

    // Enhanced validation
    if (newReview.rating === 0) {
      showNotification('Please select a star rating', 'error');
      shakeElement('.star-rating');
      return;
    }

    if (newReview.title.trim() === "") {
      showNotification('Please provide a review title', 'error');
      shakeElement('.title-input input');
      return;
    }

    if (newReview.comment.trim() === "") {
      showNotification('Please write your review comments', 'error');
      shakeElement('.comment-input textarea');
      return;
    }

    if (newReview.comment.trim().length < 10) {
      showNotification('Review must be at least 10 characters long', 'error');
      shakeElement('.comment-input textarea');
      return;
    }

    try {
      setIsLoading(true);
      const response = await reviewsAPI.createOrUpdate({
        movie: movieId,
        title: newReview.title.trim(),
        rating: newReview.rating,
        comment: newReview.comment.trim()
      });
      
      // Refresh reviews
      await loadReviews();
      
      // Reset form
      setNewReview({ rating: 0, title: "", comment: "" });
      showNotification('Review added successfully! 🎉', 'success');
      createLightningEffect();
    } catch (error) {
      console.error('Error creating review:', error);
      showNotification(error.message || 'Failed to add review', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateReview = async (reviewId, updatedData) => {
    try {
      setIsLoading(true);
      const response = await reviewsAPI.update(reviewId, {
        title: updatedData.title,
        rating: updatedData.rating,
        comment: updatedData.comment
      });
      
      // Refresh reviews
      await loadReviews();
      
      setEditingReview(null);
      alert('Review updated successfully!');
    } catch (error) {
      console.error('Error updating review:', error);
      alert(error.message || 'Failed to update review');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      setIsLoading(true);
      await reviewsAPI.delete(reviewId);
      
      // Refresh reviews
      await loadReviews();
      
      alert('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert(error.message || 'Failed to delete review');
    } finally {
      setIsLoading(false);
    }
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

  // Check if user can edit/delete a review
  const canEditReview = (review) => {
    if (!isLoggedIn || !currentUser) return false;
    return review.user._id === currentUser.id || currentUser.role === 'admin';
  };

  if (isLoading && reviews.length === 0) {
    return (
      <div className="review-system">
        <div className="loading">Loading reviews...</div>
      </div>
    );
  }

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
            
            <div className="title-input">
              <label>Review Title:</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Give your review a title..."
                required
              />
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
            
            <button type="submit" className="btn submit-review-btn" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List Section */}
      <div className="reviews-list-section">
        <h3>Reviews ({reviews.length})</h3>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        {reviews.length === 0 && !error ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this movie!</p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <div className="review-author-info">
                    <div className="review-avatar">
                      {review.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="review-author">{review.user.name}</div>
                      <div className="review-date">{formatDate(review.createdAt)}</div>
                    </div>
                  </div>
                  
                  {/* Edit/Delete buttons for own reviews */}
                  {canEditReview(review) && (
                    <div className="review-actions">
                      <button
                        onClick={() => setEditingReview(review)}
                        className="btn edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
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
                
                <div className="review-title">
                  {review.title || 'Review'}
                </div>
                
                {editingReview && editingReview._id === review._id ? (
                  <div className="edit-review-form">
                    <div className="rating-input">
                      <label>Rating:</label>
                      {renderStars(editingReview.rating, true, (rating) => 
                        setEditingReview(prev => ({ ...prev, rating }))
                      )}
                    </div>
                    
                    <div className="title-input">
                      <label>Review Title:</label>
                      <input
                        type="text"
                        value={editingReview.title}
                        onChange={(e) => setEditingReview(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Review title..."
                      />
                    </div>
                    
                    <textarea
                      value={editingReview.comment}
                      onChange={(e) => setEditingReview(prev => ({ ...prev, comment: e.target.value }))}
                      rows="3"
                    />
                    
                    <div className="edit-actions">
                      <button
                        onClick={() => handleUpdateReview(review._id, {
                          rating: editingReview.rating,
                          title: editingReview.title,
                          comment: editingReview.comment
                        })}
                        className="btn save-btn"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : 'Save'}
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

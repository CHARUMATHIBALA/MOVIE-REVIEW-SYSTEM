
import React, { useState, useEffect } from "react";
import { authAPI, reviewsAPI } from "../services/api";

function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [currentUser, setCurrentUser] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: ""
  });

  // Load user data and reviews
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const user = authAPI.getCurrentUserSync();
      if (!user) {
        setError('Please login to view your profile');
        setLoading(false);
        return;
      }
      
      setCurrentUser(user);
      setEditForm({
        name: user.name,
        email: user.email
      });

      // Load user reviews
      try {
        const reviewsResponse = await reviewsAPI.getUserReviews();
        setUserReviews(reviewsResponse.data.reviews);
      } catch (reviewError) {
        console.log('No reviews found or error loading reviews');
        setUserReviews([]);
      }
      
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await authAPI.updateProfile(editForm);
      
      // Update local storage
      const updatedUser = response.data.user;
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    window.location.href = '/login';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {"★".repeat(Math.floor(rating))}
        {"☆".repeat(5 - Math.floor(rating))}
        <span className="rating-number">{rating}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="profile-page">
        <div className="error-message">Please login to view your profile</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="avatar-info">
              <h1>{currentUser.name}</h1>
              <span className={`role-badge ${currentUser.role}`}>
                {currentUser.role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>
          </div>
          <div className="profile-actions">
            <button onClick={() => setIsEditing(!isEditing)} className="btn edit-profile-btn">
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button onClick={handleLogout} className="btn logout-btn">
              Logout
            </button>
          </div>
        </div>

        {/* Profile Edit Form */}
        {isEditing && (
          <div className="profile-edit-section">
            <h2>Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} className="edit-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn save-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Info
          </button>
          <button
            className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            My Reviews ({userReviews.length})
          </button>
          {currentUser.role === 'admin' && (
            <button
              className={`tab-btn ${activeTab === "admin" ? "active" : ""}`}
              onClick={() => setActiveTab("admin")}
            >
              Admin Panel
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "profile" && (
            <div className="profile-info-section">
              <h2>Profile Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name:</label>
                  <span>{currentUser.name}</span>
                </div>
                <div className="info-item">
                  <label>Email Address:</label>
                  <span>{currentUser.email}</span>
                </div>
                <div className="info-item">
                  <label>Account Type:</label>
                  <span className={`role-badge ${currentUser.role}`}>
                    {currentUser.role === 'admin' ? 'Administrator' : 'Regular User'}
                  </span>
                </div>
                <div className="info-item">
                  <label>Member Since:</label>
                  <span>{formatDate(currentUser.createdAt || currentUser.loginTime)}</span>
                </div>
                <div className="info-item">
                  <label>Total Reviews:</label>
                  <span>{userReviews.length}</span>
                </div>
                <div className="info-item">
                  <label>Average Rating:</label>
                  <span>
                    {userReviews.length > 0 
                      ? (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1)
                      : 'No reviews yet'
                    }
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="reviews-section">
              <h2>My Reviews</h2>
              {userReviews.length === 0 ? (
                <div className="no-reviews">
                  <p>You haven't written any reviews yet.</p>
                  <a href="/movies" className="btn">Browse Movies</a>
                </div>
              ) : (
                <div className="reviews-list">
                  {userReviews.map(review => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <div className="movie-info">
                          <h3>{review.movie.title}</h3>
                          <span className="movie-year">{review.movie.year}</span>
                        </div>
                        <div className="review-date">
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                      <div className="review-comment">
                        {review.comment}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "admin" && currentUser.role === 'admin' && (
            <div className="admin-section">
              <h2>Admin Panel</h2>
              <div className="admin-stats">
                <div className="stat-card">
                  <h3>Total Movies</h3>
                  <p>30</p>
                </div>
                <div className="stat-card">
                  <h3>Total Reviews</h3>
                  <p>{userReviews.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Active Users</h3>
                  <p>1</p>
                </div>
              </div>
              <div className="admin-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="btn">Add New Movie</button>
                  <button className="btn">Manage Users</button>
                  <button className="btn">View Reports</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

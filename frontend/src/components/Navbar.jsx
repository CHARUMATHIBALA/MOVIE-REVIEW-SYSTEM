
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { reviewsAPI, utils } from '../services/api';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-section')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Fetch user reviews when profile menu is opened
    if (showProfileMenu && user) {
      fetchUserReviews();
    }
  }, [showProfileMenu, user]);

  const fetchUserReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await reviewsAPI.getUserReviews({ limit: 5 }); // Get latest 5 reviews
      setUserReviews(response.data?.reviews || []);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      setUserReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setUser(null);
    setUserReviews([]);
    navigate('/login');
  };

  const getUserInitial = () => {
    if (!user || !user.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  const getReviewTitle = (review) => {
    // Use movie title as review title, or create a default title
    return review.movie ? review.movie.title : 'Review';
  };

  return (
    <nav>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2>MovieReview</h2>
      </Link>
      
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/movies">Movies</Link>
        <Link to="/top-rated">Top Rated</Link>
        
        {user ? (
          <div className="profile-section">
            <div 
              className="profile-avatar"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <span className="profile-initial">{getUserInitial()}</span>
            </div>
            
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-info">
                    <p className="profile-name">{user.name}</p>
                    <p className="profile-email">{user.email}</p>
                    <span className={`profile-role ${user.role}`}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </div>
                </div>
                
                <div className="profile-reviews">
                  <h3 className="reviews-title">My Reviews</h3>
                  
                  {loadingReviews ? (
                    <div className="loading-reviews">Loading reviews...</div>
                  ) : userReviews.length > 0 ? (
                    <div className="reviews-list">
                      {userReviews
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((review) => (
                          <div key={review._id} className="review-item">
                            <div className="review-content">
                              <h4 className="review-title">{getReviewTitle(review)}</h4>
                              <p className="review-description">{review.comment}</p>
                              <div className="review-meta">
                                <span className="review-date">{utils.formatDate(review.createdAt)}</span>
                                <div className="review-rating">
                                  {utils.renderStars(review.rating).display}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="no-reviews">
                      <p>No reviews yet</p>
                    </div>
                  )}
                </div>
                
                <div className="profile-actions">
                  <Link to="/profile" className="profile-link">View Full Profile</Link>
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
    </nav>
  );
}

export default Navbar;


import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";

function Reviews() {
  const location = useLocation();
  const [sortBy, setSortBy] = useState("latest");
  const [likedReviews, setLikedReviews] = useState(new Set());

  // Mock reviews data
  const allReviews = [
    {
      id: 1,
      reviewerName: "John D.",
      rating: 5,
      reviewText: "Absolutely mind-blowing! The cinematography was stunning and the storyline kept me hooked from start to finish. This is definitely a must-watch movie that exceeds all expectations.",
      date: "2024-04-20",
      helpful: 105,
      totalHelpful: 118
    },
    {
      id: 2,
      reviewerName: "Sarah P.",
      rating: 4,
      reviewText: "Great movie with excellent performances. The pacing was perfect and the character development was well done. Only minor issue was some predictable plot points, but overall very enjoyable.",
      date: "2024-04-18",
      helpful: 87,
      totalHelpful: 95
    },
    {
      id: 3,
      reviewerName: "Mark R.",
      rating: 5,
      reviewText: "An instant classic! The director has outdone themselves with this masterpiece. Every scene was carefully crafted and the acting was phenomenal. Highly recommend!",
      date: "2024-04-15",
      helpful: 92,
      totalHelpful: 104
    },
    {
      id: 4,
      reviewerName: "Emily K.",
      rating: 3,
      reviewText: "Decent movie but not as good as the hype suggests. The first half was engaging but it lost momentum in the second half. Still worth watching for the visuals alone.",
      date: "2024-04-12",
      helpful: 45,
      totalHelpful: 67
    },
    {
      id: 5,
      reviewerName: "David L.",
      rating: 4,
      reviewText: "Solid entertainment with great action sequences. The soundtrack was particularly impressive and really enhanced the viewing experience. Would watch again!",
      date: "2024-04-10",
      helpful: 78,
      totalHelpful: 89
    },
    {
      id: 6,
      reviewerName: "Lisa M.",
      rating: 2,
      reviewText: "Unfortunately, this movie didn't live up to my expectations. The plot was confusing and the character motivations were unclear. Disappointing overall.",
      date: "2024-04-08",
      helpful: 23,
      totalHelpful: 45
    }
  ];

  // Sort reviews based on selected criteria
  const sortedReviews = useMemo(() => {
    const sorted = [...allReviews];
    switch (sortBy) {
      case "latest":
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "highest":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  }, [sortBy]);

  const handleLike = (reviewId) => {
    setLikedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="review-stars">
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="reviews-page">
      <div className="reviews-container">
        <div className="reviews-header">
          <h1>All Reviews</h1>
          <div className="sort-controls">
            <label htmlFor="sort-select" className="sort-label">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="latest">Latest</option>
              <option value="highest">Highest rating</option>
              <option value="lowest">Lowest rating</option>
            </select>
          </div>
        </div>

        <div className="reviews-list">
          {sortedReviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-name">{review.reviewerName}</div>
                  <div className="review-date">{formatDate(review.date)}</div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              <div className="review-content">
                <p>{review.reviewText}</p>
              </div>
              
              <div className="review-actions">
                <button
                  className={`helpful-btn ${likedReviews.has(review.id) ? 'liked' : ''}`}
                  onClick={() => handleLike(review.id)}
                >
                  👍 Helpful ({review.helpful + (likedReviews.has(review.id) ? 1 : 0)})
                </button>
                <div className="total-helpful">
                  {review.totalHelpful + (likedReviews.has(review.id) ? 1 : 0)} people found this helpful
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedReviews.length === 0 && (
          <div className="no-reviews">
            <p>No reviews found. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reviews;

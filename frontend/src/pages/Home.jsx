import React from "react";
import moviesData from "../data/movies.json";

function Home() {
  // Get top 6 highest rated Tamil movies for trending section
  const trendingMovies = moviesData
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  // Get latest 3 Tamil movies reviews
  const latestReviews = moviesData
    .slice(0, 3)
    .flatMap((movie, movieIndex) => {
      if (movie.reviews && Array.isArray(movie.reviews)) {
        return movie.reviews.map((review, reviewIndex) => ({
          ...review,
          movieTitle: movie.title,
          key: `${movie.id}-${reviewIndex}-${review.id || reviewIndex}`
        }));
      }
      return [];
    })
    .slice(0, 3);

  const categories = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Thriller", "Romance", "Sports", "Family", "Fantasy", "Adventure", "Biography"];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1>Leo</h1>
        <p>Experience the ultimate action thriller of 2023</p>
        <button className="btn">Watch Trailer</button>
      </section>

      {/* Trending Movies Section */}
      <section className="section">
        <h2 className="section-title">Trending Tamil Movies</h2>
        <div className="movie-scroll">
          {trendingMovies.map(movie => (
            <div key={movie.id} className="movie-card">
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
                <div className="movie-title">{movie.title}</div>
                <div className="movie-meta">
                  <span className="movie-year">{movie.year}</span>
                  <span className="movie-genre">{movie.genre}</span>
                </div>
                <div className="movie-rating">
                  {"★".repeat(Math.floor(movie.rating))}
                  {"☆".repeat(5 - Math.floor(movie.rating))}
                  <span className="movie-rating-number">{movie.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Reviews Section */}
      <section className="section">
        <h2 className="section-title">Latest Reviews</h2>
        <div className="movie-scroll">
          {latestReviews.map(review => (
            <div key={review.key} className="review-card">
              <div className="review-header">
                <div className="review-avatar">
                  {review.author?.charAt(0) ?? ''}
                </div>
                <div>
                  <div className="review-author">{review.author}</div>
                  <div className="review-rating">
                    {"★".repeat(Math.floor(review.rating))}
                    {"☆".repeat(5 - Math.floor(review.rating))}
                  </div>
                </div>
              </div>
              <div className="review-text">
                {review.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by Category Section */}
      <section className="section">
        <h2 className="section-title">Browse by Category</h2>
        <div className="category-buttons">
          {categories.map(category => (
            <a key={category} href={`/movies?category=${category.toLowerCase()}`} className="category-btn">
              {category}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;

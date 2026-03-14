
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import moviesData from "../data/movies.json";
import ReviewSystem from "../components/ReviewSystem";

function MovieDetails() {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:06");
  const [duration, setDuration] = useState("5:49");
  const [volume, setVolume] = useState(75);

  // Find the movie from Tamil movies data
  const movie = moviesData.find(m => m.id === parseInt(id));

  // If movie not found, show error
  if (!movie) {
    return (
      <div className="movie-details-page">
        <div className="container">
          <h1>Movie Not Found</h1>
          <p>The movie you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const cast = [
    { name: "Vijay", character: "Leo Das", image: "https://picsum.photos/seed/vijay/150/150.jpg" },
    { name: "Trisha", character: "Sathya", image: "https://picsum.photos/seed/trisha/150/150.jpg" },
    { name: "Sanjay Dutt", character: "Antony Das", image: "https://picsum.photos/seed/sanjay/150/150.jpg" },
    { name: "Arjun", character: "Haridas Das", image: "https://picsum.photos/seed/arjun/150/150.jpg" },
    { name: "Gautham Vasudev Menon", character: "Police Officer", image: "https://picsum.photos/seed/gautham/150/150.jpg" }
  ];

  const reviews = [
    {
      id: 1,
      author: "John",
      rating: 5,
      date: "April 20, 2024",
      text: "Super intense and gripping! The action scenes are top-notch and the suspense kept me on the edge of my seat!",
      likes: 105,
      dislikes: 10,
      comments: 8
    },
    {
      id: 2,
      author: "Mike",
      rating: 5,
      date: "April 18, 2024",
      text: "Great movie! The cast did an amazing job and the story-line was captivating. Highly recommend!",
      likes: 103,
      dislikes: 8,
      comments: 12
    },
    {
      id: 3,
      author: "John",
      rating: 5,
      date: "April 19, 2024",
      text: "An adrenaline packed thrill ride from start to finish. Loved the performances and plot twists!",
      likes: 118,
      dislikes: 11,
      comments: 21
    }
  ];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return (
      <div className="movie-rating">
        {"★".repeat(fullStars)}
        {halfStar ? "☆" : ""}
        {"☆".repeat(emptyStars)}
        <span className="rating-number">{rating}</span>
      </div>
    );
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="movie-details-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <img src={movie.poster} alt={movie.title} />
        </div>
        <div className="hero-content">
          <div className="movie-info">
            <h1 className="movie-title">{movie.title}</h1>
            <div className="movie-meta">
              <span className="movie-year">{movie.year}</span>
              <span className="movie-genre">{movie.genre}</span>
              <span className="movie-rating">
                {"★".repeat(Math.floor(movie.rating))}
                <span className="rating-number">{movie.rating}</span>
              </span>
            </div>
            <p className="movie-summary">{movie.description}</p>
            <div className="movie-actions">
              <button className="btn primary-btn">Watch Trailer</button>
              <button className="btn secondary-btn">Add to Watchlist</button>
            </div>
            <div className="video-controls">
              <button className="control-btn" onClick={handlePlayPause}>
                {isPlaying ? "⏸" : "▶"}
              </button>
              <div className="time-display">
                <span>{currentTime}</span>
                <span> / </span>
                <span>{duration}</span>
              </div>
              <div className="volume-control">
                <span>🔊</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="volume-slider"
                />
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="summary-section">
        <h2 className="section-title">Summary</h2>
        <p className="summary-text">{movie.summary}</p>
      </section>

      {/* Cast Section */}
      <section className="cast-section">
        <h2 className="section-title">Cast</h2>
        <div className="cast-grid">
          {cast.map((member, index) => (
            <div key={index} className="cast-card">
              <div className="cast-image">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="cast-info">
                <div className="cast-name">{member.name}</div>
                <div className="cast-character">{member.character}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewSystem />
    </div>
  );
}

export default MovieDetails;

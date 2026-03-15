const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be at least 1900'],
    max: [2030, 'Year cannot exceed 2030']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true,
    enum: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Thriller', 'Romance', 'Sports', 'Family', 'Fantasy', 'Adventure', 'Biography']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  poster: {
    type: String,
    required: [true, 'Poster URL is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  duration: {
    type: String,
    trim: true,
    default: ''
  },
  director: {
    type: String,
    trim: true,
    default: ''
  },
  cast: [{
    name: String,
    character: String,
    image: String
  }],
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      required: false,
      trim: true,
      maxlength: [100, 'Review title cannot exceed 100 characters']
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Review cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate average rating when reviews are modified
movieSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.reviewCount = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.reviewCount = this.reviews.length;
  }
  return this.save();
};

// Add review to movie
movieSchema.methods.addReview = function(userId, rating, comment, title = null) {
  // Check if user already reviewed
  const existingReview = this.reviews.find(review => 
    review.user.toString() === userId.toString()
  );
  
  if (existingReview) {
    // Update existing review
    existingReview.rating = rating;
    existingReview.comment = comment;
    if (title !== null && title !== undefined) {
      existingReview.title = title;
    }
    existingReview.updatedAt = new Date();
  } else {
    // Add new review
    const newReview = {
      user: userId,
      rating,
      comment,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (title !== null && title !== undefined) {
      newReview.title = title;
    }
    
    this.reviews.push(newReview);
  }
  
  return this.calculateAverageRating();
};

// Remove review from movie
movieSchema.methods.removeReview = function(userId) {
  this.reviews = this.reviews.filter(review => 
    review.user.toString() !== userId.toString()
  );
  return this.calculateAverageRating();
};

// Virtual for formatted average rating
movieSchema.virtual('formattedRating').get(function() {
  return this.averageRating.toFixed(1);
});

module.exports = mongoose.model('Movie', movieSchema);

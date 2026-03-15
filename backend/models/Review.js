const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  helpful: {
    type: Number,
    default: 0
  },
  notHelpful: {
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

// Ensure user can only review a movie once
reviewSchema.index({ user: 1, movie: 1 }, { unique: true });

// Virtual for formatted date
reviewSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Pre-save hook to update movie's average rating
reviewSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('rating')) {
    const Movie = mongoose.model('Movie');
    await Movie.findByIdAndUpdate(this.movie, {
      $push: { reviews: this._id }
    }).then(movie => {
      return movie.calculateAverageRating();
    }).catch(next);
  }
  next();
});

// Pre-remove hook to update movie's average rating
reviewSchema.pre('remove', async function(next) {
  const Movie = mongoose.model('Movie');
  await Movie.findByIdAndUpdate(this.movie, {
    $pull: { reviews: this._id }
  }).then(movie => {
    return movie.calculateAverageRating();
  }).catch(next);
  next();
});

module.exports = mongoose.model('Review', reviewSchema);

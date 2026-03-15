const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews/movie/:movieId
// @desc    Get all reviews for a movie
// @access  Public
router.get('/movie/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found'
      });
    }

    // Build sort
    const sort = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;

    // Get reviews
    const reviews = await Review.find({ movie: movieId, isActive: true })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email');

    // Get total count
    const total = await Review.countDocuments({ movie: movieId, isActive: true });

    res.status(200).json({
      status: 'success',
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total
        }
      }
    });
  } catch (error) {
    console.error('Get movie reviews error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/reviews/user
// @desc    Get current user's reviews
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ user: req.user.id, isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('movie', 'title poster year');

    const total = await Review.countDocuments({ user: req.user.id, isActive: true });

    res.status(200).json({
      status: 'success',
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total
        }
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/reviews
// @desc    Create or update a review
// @access  Private
router.post('/', [
  auth,
  body('movie')
    .notEmpty()
    .withMessage('Movie ID is required'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Comment is required')
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { movie, title, rating, comment } = req.body;
    const userId = req.user.id;

    // Check if movie exists
    const movieDoc = await Movie.findById(movie);
    if (!movieDoc) {
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found'
      });
    }

    // Check if user already reviewed this movie
    let review = await Review.findOne({ user: userId, movie });
    if (review) {
      // Update existing review
      review.title = title;
      review.rating = rating;
      review.comment = comment;
      review.updatedAt = new Date();
      await review.save();
    } else {
      // Create new review
      review = await Review.create({
        user: userId,
        movie,
        title,
        rating,
        comment
      });
    }

    // Update movie's average rating
    await movieDoc.addReview(userId, rating, comment, title);

    // Populate user data for response
    await review.populate('user', 'name email');

    res.status(201).json({
      status: 'success',
      message: review.isNew ? 'Review created successfully' : 'Review updated successfully',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Create/Update review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private (Owner only)
router.put('/:id', [
  auth,
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Comment cannot be empty')
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { title, rating, comment } = req.body;

    // Find review
    let review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id && !req.user.isAdmin()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this review'
      });
    }

    // Update review
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;

    review = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    // Update movie's average rating if rating changed
    if (rating !== undefined) {
      const movie = await Movie.findById(review.movie);
      await movie.addReview(review.user, review.rating, review.comment);
    }

    res.status(200).json({
      status: 'success',
      message: 'Review updated successfully',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private (Owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Find review
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id && !req.user.isAdmin()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this review'
      });
    }

    // Get movie before deleting review
    const movie = await Movie.findById(review.movie);

    // Delete review
    await Review.findByIdAndDelete(id);

    // Update movie's average rating
    if (movie) {
      await movie.removeReview(review.user);
    }

    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Public
router.post('/:id/helpful', async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpful: 1 } },
      { new: true }
    ).populate('user', 'name email');

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Review marked as helpful',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Helpful review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/reviews/:id/not-helpful
// @desc    Mark review as not helpful
// @access  Public
router.post('/:id/not-helpful', async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { notHelpful: 1 } },
      { new: true }
    ).populate('user', 'name email');

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Review marked as not helpful',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Not helpful review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router;

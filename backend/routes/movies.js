const express = require('express');
const { body, validationResult } = require('express-validator');
const Movie = require('../models/Movie');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/movies
// @desc    Get all movies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, genre, year, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Build filter
    const filter = { isActive: true };
    
    if (genre) {
      filter.genre = { $regex: genre, $options: 'i' };
    }
    
    if (year) {
      filter.year = parseInt(year);
    }

    // Build sort
    const sort = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;

    // Get movies
    const movies = await Movie.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('reviews.user', 'name email');

    // Get total count
    const total = await Movie.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        movies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalMovies: total,
          moviesPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/movies/:id
// @desc    Get single movie by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate('reviews.user', 'name email');

    if (!movie) {
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        movie
      }
    });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/movies
// @desc    Create new movie (Admin only)
// @access  Private (Admin)
router.post('/', [
  auth,
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Movie title is required'),
  body('year')
    .isInt({ min: 1900, max: 2030 })
    .withMessage('Year must be between 1900 and 2030'),
  body('genre')
    .trim()
    .notEmpty()
    .withMessage('Genre is required'),
  body('rating')
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('poster')
    .trim()
    .notEmpty()
    .withMessage('Poster URL is required')
], async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin()) {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const movie = await Movie.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Movie created successfully',
      data: {
        movie
      }
    });
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/movies/:id
// @desc    Update movie (Admin only)
// @access  Private (Admin)
router.put('/:id', [
  auth,
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Movie title cannot be empty'),
  body('year')
    .optional()
    .isInt({ min: 1900, max: 2030 })
    .withMessage('Year must be between 1900 and 2030'),
  body('genre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Genre cannot be empty'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty'),
  body('poster')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Poster URL cannot be empty')
], async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin()) {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Movie updated successfully',
      data: {
        movie
      }
    });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /api/movies/:id
// @desc    Delete movie (Admin only)
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin()) {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/movies/search/:query
// @desc    Search movies
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const searchRegex = new RegExp(query, 'i');
    const filter = {
      isActive: true,
      $or: [
        { title: searchRegex },
        { genre: searchRegex },
        { description: searchRegex }
      ]
    };

    const movies = await Movie.find(filter)
      .sort({ averageRating: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Movie.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        movies,
        searchQuery: query,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalResults: total
        }
      }
    });
  } catch (error) {
    console.error('Search movies error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/movies/top-rated
// @desc    Get top rated movies
// @access  Public
router.get('/top-rated/all', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const movies = await Movie.find({ isActive: true })
      .sort({ averageRating: -1, reviewCount: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: {
        movies
      }
    });
  } catch (error) {
    console.error('Get top rated movies error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router;

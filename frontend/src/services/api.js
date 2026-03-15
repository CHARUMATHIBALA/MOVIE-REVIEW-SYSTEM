// API service for connecting to the backend

const API_BASE_URL = 'http://localhost:5001/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token and user data
    if (data.data?.token) {
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.data.user));
    }
    
    return data;
  },

  // Get current user
  getCurrentUser: async () => {
    return apiCall('/auth/me');
  },

  // Update profile
  updateProfile: async (userData) => {
    return apiCall('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    return Promise.resolve({ status: 'success', message: 'Logged out' });
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get current user from localStorage
  getCurrentUserSync: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  // Check if current user is admin
  isAdmin: () => {
    const user = authAPI.getCurrentUserSync();
    return user?.role === 'admin';
  },
};

// Movies API
export const moviesAPI = {
  // Get all movies
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/movies${queryString ? `?${queryString}` : ''}`);
  },

  // Get single movie
  getById: async (id) => {
    return apiCall(`/movies/${id}`);
  },

  // Create movie (admin only)
  create: async (movieData) => {
    return apiCall('/movies', {
      method: 'POST',
      body: JSON.stringify(movieData),
    });
  },

  // Update movie (admin only)
  update: async (id, movieData) => {
    return apiCall(`/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(movieData),
    });
  },

  // Delete movie (admin only)
  delete: async (id) => {
    return apiCall(`/movies/${id}`, {
      method: 'DELETE',
    });
  },

  // Search movies
  search: async (query, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/movies/search/${query}${queryString ? `?${queryString}` : ''}`);
  },

  // Get top rated movies
  getTopRated: async (limit = 10) => {
    return apiCall(`/movies/top-rated?limit=${limit}`);
  },
};

// Reviews API
export const reviewsAPI = {
  // Get reviews for a movie
  getByMovie: async (movieId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/reviews/movie/${movieId}${queryString ? `?${queryString}` : ''}`);
  },

  // Get current user's reviews
  getUserReviews: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/reviews/user${queryString ? `?${queryString}` : ''}`);
  },

  // Create or update review
  createOrUpdate: async (reviewData) => {
    return apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // Update review
  update: async (id, reviewData) => {
    return apiCall(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  },

  // Delete review
  delete: async (id) => {
    return apiCall(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  // Mark review as helpful
  markHelpful: async (id) => {
    return apiCall(`/reviews/${id}/helpful`, {
      method: 'POST',
    });
  },

  // Mark review as not helpful
  markNotHelpful: async (id) => {
    return apiCall(`/reviews/${id}/not-helpful`, {
      method: 'POST',
    });
  },
};

// Utility functions
export const utils = {
  // Handle API errors
  handleError: (error) => {
    if (error.message.includes('401')) {
      // Unauthorized - clear auth and redirect to login
      authAPI.logout();
      window.location.href = '/login';
    }
    return error;
  },

  // Format date
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  // Generate star rating HTML
  renderStars: (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return {
      full: fullStars,
      half: halfStar,
      empty: emptyStars,
      display: '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars),
    };
  },
};

export default {
  authAPI,
  moviesAPI,
  reviewsAPI,
  utils,
};

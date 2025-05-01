import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'https://movie-ticket-booking-api.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout - tăng timeout vì API có thể phản hồi chậm
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // No response from server (network error)
    if (!error.response) {
      console.error('Network Error:', error.message);
      // Show a user-friendly message
      const errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      // You can dispatch to a global error state or show a toast notification here
      console.error(errorMessage);
      return Promise.reject({
        ...error,
        customMessage: errorMessage,
        isNetworkError: true
      });
    }

    // Handle specific HTTP status codes
    switch (error.response.status) {
      case 401: // Unauthorized
        // Clear user data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // In development mode, don't redirect to login page for easier testing
        if (process.env.NODE_ENV !== 'development') {
          // Redirect to login page if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login?session=expired';
          }
        } else {
          console.log('Development mode: Not redirecting to login page on 401 error');
        }
        break;

      case 403: // Forbidden
        console.error('Access Denied:', error.response.data);
        break;

      case 404: // Not Found
        console.error('Resource Not Found:', error.response.data);
        break;

      case 422: // Validation Error
        console.error('Validation Error:', error.response.data);
        break;

      case 500: // Server Error
        console.error('Server Error:', error.response.data);
        break;

      case 503: // Service Unavailable
        console.error('Service Unavailable:', error.response.data);
        break;

      default:
        console.error(`Error (${error.response.status}):`, error.response.data);
    }

    // Add custom properties to the error
    const enhancedError = {
      ...error,
      customMessage: error.response.data?.message || 'An error occurred. Please try again later.',
      statusCode: error.response.status,
      timestamp: new Date().toISOString()
    };

    // Log all errors
    console.error('API Error:', error.response?.data || error.message);

    return Promise.reject(enhancedError);
  }
);

// Default movie data in case API fails
const defaultMovieData = {
  _id: '1',
  title: 'Sample Movie',
  director: 'Director Name',
  releaseDate: '2025-05-16',
  duration: 120,
  rating: 'PG-13',
  genres: ['Drama'],
  synopsis: 'This is a sample movie synopsis.',
  cast: ['Actor 1', 'Actor 2'],
  poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop',
  trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
  status: 'Now Playing',
  featured: true,
  showTimes: [
    { time: '10:00', theater: 'Theater 1', date: '2025-05-15' }
  ]
};

// Helper function to extract data from API response
const extractDataFromResponse = (response, entityType) => {
  console.log(`${entityType}Service: Raw API response:`, response);

  if (!response.data) {
    console.warn(`${entityType}Service: No data in response`);
    return [];
  }

  console.log(`${entityType}Service: Response data type:`, typeof response.data);
  console.log(`${entityType}Service: Response data is array?`, Array.isArray(response.data));

  // If response.data is an array, return it
  if (Array.isArray(response.data)) {
    return response.data;
  }

  // If response.data is an object
  if (typeof response.data === 'object') {
    // Check if response.data has a property matching entityType (plural)
    const pluralKey = `${entityType.toLowerCase()}s`;
    if (response.data[pluralKey] && Array.isArray(response.data[pluralKey])) {
      return response.data[pluralKey];
    }

    // Check if response.data has a property matching entityType (singular)
    const singularKey = entityType.toLowerCase();
    if (response.data[singularKey] && Array.isArray(response.data[singularKey])) {
      return response.data[singularKey];
    }

    // Check if response.data has a data property
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    // Check if response.data has a results property
    if (response.data.results && Array.isArray(response.data.results)) {
      return response.data.results;
    }

    // Check if response.data has a items property
    if (response.data.items && Array.isArray(response.data.items)) {
      return response.data.items;
    }

    // Check if response.data has a success property and a data property
    if (response.data.success && response.data.data) {
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (typeof response.data.data === 'object') {
        // Check if data has a property matching entityType (plural)
        if (response.data.data[pluralKey] && Array.isArray(response.data.data[pluralKey])) {
          return response.data.data[pluralKey];
        }

        // If data is a single object with expected properties, return it as an array
        if (isEntityObject(response.data.data, entityType)) {
          return [response.data.data];
        }
      }
    }

    // Check all properties for arrays
    for (const key in response.data) {
      if (Array.isArray(response.data[key]) && response.data[key].length > 0) {
        // Check if this array contains objects of the expected type
        if (isEntityObject(response.data[key][0], entityType)) {
          return response.data[key];
        }
      }
    }

    // If response.data itself is an entity object, return it as an array
    if (isEntityObject(response.data, entityType)) {
      return [response.data];
    }
  }

  console.warn(`${entityType}Service: Could not find valid ${entityType} data in response`);
  return [];
};

// Helper function to check if an object is of the expected entity type
const isEntityObject = (obj, entityType) => {
  if (!obj || typeof obj !== 'object') return false;

  switch (entityType.toLowerCase()) {
    case 'movie':
      return obj.title !== undefined && (obj.director !== undefined || obj.genres !== undefined || obj.releaseDate !== undefined);
    case 'event':
      return obj.title !== undefined && (obj.date !== undefined || obj.startTime !== undefined || obj.location !== undefined);
    case 'news':
      return obj.title !== undefined && (obj.content !== undefined || obj.publishDate !== undefined);
    case 'review':
      return obj.rating !== undefined && (obj.comment !== undefined || obj.movieId !== undefined || obj.userId !== undefined);
    case 'booking':
      return obj.seats !== undefined || obj.showtime !== undefined || obj.totalAmount !== undefined;
    default:
      return false;
  }
};

// Movie API services
export const movieService = {
  // Get all movies
  getMovies: async (params = {}) => {
    try {
      console.log('MovieService: Fetching movies with params:', params);

      // Determine the appropriate endpoint based on params
      let endpoint = '/movies';
      if (params.status === 'Now Playing') {
        endpoint = '/movies/now-playing';
        delete params.status; // Remove status from params to avoid duplication
      } else if (params.status === 'Coming Soon' || params.status === 'Upcoming') {
        endpoint = '/movies/upcoming';
        delete params.status;
      } else if (params.featured) {
        endpoint = '/movies/featured';
        delete params.featured;
      }

      const response = await api.get(endpoint, { params });
      return extractDataFromResponse(response, 'Movie');
    } catch (error) {
      console.error('MovieService: Error fetching movies:', error);
      console.error('MovieService: Error details:', error.message, error.stack);
      return [];
    }
  },

  // Get movie by ID
  getMovieById: async (id) => {
    try {
      const response = await api.get(`/movies/${id}`);
      const data = extractDataFromResponse(response, 'Movie');
      return data.length > 0 ? data[0] : { ...defaultMovieData, _id: id };
    } catch (error) {
      console.error(`Error fetching movie with ID ${id}:`, error);
      return { ...defaultMovieData, _id: id };
    }
  },

  // Get now playing movies
  getNowPlayingMovies: async (limit) => {
    try {
      const params = limit ? { limit } : {};
      const response = await api.get('/movies/now-playing', { params });
      return extractDataFromResponse(response, 'Movie');
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      return [];
    }
  },

  // Get upcoming movies
  getUpcomingMovies: async (limit) => {
    try {
      const params = limit ? { limit } : {};
      const response = await api.get('/movies/upcoming', { params });
      return extractDataFromResponse(response, 'Movie');
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      return [];
    }
  },

  // Get movies by genre
  getMoviesByGenre: async (genre) => {
    try {
      const response = await api.get(`/movies/genre/${genre}`);
      return extractDataFromResponse(response, 'Movie');
    } catch (error) {
      console.error(`Error fetching movies with genre ${genre}:`, error);
      return [];
    }
  },

  // Get featured movies
  getFeaturedMovies: async () => {
    try {
      const response = await api.get('/movies/featured');
      return extractDataFromResponse(response, 'Movie');
    } catch (error) {
      console.error('Error fetching featured movies:', error);
      return [];
    }
  },

  // Get popular movies
  getPopularMovies: async (limit) => {
    try {
      const params = limit ? { limit } : {};
      const response = await api.get('/movies/popular', { params });
      return extractDataFromResponse(response, 'Movie');
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  },

  // Get top rated movies
  getTopRatedMovies: async (limit) => {
    try {
      const params = limit ? { limit } : {};
      const response = await api.get('/movies/top-rated', { params });
      return extractDataFromResponse(response, 'Movie');
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      return [];
    }
  },

  // Search movies
  searchMovies: async (query, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const response = await api.get('/movies/search', {
        params: { keyword: query, page, limit }
      });
      return extractDataFromResponse(response, 'Movie');
    } catch (error) {
      console.error(`Error searching movies with query ${query}:`, error);
      return [];
    }
  },

  // Get user reviews
  getUserReviews: async (userId) => {
    try {
      const response = await api.get(`/reviews/user/${userId}`);
      return extractDataFromResponse(response, 'Review');
    } catch (error) {
      console.error(`Error fetching reviews for user ${userId}:`, error);
      return [];
    }
  },

  // Get movie reviews
  getMovieReviews: async (movieId) => {
    try {
      const response = await api.get(`/movies/${movieId}/reviews`);
      return extractDataFromResponse(response, 'Review');
    } catch (error) {
      console.error(`Error fetching reviews for movie ${movieId}:`, error);
      return [];
    }
  },

  // Add a review
  addReview: async (movieId, reviewData) => {
    try {
      const response = await api.post(`/movies/${movieId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },
};

// Event API services
export const eventService = {
  // Get all events
  getEvents: async (params = {}) => {
    try {
      console.log('EventService: Calling API: GET /events');

      // Determine the appropriate endpoint based on params
      let endpoint = '/events';
      if (params.featured) {
        endpoint = '/events/featured';
        delete params.featured;
      } else if (params.upcoming) {
        endpoint = '/events/upcoming';
        delete params.upcoming;
      } else if (params.past) {
        endpoint = '/events/past';
        delete params.past;
      } else if (params.category) {
        endpoint = `/events/category/${params.category}`;
        delete params.category;
      }

      const response = await api.get(endpoint, { params });
      return extractDataFromResponse(response, 'Event');
    } catch (error) {
      console.error('EventService: Error fetching events:', error);
      console.error('EventService: Error details:', error.message, error.stack);
      return [];
    }
  },

  // Get event by ID
  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      const data = extractDataFromResponse(response, 'Event');
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error(`Error fetching event with ID ${id}:`, error);
      return null;
    }
  },

  // Get featured events
  getFeaturedEvents: async (limit) => {
    try {
      const params = limit ? { limit } : {};
      const response = await api.get('/events/featured', { params });
      return extractDataFromResponse(response, 'Event');
    } catch (error) {
      console.error('Error fetching featured events:', error);
      return [];
    }
  },

  // Get events by category
  getEventsByCategory: async (category, limit) => {
    try {
      const params = limit ? { limit } : {};
      const response = await api.get(`/events/category/${category}`, { params });
      return extractDataFromResponse(response, 'Event');
    } catch (error) {
      console.error(`Error fetching events with category ${category}:`, error);
      return [];
    }
  },

  // Get upcoming events
  getUpcomingEvents: async (limit) => {
    try {
      const params = limit ? { limit } : {};
      const response = await api.get('/events/upcoming', { params });
      return extractDataFromResponse(response, 'Event');
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  },

  // Get past events
  getPastEvents: async (limit) => {
    try {
      const params = limit ? { limit } : {};
      const response = await api.get('/events/past', { params });
      return extractDataFromResponse(response, 'Event');
    } catch (error) {
      console.error('Error fetching past events:', error);
      return [];
    }
  },

  // Search events
  searchEvents: async (query, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const response = await api.get('/events/search', {
        params: { keyword: query, page, limit }
      });
      return extractDataFromResponse(response, 'Event');
    } catch (error) {
      console.error(`Error searching events with query ${query}:`, error);
      return [];
    }
  },

  // Register for an event
  registerForEvent: async (eventId, userData) => {
    try {
      const response = await api.post(`/events/${eventId}/register`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error registering for event with ID ${eventId}:`, error);

      // Check for specific error conditions
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error('Event not found');
        } else if (error.response.status === 400 && error.response.data.message === 'Event is at full capacity') {
          throw new Error('Event is at full capacity');
        }
      }

      throw new Error('Failed to register for event. Please try again later.');
    }
  },
};

// News API services
export const newsService = {
  // Get all news articles
  getNews: async (params = {}) => {
    try {
      console.log('NewsService: Calling API: GET /news');

      // Determine the appropriate endpoint based on params
      let endpoint = '/news';
      if (params.featured) {
        endpoint = '/news/featured';
        delete params.featured;
      } else if (params.category) {
        endpoint = `/news/category/${params.category}`;
        delete params.category;
      }

      const response = await api.get(endpoint, { params });
      return extractDataFromResponse(response, 'News');
    } catch (error) {
      console.error('NewsService: Error fetching news:', error);
      console.error('NewsService: Error details:', error.message, error.stack);
      return [];
    }
  },

  // Get news article by ID
  getNewsById: async (id) => {
    try {
      const response = await api.get(`/news/${id}`);
      const data = extractDataFromResponse(response, 'News');
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error(`Error fetching news with ID ${id}:`, error);
      return null;
    }
  },

  // Get featured news
  getFeaturedNews: async (limit) => {
    try {
      const params = limit ? { limit } : {};
      const response = await api.get('/news/featured', { params });
      return extractDataFromResponse(response, 'News');
    } catch (error) {
      console.error('Error fetching featured news:', error);
      return [];
    }
  },

  // Get news articles by category
  getNewsByCategory: async (category, limit) => {
    try {
      const params = limit ? { limit } : {};
      const response = await api.get(`/news/category/${category}`, { params });
      return extractDataFromResponse(response, 'News');
    } catch (error) {
      console.error(`Error fetching news with category ${category}:`, error);
      return [];
    }
  },

  // Get latest news
  getLatestNews: async (limit) => {
    try {
      const params = limit ? { limit } : {};
      const response = await api.get('/news/latest', { params });
      return extractDataFromResponse(response, 'News');
    } catch (error) {
      console.error('Error fetching latest news:', error);
      return [];
    }
  },

  // Search news
  searchNews: async (query, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const response = await api.get('/news/search', {
        params: { keyword: query, page, limit }
      });
      return extractDataFromResponse(response, 'News');
    } catch (error) {
      console.error(`Error searching news with query ${query}:`, error);
      return [];
    }
  },
};

// Booking API services
export const bookingService = {
  // Get theaters by movie and date
  getTheatersByMovieAndDate: async (movieId, date) => {
    try {
      const response = await api.get(`/theaters/movie/${movieId}/date/${date}`);
      return extractDataFromResponse(response, 'Theater');
    } catch (error) {
      console.error(`Error fetching theaters for movie ${movieId} on date ${date}:`, error);
      return [];
    }
  },

  // Get cinemas by movie and date
  getCinemasByMovieAndDate: async (movieId, date) => {
    try {
      const response = await api.get(`/cinemas/movie/${movieId}/date/${date}`);
      return extractDataFromResponse(response, 'Cinema');
    } catch (error) {
      console.error(`Error fetching cinemas for movie ${movieId} on date ${date}:`, error);
      return [];
    }
  },

  // Get screenings by movie and date
  getScreeningsByMovieAndDate: async (movieId, date) => {
    try {
      const response = await api.get(`/screenings/movie/${movieId}/date/${date}`);
      return extractDataFromResponse(response, 'Screening');
    } catch (error) {
      console.error(`Error fetching screenings for movie ${movieId} on date ${date}:`, error);
      return [];
    }
  },

  // Get screenings by movie, cinema, and date
  getScreeningsByMovieCinemaDate: async (movieId, cinemaId, date) => {
    try {
      const response = await api.get(`/screenings/movie/${movieId}/cinema/${cinemaId}/date/${date}`);
      return extractDataFromResponse(response, 'Screening');
    } catch (error) {
      console.error(`Error fetching screenings for movie ${movieId} at cinema ${cinemaId} on date ${date}:`, error);
      return [];
    }
  },

  // Get showtimes by movie and date (legacy method)
  getShowtimesByMovieAndDate: async (movieId, date) => {
    try {
      const response = await api.get(`/showtimes/movie/${movieId}/date/${date}`);
      return extractDataFromResponse(response, 'Showtime');
    } catch (error) {
      console.error(`Error fetching showtimes for movie ${movieId} on date ${date}:`, error);
      return [];
    }
  },

  // Get available seats for a screening
  getAvailableSeats: async (screeningId) => {
    try {
      const response = await api.get(`/seats/screening/${screeningId}`);
      return extractDataFromResponse(response, 'Seat');
    } catch (error) {
      console.error(`Error fetching seats for screening ${screeningId}:`, error);
      return [];
    }
  },

  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Get user bookings
  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings/user');
      return extractDataFromResponse(response, 'Booking');
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
  },

  // Get user booking history
  getUserBookingHistory: async () => {
    try {
      const response = await api.get('/users/booking-history');
      return extractDataFromResponse(response, 'Booking');
    } catch (error) {
      console.error('Error fetching user booking history:', error);
      return [];
    }
  },

  // Get detailed booking history
  getDetailedBookingHistory: async () => {
    try {
      const response = await api.get('/users/booking-history/detailed');
      return extractDataFromResponse(response, 'Booking');
    } catch (error) {
      console.error('Error fetching detailed booking history:', error);
      return [];
    }
  },

  // Get booking history statistics
  getBookingHistoryStats: async () => {
    try {
      const response = await api.get('/users/booking-history/stats');
      if (response.data && typeof response.data === 'object') {
        return response.data;
      }
      return {
        totalBookings: 0,
        totalSpent: 0,
        favoriteGenres: [],
        favoriteTheaters: [],
        mostWatchedMovies: []
      };
    } catch (error) {
      console.error('Error fetching booking history stats:', error);
      return {
        totalBookings: 0,
        totalSpent: 0,
        favoriteGenres: [],
        favoriteTheaters: [],
        mostWatchedMovies: []
      };
    }
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      const data = extractDataFromResponse(response, 'Booking');
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error(`Error fetching booking ${bookingId}:`, error);
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId, data = {}) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`, data);
      return response.data;
    } catch (error) {
      console.error(`Error cancelling booking ${bookingId}:`, error);

      // Handle specific error cases
      if (!error.response) {
        throw {
          message: 'Network error. Please check your connection and try again.',
          code: 'NETWORK_ERROR',
          originalError: error
        };
      }

      // Handle specific HTTP status codes
      switch (error.response.status) {
        case 400:
          throw {
            message: error.response.data?.message || 'Invalid request. The booking cannot be cancelled.',
            code: 'INVALID_REQUEST',
            details: error.response.data,
            originalError: error
          };
        case 403:
          throw {
            message: 'You do not have permission to cancel this booking.',
            code: 'PERMISSION_DENIED',
            originalError: error
          };
        case 404:
          throw {
            message: 'Booking not found. It may have been already cancelled or does not exist.',
            code: 'BOOKING_NOT_FOUND',
            originalError: error
          };
        case 409:
          throw {
            message: 'This booking cannot be cancelled due to a conflict. It may have already been processed.',
            code: 'BOOKING_CONFLICT',
            originalError: error
          };
        case 500:
          throw {
            message: 'Server error. Please try again later or contact support.',
            code: 'SERVER_ERROR',
            originalError: error
          };
        default:
          throw {
            message: error.response.data?.message || 'An unexpected error occurred. Please try again later.',
            code: 'UNKNOWN_ERROR',
            originalError: error
          };
      }
    }
  },

  // Request refund for a booking
  requestRefund: async (bookingId, refundData) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/refund`, refundData);
      return response.data;
    } catch (error) {
      console.error(`Error requesting refund for booking ${bookingId}:`, error);
      throw error;
    }
  },
};

// Auth API services
export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

        // Store user data
        const userData = response.data.user || response.data;
        localStorage.setItem('user', JSON.stringify(userData));

        // Dispatch auth-change event
        window.dispatchEvent(new Event('auth-change'));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Dispatch auth-change event
    window.dispatchEvent(new Event('auth-change'));
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);

      // Update stored user data if successful
      if (response.data && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Dispatch auth-change event
        window.dispatchEvent(new Event('auth-change'));
      }

      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/users/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/users/reset-password', resetData);
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },
};

// Search API services
export const searchService = {
  // Global search across all collections
  globalSearch: async (query, options = {}) => {
    try {
      const { limit = 5 } = options;
      const response = await api.get('/search', {
        params: { q: query, limit }
      });

      if (response.data && typeof response.data === 'object') {
        // Process and return the search results
        const results = {};

        // Process movies
        if (response.data.movies) {
          results.movies = Array.isArray(response.data.movies) ? response.data.movies : [];
        }

        // Process events
        if (response.data.events) {
          results.events = Array.isArray(response.data.events) ? response.data.events : [];
        }

        // Process news
        if (response.data.news) {
          results.news = Array.isArray(response.data.news) ? response.data.news : [];
        }

        // Process cinemas
        if (response.data.cinemas) {
          results.cinemas = Array.isArray(response.data.cinemas) ? response.data.cinemas : [];
        }

        return results;
      }

      return {
        movies: [],
        events: [],
        news: [],
        cinemas: []
      };
    } catch (error) {
      console.error('Error performing global search:', error);
      return {
        movies: [],
        events: [],
        news: [],
        cinemas: []
      };
    }
  },

  // Search movies
  searchMovies: async (query, options = {}) => {
    try {
      return await movieService.searchMovies(query, options);
    } catch (error) {
      console.error(`Error searching movies with query ${query}:`, error);
      return [];
    }
  },

  // Search events
  searchEvents: async (query, options = {}) => {
    try {
      return await eventService.searchEvents(query, options);
    } catch (error) {
      console.error(`Error searching events with query ${query}:`, error);
      return [];
    }
  },

  // Search news
  searchNews: async (query, options = {}) => {
    try {
      return await newsService.searchNews(query, options);
    } catch (error) {
      console.error(`Error searching news with query ${query}:`, error);
      return [];
    }
  },

  // Autocomplete search
  autocomplete: async (query) => {
    try {
      const response = await api.get('/search/autocomplete', {
        params: { q: query }
      });

      if (response.data && Array.isArray(response.data.suggestions)) {
        return response.data.suggestions;
      }

      return [];
    } catch (error) {
      console.error('Error performing autocomplete search:', error);
      return [];
    }
  },
};

export default api;

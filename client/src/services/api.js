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

// Movie API services
export const movieService = {
  // Get all movies
  getMovies: async (params = {}) => {
    try {
      console.log('MovieService: Fetching movies with params:', params);
      const response = await api.get('/movies', { params });
      console.log('MovieService: Raw API response:', response);

      // Kiểm tra cấu trúc dữ liệu
      if (response.data) {
        console.log('MovieService: Response data type:', typeof response.data);
        console.log('MovieService: Response data is array?', Array.isArray(response.data));

        // Nếu response.data là một mảng, trả về nó
        if (Array.isArray(response.data)) {
          return response.data;
        }

        // Nếu response.data là một object, kiểm tra xem nó có thuộc tính movies không
        if (typeof response.data === 'object') {
          if (response.data.movies && Array.isArray(response.data.movies)) {
            return response.data.movies;
          }

          // Kiểm tra các thuộc tính khác xem có mảng nào chứa movie objects không
          for (const key in response.data) {
            if (Array.isArray(response.data[key]) && response.data[key].length > 0) {
              // Kiểm tra xem mảng này có phải là mảng movie objects không
              if (response.data[key][0].title) {
                return response.data[key];
              }
            }
          }

          // Nếu response.data có thuộc tính title, có thể nó là một movie object
          if (response.data.title) {
            return [response.data];
          }
        }
      }

      // Trả về mảng rỗng nếu không tìm thấy dữ liệu hợp lệ
      console.warn('MovieService: Could not find valid movie data in response');
      return [];
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
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie with ID ${id}:`, error);
      return { ...defaultMovieData, _id: id };
    }
  },

  // Get movies by status (Now Playing, Coming Soon, Featured)
  getMoviesByStatus: async (status) => {
    try {
      const response = await api.get(`/movies/status/${status}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movies with status ${status}:`, error);
      return [];
    }
  },

  // Get movies by genre
  getMoviesByGenre: async (genre) => {
    try {
      const response = await api.get(`/movies/genre/${genre}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movies with genre ${genre}:`, error);
      return [];
    }
  },

  // Get featured movies
  getFeaturedMovies: async () => {
    try {
      const response = await api.get('/movies/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured movies:', error);
      return [];
    }
  },

  // Search movies
  searchMovies: async (query, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const response = await api.get(`/search/movies?q=${query}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching movies with query ${query}:`, error);
      return [];
    }
  },

  // Get user reviews
  getUserReviews: async (userId) => {
    try {
      const response = await api.get(`/reviews/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for user ${userId}:`, error);
      return [];
    }
  },

  // Get movie reviews
  getMovieReviews: async (movieId) => {
    try {
      const response = await api.get(`/reviews/movie/${movieId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for movie ${movieId}:`, error);
      return [];
    }
  },

  // Add a review
  addReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
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
  getEvents: async () => {
    try {
      console.log('EventService: Calling API: GET /events');
      const response = await api.get('/events');
      console.log('EventService: Raw API response:', response);

      // Kiểm tra cấu trúc dữ liệu
      if (response.data) {
        console.log('EventService: Response data type:', typeof response.data);
        console.log('EventService: Response data is array?', Array.isArray(response.data));

        // Nếu response.data là một mảng, trả về nó
        if (Array.isArray(response.data)) {
          return response.data;
        }

        // Nếu response.data là một object, kiểm tra xem nó có thuộc tính events không
        if (typeof response.data === 'object') {
          if (response.data.events && Array.isArray(response.data.events)) {
            return response.data.events;
          }

          // Kiểm tra các thuộc tính khác xem có mảng nào chứa event objects không
          for (const key in response.data) {
            if (Array.isArray(response.data[key]) && response.data[key].length > 0) {
              // Kiểm tra xem mảng này có phải là mảng event objects không
              if (response.data[key][0].title && response.data[key][0].date) {
                return response.data[key];
              }
            }
          }

          // Nếu response.data có thuộc tính title và date, có thể nó là một event object
          if (response.data.title && response.data.date) {
            return [response.data];
          }
        }
      }

      // Trả về mảng rỗng nếu không tìm thấy dữ liệu hợp lệ
      console.warn('EventService: Could not find valid event data in response');
      return [];
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
      return response.data;
    } catch (error) {
      console.error(`Error fetching event with ID ${id}:`, error);
      return null;
    }
  },

  // Get featured events
  getFeaturedEvents: async () => {
    try {
      const response = await api.get('/events/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured events:', error);
      return [];
    }
  },

  // Get events by category
  getEventsByCategory: async (category) => {
    try {
      const response = await api.get(`/events/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching events with category ${category}:`, error);
      return [];
    }
  },

  // Get upcoming events
  getUpcomingEvents: async () => {
    try {
      const response = await api.get('/events/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  },

  // Search events
  searchEvents: async (query) => {
    try {
      const response = await api.get(`/search/events?q=${query}`);
      return response.data;
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
  getNews: async () => {
    try {
      console.log('NewsService: Calling API: GET /news');
      const response = await api.get('/news');
      console.log('NewsService: Raw API response:', response);

      // Kiểm tra cấu trúc dữ liệu
      if (response.data) {
        console.log('NewsService: Response data type:', typeof response.data);
        console.log('NewsService: Response data is array?', Array.isArray(response.data));

        // Nếu response.data là một mảng, trả về nó
        if (Array.isArray(response.data)) {
          return response.data;
        }

        // Nếu response.data là một object, kiểm tra xem nó có thuộc tính news không
        if (typeof response.data === 'object') {
          if (response.data.news && Array.isArray(response.data.news)) {
            return response.data.news;
          }

          // Kiểm tra các thuộc tính khác xem có mảng nào chứa news objects không
          for (const key in response.data) {
            if (Array.isArray(response.data[key]) && response.data[key].length > 0) {
              // Kiểm tra xem mảng này có phải là mảng news objects không
              if (response.data[key][0].title && response.data[key][0].content) {
                return response.data[key];
              }
            }
          }

          // Nếu response.data có thuộc tính title và content, có thể nó là một news object
          if (response.data.title && response.data.content) {
            return [response.data];
          }
        }
      }

      // Trả về mảng rỗng nếu không tìm thấy dữ liệu hợp lệ
      console.warn('NewsService: Could not find valid news data in response');
      return [];
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
      return response.data;
    } catch (error) {
      console.error(`Error fetching news with ID ${id}:`, error);
      return null;
    }
  },

  // Get news articles by category
  getNewsByCategory: async (category) => {
    try {
      const response = await api.get(`/news/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching news with category ${category}:`, error);
      return [];
    }
  },

  // Search news
  searchNews: async (query) => {
    try {
      const response = await api.get(`/search/news?q=${query}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching news with query ${query}:`, error);
      return [];
    }
  },
};

// Booking API services
export const bookingService = {
  // Get showtimes for a movie
  getShowtimesByMovie: async (movieId) => {
    try {
      const response = await api.get(`/showtimes/movie/${movieId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching showtimes for movie ${movieId}:`, error);
      return [];
    }
  },

  // Get available seats for a showtime
  getAvailableSeats: async (showtimeId) => {
    try {
      const response = await api.get(`/showtimes/${showtimeId}/seats`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching seats for showtime ${showtimeId}:`, error);
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
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
  },

  // Get user booking history
  getUserBookingHistory: async () => {
    try {
      const response = await api.get('/booking-history');
      return response.data;
    } catch (error) {
      console.error('Error fetching user booking history:', error);
      return [];
    }
  },

  // Get detailed booking history
  getDetailedBookingHistory: async () => {
    try {
      const response = await api.get('/booking-history/detailed');
      return response.data;
    } catch (error) {
      console.error('Error fetching detailed booking history:', error);
      return [];
    }
  },

  // Get booking history statistics
  getBookingHistoryStats: async () => {
    try {
      const response = await api.get('/booking-history/stats');
      return response.data;
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

  // Save booking to history
  saveBookingToHistory: async (bookingId) => {
    try {
      const response = await api.post('/booking-history', { bookingId });
      return response.data;
    } catch (error) {
      console.error('Error saving booking to history:', error);
      throw error;
    }
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
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
        localStorage.setItem('user', JSON.stringify(response.data));

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
};

// Search API services
export const searchService = {
  // Global search across all collections
  globalSearch: async (query, options = {}) => {
    try {
      const { limit = 5 } = options;
      const response = await api.get(`/search?q=${query}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Autocomplete search
  autocomplete: async (query) => {
    try {
      const response = await api.get(`/search/autocomplete?q=${query}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;

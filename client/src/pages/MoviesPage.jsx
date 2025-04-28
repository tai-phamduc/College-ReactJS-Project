import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFilter, FaStar, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { movieService } from '../services/api';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    genre: '',
    language: '',
    format: '',
    sortBy: 'popularity'
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await movieService.getMovies();

        // Check if response is an array or has a movies property
        const moviesData = Array.isArray(response) ? response : response.movies || [];

        setMovies(moviesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters to movies
  const getFilteredMovies = () => {
    let filtered = [...movies];

    // Filter by genre
    if (filters.genre) {
      filtered = filtered.filter(movie =>
        movie.genre && movie.genre.includes(filters.genre)
      );
    }

    // Filter by language
    if (filters.language) {
      filtered = filtered.filter(movie =>
        movie.language === filters.language
      );
    }

    // Filter by format (assuming format is stored in a property like 'format' or 'screenFormat')
    if (filters.format) {
      filtered = filtered.filter(movie =>
        movie.format === filters.format ||
        (movie.screenFormats && movie.screenFormats.includes(filters.format))
      );
    }

    // Sort movies
    switch (filters.sortBy) {
      case 'popularity':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'release_date':
        filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    return filtered;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format duration to hours and minutes
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get filtered movies
  const filteredMovies = getFilteredMovies();

  return (
    <div className="min-h-screen bg-dark text-white py-16">
      <div className="container">
        <h1 className="section-title">
          <span className="text-primary">Our</span> Movies
        </h1>

        {/* Filter Section */}
        <div className="bg-secondary p-6 rounded-lg mb-8 shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center text-primary">
            <FaFilter className="mr-2" />
            Filter Movies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="filter-group">
              <label className="block text-sm font-medium mb-2 text-gray-300">Genre</label>
              <div className="relative">
                <select
                  name="genre"
                  value={filters.genre}
                  onChange={handleFilterChange}
                  className="w-full bg-dark border border-gray-700 text-white p-3 rounded-md appearance-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Genres</option>
                  <option value="Action">Action</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Animation">Animation</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Crime">Crime</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Drama">Drama</option>
                  <option value="Family">Family</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Horror">Horror</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Romance">Romance</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Thriller">Thriller</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="filter-group">
              <label className="block text-sm font-medium mb-2 text-gray-300">Language</label>
              <div className="relative">
                <select
                  name="language"
                  value={filters.language}
                  onChange={handleFilterChange}
                  className="w-full bg-dark border border-gray-700 text-white p-3 rounded-md appearance-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Languages</option>
                  <option value="English">English</option>
                  <option value="Vietnamese">Vietnamese</option>
                  <option value="Korean">Korean</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Chinese">Chinese</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="filter-group">
              <label className="block text-sm font-medium mb-2 text-gray-300">Format</label>
              <div className="relative">
                <select
                  name="format"
                  value={filters.format}
                  onChange={handleFilterChange}
                  className="w-full bg-dark border border-gray-700 text-white p-3 rounded-md appearance-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Formats</option>
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="IMAX">IMAX</option>
                  <option value="4DX">4DX</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="filter-group">
              <label className="block text-sm font-medium mb-2 text-gray-300">Sort By</label>
              <div className="relative">
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full bg-dark border border-gray-700 text-white p-3 rounded-md appearance-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="popularity">Popularity</option>
                  <option value="release_date">Release Date</option>
                  <option value="title">Title</option>
                  <option value="rating">Rating</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              className="btn bg-dark text-white hover:bg-gray-800 mr-3"
              onClick={() => setFilters({ genre: '', language: '', format: '', sortBy: 'popularity' })}
            >
              Reset
            </button>
            <button className="btn btn-primary">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-8">
            <p className="text-center">{error}</p>
          </div>
        ) : (
          <>
            {/* Movies Grid */}
            {filteredMovies.length === 0 ? (
              <div className="bg-secondary p-8 rounded-lg text-center mb-8">
                <h3 className="text-xl mb-2">No movies found</h3>
                <p className="text-gray-400">Try adjusting your filters or check back later for new movies.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {filteredMovies.map((movie) => (
                  <div key={movie._id} className="card movie-card">
                    <div className="aspect-[2/3] bg-light-gray overflow-hidden">
                      <div
                        className="movie-poster h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'})` }}
                      ></div>
                    </div>
                    <div className="movie-info">
                      <h3 className="text-xl font-bold mb-1">{movie.title}</h3>
                      <div className="flex items-center mb-2">
                        <span className="text-primary mr-2">
                          {Array.from({ length: Math.round(movie.rating / 2) || 0 }).map((_, i) => (
                            <FaStar key={i} className="inline" />
                          ))}
                        </span>
                        <span className="text-sm text-muted">{movie.rating ? movie.rating.toFixed(1) : 'N/A'}/5</span>
                      </div>
                      <div className="flex items-center text-sm text-muted mb-2">
                        <FaCalendarAlt className="mr-1" />
                        <span>{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}</span>
                        <span className="mx-2">•</span>
                        <FaClock className="mr-1" />
                        <span>{movie.duration ? formatDuration(movie.duration) : 'N/A'}</span>
                      </div>
                      <p className="text-sm text-muted mb-3">
                        {movie.genre ? (Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre) : 'N/A'}
                      </p>
                      <Link to={`/movies/${movie._id}`} className="btn btn-primary btn-sm">
                        {movie.status === 'Now Playing' ? 'Book Now' : 'View Details'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredMovies.length > 0 && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-colors">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-primary text-white rounded-md">1</button>
                  <button className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-colors">
                    2
                  </button>
                  <button className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-colors">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaFilm, FaCalendarAlt, FaNewspaper, FaClock, FaStar, FaFilter, FaTimes } from 'react-icons/fa';
import api, { movieService } from '../services/api';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ movies: [], events: [], news: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults({ movies: [], events: [], news: [] });
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch all results in parallel
        const [moviesResponse, eventsResponse, newsResponse, genresResponse] = await Promise.all([
          api.get(`/search/movies?q=${query}`),
          api.get(`/search/events?q=${query}`),
          api.get(`/search/news?q=${query}`),
          api.get('/genres'),
        ]);

        setResults({
          movies: moviesResponse.data || [],
          events: eventsResponse.data || [],
          news: newsResponse.data || [],
        });

        setGenres(genresResponse.data || []);

        // Extract unique years from movies
        const uniqueYears = [...new Set(
          moviesResponse.data
            .map(movie => movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null)
            .filter(year => year !== null)
        )].sort((a, b) => b - a); // Sort years in descending order

        setYears(uniqueYears);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to fetch search results. Please try again.');
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  // Apply filters to movies
  const filteredMovies = results.movies.filter(movie => {
    // Filter by genre
    if (filters.genre && (!movie.genres || !movie.genres.some(g => g._id === filters.genre))) {
      return false;
    }

    // Filter by year
    if (filters.year && (!movie.releaseDate || new Date(movie.releaseDate).getFullYear() !== parseInt(filters.year))) {
      return false;
    }

    // Filter by rating
    if (filters.rating && (!movie.rating || parseFloat(movie.rating) < parseFloat(filters.rating))) {
      return false;
    }

    return true;
  });

  // Get visible results based on active tab
  const visibleResults = activeTab === 'all'
    ? { movies: filteredMovies, events: results.events, news: results.news }
    : activeTab === 'movies'
      ? { movies: filteredMovies, events: [], news: [] }
      : activeTab === 'events'
        ? { movies: [], events: results.events, news: [] }
        : { movies: [], events: [], news: results.news };

  // Total count of results
  const totalCount = filteredMovies.length + results.events.length + results.news.length;

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ genre: '', year: '', rating: '' });
  };

  return (
    <div className="py-12 bg-dark min-h-screen">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-400">
            Found {totalCount} results
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-700">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All ({totalCount})
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'movies' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('movies')}
          >
            Movies ({filteredMovies.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'events' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('events')}
          >
            Events ({results.events.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'news' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('news')}
          >
            News ({results.news.length})
          </button>
        </div>

        {/* Filters */}
        {(activeTab === 'all' || activeTab === 'movies') && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                className="flex items-center text-primary hover:text-primary-dark"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>

              {Object.values(filters).some(v => v) && (
                <button
                  className="flex items-center text-gray-400 hover:text-white"
                  onClick={clearFilters}
                >
                  <FaTimes className="mr-2" />
                  Clear Filters
                </button>
              )}
            </div>

            {showFilters && (
              <div className="bg-secondary p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Genre Filter */}
                  <div>
                    <label className="block text-gray-300 mb-2">Genre</label>
                    <select
                      value={filters.genre}
                      onChange={(e) => handleFilterChange('genre', e.target.value)}
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">All Genres</option>
                      {genres.map(genre => (
                        <option key={genre._id} value={genre._id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div>
                    <label className="block text-gray-300 mb-2">Year</label>
                    <select
                      value={filters.year}
                      onChange={(e) => handleFilterChange('year', e.target.value)}
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">All Years</option>
                      {years.map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-gray-300 mb-2">Minimum Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Any Rating</option>
                      <option value="9">9+ ⭐</option>
                      <option value="8">8+ ⭐</option>
                      <option value="7">7+ ⭐</option>
                      <option value="6">6+ ⭐</option>
                      <option value="5">5+ ⭐</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && totalCount === 0 && (
          <div className="bg-secondary text-white p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-gray-400">
              We couldn't find any matches for "{query}". Please try another search term or browse our categories.
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <div className="space-y-8">
            {/* Movies */}
            {visibleResults.movies.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Movies</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {visibleResults.movies.map(movie => (
                    <div key={movie._id} className="bg-secondary rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                      <div className="h-64 bg-gray-700 relative">
                        <img
                          src={movie.poster || movie.images?.[0] || movie.posterUrl || movie.image || `https://placehold.co/300x450/222222/FFA500?text=${encodeURIComponent(movie.title || 'Movie')}`}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            // Try with http if https fails
                            if (e.target.src.startsWith('https://')) {
                              const httpUrl = e.target.src.replace('https://', 'http://');
                              console.log('Trying HTTP URL instead:', httpUrl);
                              e.target.src = httpUrl;
                            } else {
                              // Use a placeholder with the movie title
                              e.target.src = `https://placehold.co/300x450/222222/FFA500?text=${encodeURIComponent(movie.title || 'Movie')}`;
                            }
                          }}
                        />
                        {movie.rating && (
                          <div className="absolute top-2 right-2 bg-primary text-white text-sm font-bold px-2 py-1 rounded">
                            <FaStar className="inline mr-1" />
                            {movie.rating}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{movie.title}</h3>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center text-sm text-gray-400">
                            <FaFilm className="mr-1" />
                            <span className="line-clamp-1">
                              {movie.genres?.map(g => g.name).join(', ') || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <FaClock className="mr-1" />
                            <span>{movie.duration ? `${movie.duration} min` : 'N/A'}</span>
                          </div>
                        </div>
                        <Link to={`/movies/${movie._id}`} className="btn btn-primary w-full">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events */}
            {visibleResults.events.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visibleResults.events.map(event => (
                    <div key={event._id} className="flex bg-secondary rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                      <div className="w-1/3 bg-gray-700 relative">
                        <img
                          src={event.image || event.images?.[0] || event.imageUrl || `https://placehold.co/300x450/222222/FFA500?text=${encodeURIComponent(event.title || 'Event')}`}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            // Try with http if https fails
                            if (e.target.src.startsWith('https://')) {
                              const httpUrl = e.target.src.replace('https://', 'http://');
                              console.log('Trying HTTP URL instead:', httpUrl);
                              e.target.src = httpUrl;
                            } else {
                              // Use a placeholder with the event title
                              e.target.src = `https://placehold.co/300x450/222222/FFA500?text=${encodeURIComponent(event.title || 'Event')}`;
                            }
                          }}
                        />
                      </div>
                      <div className="w-2/3 p-4">
                        <div className="flex items-center text-primary mb-2">
                          <FaCalendarAlt className="mr-2" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{event.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {event.description}
                        </p>
                        <Link to={`/events/${event._id}`} className="text-primary hover:underline text-sm">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* News */}
            {visibleResults.news.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">News</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {visibleResults.news.map(item => (
                    <div key={item._id} className="bg-secondary rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                      <div className="h-48 bg-gray-700 relative">
                        <img
                          src={item.image || item.featuredImage || item.images?.[0] || item.imageUrl || `https://placehold.co/800x450/222222/FFA500?text=${encodeURIComponent(item.title || 'News')}`}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            // Try with http if https fails
                            if (e.target.src.startsWith('https://')) {
                              const httpUrl = e.target.src.replace('https://', 'http://');
                              console.log('Trying HTTP URL instead:', httpUrl);
                              e.target.src = httpUrl;
                            } else {
                              // Use a placeholder with the news title
                              e.target.src = `https://placehold.co/800x450/222222/FFA500?text=${encodeURIComponent(item.title || 'News')}`;
                            }
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center text-gray-400 mb-2">
                          <FaNewspaper className="mr-2" />
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {item.excerpt || item.content?.substring(0, 100) + '...'}
                        </p>
                        <Link to={`/news/${item._id}`} className="text-primary hover:underline text-sm">
                          Read More
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;

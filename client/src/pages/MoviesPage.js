import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import { movieService } from '../services/api.js';

const MoviesPage = () => {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'All';
  const genreDropdownRef = useRef(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        let data;

        if (statusFilter === 'All') {
          data = await movieService.getMovies();
        } else {
          data = await movieService.getMoviesByStatus(statusFilter);
        }

        // If data is an object with movies property, extract it
        const moviesArray = data.movies || data;

        // Transform API data to match the expected format
        const formattedMovies = moviesArray.map(movie => ({
          id: movie._id,
          title: movie.title,
          genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre,
          duration: `${movie.duration} Mins`,
          status: movie.status,
          image: movie.poster || '/images/placeholder.jpg',
          link: `/movies/${movie._id}`,
        }));

        setMovies(formattedMovies);
        setError(null);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [statusFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target)) {
        setIsGenreDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter movies based on status
  const filteredMovies = statusFilter === 'All'
    ? movies
    : movies.filter(movie => movie.status === statusFilter);

  // State for search and genre filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

  // All genres from movies
  const allGenres = [...new Set(movies.flatMap(movie =>
    movie.genre.split(', ')
  ))].sort();

  // Toggle genre selection
  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // Clear all selected genres
  const clearGenres = () => {
    setSelectedGenres([]);
  };

  // Apply search and genre filters
  const displayedMovies = filteredMovies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());

    // If no genres are selected, show all movies
    if (selectedGenres.length === 0) {
      return matchesSearch;
    }

    // Split movie genres into an array
    const movieGenres = movie.genre.split(', ');

    // Check if any selected genre matches any of the movie's genres
    const matchesGenre = selectedGenres.some(selectedGenre =>
      movieGenres.some(movieGenre =>
        // Use exact match or check if it's a substring at word boundaries
        movieGenre === selectedGenre ||
        movieGenre.includes(selectedGenre)
      )
    );

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="py-12 bg-dark">
      <div className="container">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {statusFilter === 'All' ? 'All Movies' : `${statusFilter} Movies`}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our collection of {statusFilter.toLowerCase()} movies. Book tickets online and enjoy the best cinema experience.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-secondary p-6 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="w-full px-4 py-2 pl-10 bg-dark text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Genre Filter - Multi Select */}
            <div className="w-full md:w-64">
              <div className="relative" ref={genreDropdownRef}>
                <button
                  className="w-full px-4 py-2 pl-10 bg-dark text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary flex justify-between items-center"
                  onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                >
                  <span className="truncate">
                    {selectedGenres.length === 0
                      ? 'All Genres'
                      : selectedGenres.length === 1
                        ? selectedGenres[0]
                        : `${selectedGenres.length} genres selected`}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${isGenreDropdownOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <FaFilter className="absolute left-3 top-3 text-gray-400" />

                {/* Selected genres pills */}
                {selectedGenres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedGenres.map(genre => (
                      <span key={genre} className="bg-primary/20 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        {genre}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleGenre(genre);
                          }}
                          className="ml-1 text-gray-400 hover:text-white"
                        >
                          <FaTimes size={10} />
                        </button>
                      </span>
                    ))}
                    {selectedGenres.length > 1 && (
                      <button
                        onClick={clearGenres}
                        className="bg-gray-800 text-gray-400 hover:text-white text-xs px-2 py-1 rounded-full"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                )}

                {isGenreDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-dark border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2 border-b border-gray-700 flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        {selectedGenres.length} selected
                      </span>
                      <button
                        className="text-xs text-primary hover:text-red-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearGenres();
                        }}
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="p-2">
                      {allGenres.map((genre) => (
                        <div
                          key={genre}
                          className="flex items-center px-2 py-1 hover:bg-gray-800 rounded cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleGenre(genre);
                          }}
                        >
                          <input
                            type="checkbox"
                            id={`genre-${genre}`}
                            checked={selectedGenres.includes(genre)}
                            onChange={() => {}}
                            className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-600 rounded"
                          />
                          <label htmlFor={`genre-${genre}`} className="cursor-pointer flex-grow">
                            {genre}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-64">
              <Link
                to="/movies"
                className={`inline-block px-4 py-2 rounded-md mr-2 mb-2 ${
                  statusFilter === 'All' ? 'bg-primary text-white' : 'bg-dark text-white'
                }`}
              >
                All
              </Link>
              <Link
                to="/movies?status=Now Playing"
                className={`inline-block px-4 py-2 rounded-md mr-2 mb-2 ${
                  statusFilter === 'Now Playing' ? 'bg-primary text-white' : 'bg-dark text-white'
                }`}
              >
                Now Playing
              </Link>
              <Link
                to="/movies?status=Coming Soon"
                className={`inline-block px-4 py-2 rounded-md mr-2 mb-2 ${
                  statusFilter === 'Coming Soon' ? 'bg-primary text-white' : 'bg-dark text-white'
                }`}
              >
                Coming Soon
              </Link>
              <Link
                to="/movies?status=Featured"
                className={`inline-block px-4 py-2 rounded-md mb-2 ${
                  statusFilter === 'Featured' ? 'bg-primary text-white' : 'bg-dark text-white'
                }`}
              >
                Featured
              </Link>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Loading movies...</h3>
            <p className="text-gray-400">Please wait while we fetch the latest movies.</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Error</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        ) : displayedMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedMovies.map((movie) => (
              <div key={movie.id} className="bg-secondary rounded-lg overflow-hidden shadow-lg">
                <div className="h-64 bg-gray-700 relative overflow-hidden">
                  {movie.image && (
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400">{movie.genre}</span>
                    <span className="text-sm text-gray-400">{movie.duration}</span>
                  </div>
                  <Link
                    to={movie.link}
                    className={`btn w-full ${
                      movie.status === 'Coming Soon' ? 'btn-secondary' : 'btn-primary'
                    }`}
                  >
                    {movie.status === 'Coming Soon' ? 'More Info' : 'Get Ticket'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No movies found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;

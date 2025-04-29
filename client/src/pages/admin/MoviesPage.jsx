import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll simulate loading and set some sample data
    const timer = setTimeout(() => {
      const sampleMovies = Array(15)
        .fill(0)
        .map((_, index) => ({
          _id: `movie-${index + 1}`,
          title: `Sample Movie ${index + 1}`,
          director: `Director ${index + 1}`,
          releaseDate: new Date(2023, index % 12, (index % 28) + 1).toISOString(),
          status: index % 3 === 0 ? 'Now Playing' : index % 3 === 1 ? 'Coming Soon' : 'Featured',
          rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
          poster: `https://placehold.co/300x450/222222/FFA500?text=Movie+${index + 1}`,
        }));

      setMovies(sampleMovies);
      setTotalPages(3); // Simulate pagination
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter and search movies
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || movie.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const moviesPerPage = 10;
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Movies Management</h1>
        <Link
          to="/admin/movies/create"
          className="btn btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Movie</span>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search movies..."
            className="bg-dark text-white w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-400" />
          <select
            className="bg-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Now Playing">Now Playing</option>
            <option value="Coming Soon">Coming Soon</option>
            <option value="Featured">Featured</option>
          </select>
        </div>
      </div>

      {/* Movies Table */}
      <div className="bg-dark rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Movie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Director
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Release Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gray-700 animate-pulse rounded"></div>
                          <div className="h-4 w-24 bg-gray-700 animate-pulse rounded"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-20 bg-gray-700 animate-pulse rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-24 bg-gray-700 animate-pulse rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-20 bg-gray-700 animate-pulse rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-10 bg-gray-700 animate-pulse rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-4 w-20 bg-gray-700 animate-pulse rounded ml-auto"></div>
                      </td>
                    </tr>
                  ))
              ) : currentMovies.length > 0 ? (
                currentMovies.map((movie) => (
                  <tr key={movie._id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <span className="font-medium">{movie.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{movie.director}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(movie.releaseDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          movie.status === 'Now Playing'
                            ? 'bg-green-900 text-green-300'
                            : movie.status === 'Coming Soon'
                            ? 'bg-blue-900 text-blue-300'
                            : 'bg-yellow-900 text-yellow-300'
                        }`}
                      >
                        {movie.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{movie.rating}/5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/movies/${movie._id}`}
                          className="p-2 text-blue-400 hover:text-blue-600 rounded-full hover:bg-gray-700"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/admin/movies/edit/${movie._id}`}
                          className="p-2 text-yellow-400 hover:text-yellow-600 rounded-full hover:bg-gray-700"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="p-2 text-red-400 hover:text-red-600 rounded-full hover:bg-gray-700"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                    No movies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
            <div className="text-sm text-gray-400">
              Showing {indexOfFirstMovie + 1} to{' '}
              {Math.min(indexOfLastMovie, filteredMovies.length)} of{' '}
              {filteredMovies.length} movies
            </div>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded ${
                    currentPage === number
                      ? 'bg-primary text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;

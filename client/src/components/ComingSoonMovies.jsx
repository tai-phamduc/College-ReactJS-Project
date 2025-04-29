import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/api';

const ComingSoonMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await movieService.getMovies({ status: 'Coming Soon', limit: 3 });

        // Check if response is an array or has a movies property
        const moviesData = Array.isArray(response) ? response : response.movies || [];

        setMovies(moviesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching upcoming movies:', err);
        setError('Failed to load upcoming movies. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Coming Soon';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section className="py-16 bg-secondary">
      <div className="container">
        <h2 className="section-title">
          <span className="text-primary">Coming</span> Soon
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-8">
            <p className="text-center">{error}</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="bg-dark p-8 rounded-lg text-center mb-12">
            <h3 className="text-xl mb-2">No upcoming movies found</h3>
            <p className="text-gray-400">Check back later for new releases.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {movies.map((movie) => (
              <div key={movie._id} className="card">
                <div className="aspect-[2/3] bg-light-gray overflow-hidden">
                  <img
                    src={
                      movie.poster ||
                      movie.images?.[0] ||
                      movie.posterUrl ||
                      movie.image ||
                      'https://placehold.co/300x450/222222/FFA500?text=' + encodeURIComponent(movie.title || 'Movie')
                    }
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      // Try with http if https fails
                      if (e.target.src.startsWith('https://')) {
                        const httpUrl = e.target.src.replace('https://', 'http://');
                        console.log('Trying HTTP URL instead:', httpUrl);
                        e.target.src = httpUrl;
                      } else {
                        // Use a placeholder with the movie title
                        e.target.src = 'https://placehold.co/300x450/222222/FFA500?text=' + encodeURIComponent(movie.title || 'Movie');
                      }
                    }}
                  />
                </div>
                <div className="card-body">
                  <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
                  <p className="text-sm text-muted mb-3">{movie.genre?.join(', ') || 'Sci-Fi, Thriller'}</p>
                  <p className="text-sm mb-4">Release Date: {formatDate(movie.releaseDate)}</p>
                  <Link to={`/movies/${movie._id}`} className="btn btn-outline btn-sm">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/movies" className="btn btn-outline">View All Movies</Link>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonMovies;

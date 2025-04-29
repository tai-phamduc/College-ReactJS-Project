import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { movieService } from '../services/api';

const NowShowingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        console.log('NowShowingMovies: Fetching movies...');
        const response = await movieService.getMovies({ status: 'Now Playing', limit: 3 });
        console.log('NowShowingMovies: API response:', response);

        // Check if response is an array or has a movies property
        let moviesData = [];
        if (Array.isArray(response)) {
          moviesData = response;
        } else if (response && typeof response === 'object') {
          // Check if response has a movies property
          if (Array.isArray(response.movies)) {
            moviesData = response.movies;
          } else if (Object.keys(response).length > 0) {
            // If response is an object with data but no movies property, it might be the data itself
            moviesData = [response];
          }
        }
        console.log('NowShowingMovies: Processed movies data:', moviesData);

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

  return (
    <section className="py-16 bg-dark">
      <div className="container">
        <h2 className="section-title">
          <span className="text-primary">Now</span> Showing
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
          <div className="bg-secondary p-8 rounded-lg text-center mb-12">
            <h3 className="text-xl mb-2">No movies currently showing</h3>
            <p className="text-gray-400">Check back later for new releases.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {movies.map((movie) => (
              <div key={movie._id} className="card movie-card">
                <div className="aspect-[2/3] bg-light-gray overflow-hidden">
                  <div
                    className="movie-poster h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${movie.poster || movie.images?.[0] || 'https://via.placeholder.com/300x450?text=No+Image'})` }}
                  ></div>
                </div>
                <div className="movie-info">
                  <h3 className="text-xl font-bold mb-1">{movie.title}</h3>
                  <div className="flex items-center mb-2">
                    <span className="text-primary mr-2">
                      {Array.from({ length: Math.round((movie.rating || movie.averageRating || 4) / 2) }).map((_, i) => (
                        <FaStar key={i} className="inline" />
                      ))}
                    </span>
                    <span className="text-sm text-muted">{movie.rating || movie.averageRating || '4.5'}/5</span>
                  </div>
                  <p className="text-sm text-muted mb-3">
                    {movie.genre?.join(', ') || movie.genres?.join(', ') || 'Action, Adventure'}
                  </p>
                  <Link to={`/movies/${movie._id}`} className="btn btn-primary btn-sm">Book Now</Link>
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

export default NowShowingMovies;

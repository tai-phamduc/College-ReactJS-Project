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
        console.log('NowShowingMovies: API response type:', typeof response);
        console.log('NowShowingMovies: API response keys:', response ? Object.keys(response) : 'null');
        console.log('NowShowingMovies: API response:', response);

        // Kiểm tra chi tiết cấu trúc dữ liệu
        let moviesData = [];

        if (Array.isArray(response)) {
          console.log('NowShowingMovies: Response is an array with length:', response.length);
          moviesData = response;
        } else if (response && typeof response === 'object') {
          console.log('NowShowingMovies: Response is an object');

          // Kiểm tra nếu response có thuộc tính movies
          if (response.movies && Array.isArray(response.movies)) {
            console.log('NowShowingMovies: Found movies array in response with length:', response.movies.length);
            moviesData = response.movies;
          } else {
            // Kiểm tra tất cả các thuộc tính của response để tìm mảng
            for (const key in response) {
              if (Array.isArray(response[key])) {
                console.log(`NowShowingMovies: Found array in response.${key} with length:`, response[key].length);
                if (response[key].length > 0 && response[key][0].title) {
                  console.log(`NowShowingMovies: Array in response.${key} contains movie objects`);
                  moviesData = response[key];
                  break;
                }
              }
            }

            // Nếu không tìm thấy mảng nào, kiểm tra xem response có phải là một movie object không
            if (moviesData.length === 0 && response.title) {
              console.log('NowShowingMovies: Response is a single movie object');
              moviesData = [response];
            }
          }
        }

        console.log('NowShowingMovies: Final processed movies data:', moviesData);

        // Sử dụng dữ liệu mẫu nếu không có dữ liệu từ API
        if (moviesData.length === 0) {
          console.log('NowShowingMovies: No movies data found, using sample data');
          moviesData = [
            {
              _id: '1',
              title: 'Sample Movie 1',
              poster: 'https://via.placeholder.com/300x450?text=Sample+Movie+1',
              rating: 4.5,
              genre: ['Action', 'Adventure']
            },
            {
              _id: '2',
              title: 'Sample Movie 2',
              poster: 'https://via.placeholder.com/300x450?text=Sample+Movie+2',
              rating: 4.0,
              genre: ['Drama', 'Thriller']
            },
            {
              _id: '3',
              title: 'Sample Movie 3',
              poster: 'https://via.placeholder.com/300x450?text=Sample+Movie+3',
              rating: 4.8,
              genre: ['Comedy', 'Romance']
            }
          ];
        }

        setMovies(moviesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movies:', err);
        console.error('Error details:', err.message, err.stack);
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
                    style={{
                      backgroundImage: `url(${
                        movie.poster ||
                        movie.images?.[0] ||
                        movie.posterUrl ||
                        movie.image ||
                        'https://via.placeholder.com/300x450?text=No+Image'
                      })`
                    }}
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

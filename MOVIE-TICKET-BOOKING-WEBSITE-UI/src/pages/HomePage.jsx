import "./styles/HomePage.scss"
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useContext } from 'react';

import Navbar from '../components/Navbar';
import Hero from '../components/2-Hero'
import MoviesNowPlaying from '../components/3-MoviesNowPlaying';
import TopFeaturedMovies from '../components/4-TopFeaturedMovies';
import UpcomingEvent from '../components/5-Upcoming-Event'
import Testimonials from '../components/6-Testimonials'
import MoviesComingSoon from '../components/7-MoviesComingSoon';
import Posts from '../components/8-Posts';
import Footer from '../components/Footer';
import { MoviesContext } from '../contexts/MoviesContext';

export default function HomePage() {
  const { fetchMoviesNowPlaying } = useContext(MoviesContext);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Fetch movies data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch now playing movies
        const nowPlayingResponse = await fetch('https://movie-ticket-booking-api.vercel.app/api/movies/now-playing');
        const nowPlayingData = await nowPlayingResponse.json();

        // Format the data to match the expected structure
        const formattedNowPlaying = nowPlayingData.map(movie => ({
          id: movie._id,
          name: movie.title,
          genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre,
          length: movie.duration,
          image_link: movie.poster || "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-12-768x513.jpg"
        }));

        setNowPlayingMovies(formattedNowPlaying);

        // Fetch coming soon movies
        const comingSoonResponse = await fetch('https://movie-ticket-booking-api.vercel.app/api/movies/upcoming');
        const comingSoonData = await comingSoonResponse.json();

        // Format the data to match the expected structure
        const formattedComingSoon = comingSoonData.map(movie => ({
          id: movie._id,
          name: movie.title,
          genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre,
          length: movie.duration,
          image_link: movie.poster || "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-12-768x513.jpg"
        }));

        setComingSoonMovies(formattedComingSoon);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setFetchError(error.message || 'Failed to fetch movies data');

        // Fallback data in case of error
        const fallbackMovies = [
          {
            id: 'fallback1',
            name: "The Fifth Day",
            genre: "Comedy",
            length: 180,
            image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-12-768x513.jpg"
          },
          {
            id: 'fallback2',
            name: "Black and White Twins",
            genre: "Animation, Comedy",
            length: 190,
            image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/banner-10-768x660.jpg"
          },
          {
            id: 'fallback3',
            name: "The Scariest Dream",
            genre: "Thriller",
            length: 180,
            image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-09-768x513.jpg"
          },
          {
            id: 'fallback4',
            name: "The Pursuit of Dreams",
            genre: "Animation",
            length: 180,
            image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-08-768x513.jpg"
          },
          {
            id: 'fallback5',
            name: "Alis Keep Walking",
            genre: "Crime, Thriller",
            length: 180,
            image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-07-768x519.jpg"
          }
        ];

        setNowPlayingMovies(fallbackMovies);
        setComingSoonMovies([...fallbackMovies]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className='homepage'>
        <Navbar />
        <Hero />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading movies data...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error message if there was an error fetching data
  // We still show the page with fallback data, but display a notification
  const errorAlert = fetchError && (
    <div className="container mt-4">
      <div className="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Note:</strong> {fetchError}. Showing sample movie data instead.
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>
  );

  return (
    <div className='homepage'>
      <Navbar />
      <Hero />
      {errorAlert}
      <MoviesNowPlaying movies={nowPlayingMovies} />
      <TopFeaturedMovies />
      <UpcomingEvent />
      <Testimonials />
      <MoviesComingSoon movies={comingSoonMovies} />
      <Posts />
      <Footer />
    </div>
  );
}

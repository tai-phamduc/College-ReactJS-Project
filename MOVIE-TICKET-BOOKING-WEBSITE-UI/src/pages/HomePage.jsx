import "./styles/HomePage.scss"
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from '../components/Navbar';
import Hero from '../components/2-Hero'
import MoviesNowPlaying from '../components/3-MoviesNowPlaying';
import TopFeaturedMovies from '../components/4-TopFeaturedMovies';
import UpcomingEvent from '../components/5-Upcoming-Event'
import Testimonials from '../components/6-Testimonials'
import MoviesComingSoon from '../components/7-MoviesComingSoon';
import Posts from '../components/8-Posts';
import Footer from '../components/Footer';

export default function HomePage() {
  const movies = [
    {
      name: "The Fifth Day",
      genre: "Comedy",
      length: 180,
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-12-768x513.jpg"
    },
    {
      name: "Black and White Twins",
      genre: "Animation, Comedy",
      length: 190,
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/banner-10-768x660.jpg"
    },
    {
      name: "The Scariest Dream",
      genre: "Thriller",
      length: 180,
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-09-768x513.jpg"
    },
    {
      name: "The Pursuit of Dreams",
      genre: "Animation",
      length: 180,
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-08-768x513.jpg"
    },
    {
      name: "Alis Keep Walking",
      genre: "Crime, Thriller",
      length: 180,
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-07-768x519.jpg"
    }
  ];
  return (
    <div className='homepage'>
      <Navbar />
      <Hero />
      <MoviesNowPlaying movies={movies} />
      <TopFeaturedMovies />
      <UpcomingEvent />
      <Testimonials />
      <MoviesComingSoon />
      <Posts />
      <Footer />
    </div>
  );
}

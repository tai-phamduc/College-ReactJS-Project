import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { FaPlay, FaTicketAlt, FaCalendarAlt, FaFilm } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Home components
import FeaturedMovies from '../components/home/FeaturedMovies';
import NowPlayingMovies from '../components/home/NowPlayingMovies';
import ComingSoonMovies from '../components/home/ComingSoonMovies';
import EventsPreview from '../components/home/EventsPreview';
import LatestNews from '../components/home/LatestNews';
import { movieService } from '../services/api';

const HomePage = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        const data = await movieService.getFeaturedMovies();
        setFeaturedMovies(data.slice(0, 5));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured movies for hero slider:', err);
        setLoading(false);
      }
    };

    fetchFeaturedMovies();
  }, []);

  // Hero slider background images
  const heroSlides = [
    {
      id: 1,
      title: "Experience Cinema Like Never Before",
      subtitle: "Book your tickets now",
      image: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/slider-home-1-1.jpg",
      buttonText: "Explore Movies",
      buttonLink: "/movies"
    },
    {
      id: 2,
      title: "Discover the Latest Blockbusters",
      subtitle: "Premium viewing experience",
      image: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/slider-home-1-2.jpg",
      buttonText: "View Schedule",
      buttonLink: "/movies"
    },
    {
      id: 3,
      title: "Special Events & Premieres",
      subtitle: "Be the first to watch",
      image: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/slider-home-1-3.jpg",
      buttonText: "See Events",
      buttonLink: "/events"
    }
  ];

  // Use featured movies as additional slides if available
  const combinedSlides = [...heroSlides];
  if (featuredMovies.length > 0) {
    featuredMovies.forEach(movie => {
      if (movie.backdrop) {
        combinedSlides.push({
          id: `movie-${movie._id}`,
          title: movie.title,
          subtitle: movie.tagline || `${movie.genres?.join(', ')}`,
          image: movie.backdrop,
          buttonText: "Get Tickets",
          buttonLink: `/movies/${movie._id}`
        });
      }
    });
  }

  return (
    <div className="bg-dark">
      {/* Hero Section with Slider */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="hero-slider h-[600px] md:h-[700px]"
        >
          {combinedSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full">
                {/* Background Image with Blur Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover blur-[2px] scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/70 to-dark/90"></div>
                </div>
                
                {/* Content */}
                <div className="container relative z-10 h-full flex items-center">
                  <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link to={slide.buttonLink} className="btn btn-primary flex items-center">
                        <FaTicketAlt className="mr-2" />
                        {slide.buttonText}
                      </Link>
                      {slide.id.toString().includes('movie') && (
                        <Link to={`/movies/${slide.id.split('-')[1]}`} className="btn btn-secondary flex items-center">
                          <FaPlay className="mr-2" />
                          Watch Trailer
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Featured Movies Section */}
      <section className="py-16 bg-dark">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Featured Movies</h2>
            <Link to="/movies" className="text-primary hover:underline flex items-center">
              View All <FaFilm className="ml-2" />
            </Link>
          </div>
          <FeaturedMovies />
        </div>
      </section>

      {/* Now Playing Section */}
      <section className="py-16 bg-gradient-to-b from-dark to-secondary">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Now Playing</h2>
            <Link to="/movies" className="text-primary hover:underline flex items-center">
              View All <FaFilm className="ml-2" />
            </Link>
          </div>
          <NowPlayingMovies />
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">About MovieHub</h2>
              <p className="text-gray-300 mb-6">
                Welcome to MovieHub, your premier destination for the latest movies, events, and entertainment news. 
                We provide a seamless booking experience with the best seats, premium viewing options, and exclusive events.
              </p>
              <p className="text-gray-300 mb-8">
                Our state-of-the-art theaters offer the ultimate cinematic experience with cutting-edge technology, 
                comfortable seating, and a wide selection of refreshments to enhance your movie-going experience.
              </p>
              <Link to="/about" className="btn btn-primary">
                Learn More
              </Link>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000&auto=format&fit=crop" 
                alt="Movie Theater" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 bg-dark">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Coming Soon</h2>
            <Link to="/movies" className="text-primary hover:underline flex items-center">
              View All <FaFilm className="ml-2" />
            </Link>
          </div>
          <ComingSoonMovies />
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-gradient-to-b from-dark to-secondary">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link to="/events" className="text-primary hover:underline flex items-center">
              View All <FaCalendarAlt className="ml-2" />
            </Link>
          </div>
          <EventsPreview />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/bg-cta-1.jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for an Amazing Movie Experience?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Book your tickets now and enjoy the latest blockbusters in premium comfort with state-of-the-art sound and picture quality.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/movies" className="btn bg-white text-primary hover:bg-gray-100">
              Browse Movies
            </Link>
            <Link to="/events" className="btn bg-dark text-white hover:bg-gray-800">
              Check Events
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-dark">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Latest News</h2>
            <Link to="/news" className="text-primary hover:underline">
              View All News
            </Link>
          </div>
          <LatestNews />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Subscribe to Our Newsletter</h2>
            <p className="text-gray-300 mb-8">
              Stay updated with the latest movies, events, and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-md bg-dark border border-gray-700 text-white focus:outline-none focus:border-primary"
                required
              />
              <button type="submit" className="btn btn-primary whitespace-nowrap">
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

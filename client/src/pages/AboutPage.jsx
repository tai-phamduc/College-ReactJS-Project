import React from 'react';
import { Link } from 'react-router-dom';
import { FaFilm, FaTicketAlt, FaCalendarAlt, FaNewspaper } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="bg-dark">
      {/* Hero Section */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
            <p className="text-gray-300 text-lg mb-8">
              We are a premier movie booking platform dedicated to providing the best cinema experience for movie lovers.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-300 mb-4">
                Founded in 2023, MovieHub started with a simple mission: to make movie ticket booking easy, convenient, and enjoyable for everyone.
              </p>
              <p className="text-gray-300 mb-4">
                What began as a small startup has grown into a comprehensive platform that not only allows users to book tickets but also provides information about movies, events, and the latest news in the entertainment industry.
              </p>
              <p className="text-gray-300">
                Our team of passionate movie enthusiasts works tirelessly to ensure that our users have access to the best movies and events, with a seamless booking experience.
              </p>
            </div>
            <div className="h-80 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000&auto=format&fit=crop"
                alt="Movie theater"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-dark p-6 rounded-lg text-center">
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <FaFilm />
              </div>
              <h3 className="text-xl font-semibold mb-4">Movie Information</h3>
              <p className="text-gray-400">
                Comprehensive information about the latest movies, including trailers, cast, and ratings.
              </p>
            </div>
            <div className="bg-dark p-6 rounded-lg text-center">
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <FaTicketAlt />
              </div>
              <h3 className="text-xl font-semibold mb-4">Ticket Booking</h3>
              <p className="text-gray-400">
                Easy and convenient ticket booking for movies at theaters near you.
              </p>
            </div>
            <div className="bg-dark p-6 rounded-lg text-center">
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <FaCalendarAlt />
              </div>
              <h3 className="text-xl font-semibold mb-4">Events</h3>
              <p className="text-gray-400">
                Information about upcoming movie-related events, festivals, and special screenings.
              </p>
            </div>
            <div className="bg-dark p-6 rounded-lg text-center">
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <FaNewspaper />
              </div>
              <h3 className="text-xl font-semibold mb-4">News</h3>
              <p className="text-gray-400">
                The latest news and updates from the entertainment industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-secondary p-6 rounded-lg text-center">
              <div className="h-40 w-40 rounded-full mx-auto mb-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
                  alt="John Smith"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">John Smith</h3>
              <p className="text-primary mb-4">CEO & Founder</p>
              <p className="text-gray-400">
                A passionate movie lover with over 15 years of experience in the entertainment industry.
              </p>
            </div>
            <div className="bg-secondary p-6 rounded-lg text-center">
              <div className="h-40 w-40 rounded-full mx-auto mb-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop"
                  alt="Jane Doe"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Jane Doe</h3>
              <p className="text-primary mb-4">CTO</p>
              <p className="text-gray-400">
                A tech enthusiast who ensures that our platform is always at the cutting edge of technology.
              </p>
            </div>
            <div className="bg-secondary p-6 rounded-lg text-center">
              <div className="h-40 w-40 rounded-full mx-auto mb-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop"
                  alt="Mike Johnson"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mike Johnson</h3>
              <p className="text-primary mb-4">Head of Content</p>
              <p className="text-gray-400">
                A film critic and writer who ensures that our users have access to the best movie information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience the Best of Cinema?</h2>
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of movie lovers who use MovieHub to book tickets, discover new movies, and stay updated with the latest in the entertainment world.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/movies" className="btn bg-white text-primary hover:bg-gray-100">
              Explore Movies
            </Link>
            <Link to="/register" className="btn bg-secondary text-white hover:bg-gray-700">
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-12 pb-6">
      <div className="container mx-auto">
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-xl font-bold mb-4"><span className="text-primary">Movie</span>Hub</h3>
            <p className="text-gray-300 mb-4">
              The best movie booking platform for all your entertainment needs. Book tickets, explore events, and stay updated with the latest news.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 - Movies */}
          <div>
            <h3 className="text-xl font-bold mb-4">Movies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/movies" className="text-gray-300 hover:text-primary">
                  All Movies
                </Link>
              </li>
              <li>
                <Link to="/movies?status=Now Playing" className="text-gray-300 hover:text-primary">
                  Now Playing
                </Link>
              </li>
              <li>
                <Link to="/movies?status=Coming Soon" className="text-gray-300 hover:text-primary">
                  Coming Soon
                </Link>
              </li>
              <li>
                <Link to="/movies?status=Featured" className="text-gray-300 hover:text-primary">
                  Featured Movies
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-gray-300 hover:text-primary">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-300 hover:text-primary">
                  News
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for the latest updates on movies, events, and promotions.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 bg-dark text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary border border-gray-700"
              />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MovieHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

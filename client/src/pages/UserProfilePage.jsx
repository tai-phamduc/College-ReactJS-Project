import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaUser, FaCog, FaHeart, FaHistory, FaStar } from 'react-icons/fa';
import { authService } from '../services/api';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        // In a real app, you would fetch this data from an API
        // For now, we'll use sample data
        const sampleBookings = [
          {
            id: 'booking1',
            movieTitle: 'Avengers: Endgame',
            date: '2023-12-15',
            time: '19:30',
            seats: ['A1', 'A2'],
            total: '$24.00',
            status: 'completed'
          },
          {
            id: 'booking2',
            movieTitle: 'Spider-Man: No Way Home',
            date: '2023-12-10',
            time: '18:00',
            seats: ['B5', 'B6'],
            total: '$24.00',
            status: 'completed'
          },
          {
            id: 'booking3',
            movieTitle: 'The Matrix Resurrections',
            date: '2023-12-25',
            time: '20:15',
            seats: ['C3', 'C4', 'C5'],
            total: '$36.00',
            status: 'upcoming'
          }
        ];

        setRecentBookings(sampleBookings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const quickLinks = [
    { icon: <FaUser />, title: 'Account Details', description: 'View and edit your profile', link: '/account/edit' },
    { icon: <FaTicketAlt />, title: 'My Bookings', description: 'View your booking history', link: '/my-bookings' },
    { icon: <FaHeart />, title: 'Favorites', description: 'Your favorite movies', link: '/favorites' },
    { icon: <FaCog />, title: 'Settings', description: 'Account settings', link: '/account/reminders' },
  ];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Welcome Card */}
          <div className="bg-secondary rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user?.name || 'User'}!
              </h2>
              <p className="text-gray-400">
                Here's a quick overview of your account and recent activities.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.link}
                className="bg-secondary rounded-lg p-6 hover:bg-gray-800 transition-colors"
              >
                <div className="text-3xl text-primary mb-4">{link.icon}</div>
                <h3 className="text-xl font-bold mb-2">{link.title}</h3>
                <p className="text-gray-400">{link.description}</p>
              </Link>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="bg-secondary rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Recent Bookings</h2>
                <Link to="/my-bookings" className="text-primary hover:underline">
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-800">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="p-6 hover:bg-gray-800">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{booking.movieTitle}</h3>
                        <div className="text-sm text-gray-400 mb-2">
                          {new Date(booking.date).toLocaleDateString()} at {booking.time} • Seats: {booking.seats.join(', ')}
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              booking.status === 'completed'
                                ? 'bg-green-900 text-green-300'
                                : 'bg-blue-900 text-blue-300'
                            }`}
                          >
                            {booking.status === 'completed' ? 'Completed' : 'Upcoming'}
                          </span>
                          <span className="ml-2 text-gray-400">{booking.total}</span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Link
                          to={`/booking/${booking.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          {booking.status === 'completed' ? 'View Details' : 'Manage Booking'}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400">
                  You don't have any bookings yet.
                </div>
              )}
            </div>
          </div>

          {/* Recommended Movies */}
          <div className="bg-secondary rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Recommended For You</h2>
                <Link to="/movies" className="text-primary hover:underline">
                  View All Movies
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="bg-dark rounded-lg overflow-hidden">
                      <div className="aspect-[2/3] bg-gray-800">
                        <img
                          src={`https://placehold.co/300x450/222222/FFA500?text=Movie+${index + 1}`}
                          alt={`Recommended Movie ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-1">Recommended Movie {index + 1}</h3>
                        <div className="flex items-center text-sm text-gray-400 mb-2">
                          <FaStar className="text-yellow-500 mr-1" />
                          <span>{(Math.random() * 2 + 3).toFixed(1)}/5</span>
                        </div>
                        <Link to={`/movies/movie-${index + 1}`} className="btn btn-primary btn-sm w-full">
                          Book Now
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;

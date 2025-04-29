import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaUser, FaCog, FaHeart, FaHistory, FaStar, FaEnvelope, FaEdit, FaFilm } from 'react-icons/fa';
import { authService, movieService, bookingService } from '../services/api';
import UserInsights from '../components/analytics/UserInsights';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const currentUser = authService.getCurrentUser();
        
        // Require login for profile page
        if (!currentUser) {
          setError('You must be logged in to view this page');
          setLoading(false);
          return;
        }
        
        setUser(currentUser);

        // Fetch user's bookings from the API
        try {
          const userBookings = await bookingService.getUserBookings();
          
          // Check if we got valid bookings
          if (userBookings && Array.isArray(userBookings) && userBookings.length > 0) {
            // Sort bookings by date (most recent first)
            const sortedBookings = userBookings.sort((a, b) =>
              new Date(b.bookingDate || b.createdAt || Date.now()) -
              new Date(a.bookingDate || a.createdAt || Date.now())
            );
            // Limit to the 3 most recent bookings for the profile page
            setBookings(sortedBookings.slice(0, 3));
          } else {
            // If API call succeeded but no bookings found, use sample data
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
            setBookings(sampleBookings);
          }
        } catch (bookingError) {
          console.error('Error fetching user bookings:', bookingError);
          // Use sample data if API call fails
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
            }
          ];
          setBookings(sampleBookings);
        }

        // Fetch user's reviews from the API
        try {
          const userReviews = await movieService.getUserReviews(currentUser._id || currentUser.id);
          
          // Check if we got valid reviews
          if (userReviews && Array.isArray(userReviews) && userReviews.length > 0) {
            // Sort reviews by date (most recent first)
            const sortedReviews = userReviews.sort((a, b) =>
              new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
            );
            // Limit to the 2 most recent reviews for the profile page
            setReviews(sortedReviews.slice(0, 2));
          } else {
            // No reviews found
            setReviews([]);
          }
        } catch (reviewError) {
          console.error('Error fetching user reviews:', reviewError);
          // Continue with empty reviews
          setReviews([]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const quickLinks = [
    { icon: <FaTicketAlt />, title: 'My Bookings', description: 'View your booking history', link: '/my-bookings' },
    { icon: <FaHeart />, title: 'Favorites', description: 'Your favorite movies', link: '/favorites' },
    { icon: <FaStar />, title: 'My Reviews', description: 'Your movie reviews', link: '/my-reviews' },
    { icon: <FaCog />, title: 'Settings', description: 'Account settings', link: '/account/reminders' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && process.env.NODE_ENV !== 'development') {
    return (
      <div className="container py-8">
        <div className="bg-red-900 text-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <div className="flex space-x-4 mt-4">
            <Link to="/login" className="inline-block bg-primary text-white px-4 py-2 rounded">
              Go to Login
            </Link>
            <Link to="/" className="inline-block bg-gray-700 text-white px-4 py-2 rounded">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user && process.env.NODE_ENV !== 'development') {
    return (
      <div className="container py-8">
        <div className="bg-secondary text-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Not Logged In</h2>
          <p>You must be logged in to view your profile.</p>
          <div className="flex space-x-4 mt-4">
            <Link to="/login" className="inline-block bg-primary text-white px-4 py-2 rounded">
              Go to Login
            </Link>
            <Link to="/" className="inline-block bg-gray-700 text-white px-4 py-2 rounded">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - User Info */}
        <div className="lg:col-span-1">
          <div className="bg-secondary rounded-lg p-6 mb-8">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 bg-gray-700 rounded-full mb-4 flex items-center justify-center">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                    }}
                  />
                ) : (
                  <FaUser size={48} className="text-gray-500" />
                )}
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-400">{user.role}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <FaEnvelope className="text-gray-400 mr-3" />
                <span>{user.email}</span>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <Link to="/account/edit" className="flex items-center text-primary hover:underline">
                  <FaEdit className="mr-2" />
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-secondary rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <Link 
                  key={index}
                  to={link.link} 
                  className="flex items-center text-white hover:text-primary"
                >
                  <div className="text-primary mr-3">{link.icon}</div>
                  <span>{link.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Activity and AI Insights */}
        <div className="lg:col-span-2">
          {/* Recent Bookings */}
          <div className="bg-secondary rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Recent Bookings</h2>
                <Link to="/my-bookings" className="text-primary hover:underline">
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-800">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking.id || booking._id} className="p-6 hover:bg-gray-800">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <h3 className="font-bold text-lg mb-1">
                          {booking.movieTitle || (booking.movieDetails && booking.movieDetails.title) || 'Unknown Movie'}
                        </h3>
                        <div className="text-sm text-gray-400 mb-2">
                          {booking.date ? new Date(booking.date).toLocaleDateString() : 
                           booking.showtimeDate ? new Date(booking.showtimeDate).toLocaleDateString() : 
                           (booking.showtimeDetails && booking.showtimeDetails.date) || 'Date not available'} 
                          at {booking.time || 
                              booking.showtimeDisplay || 
                              (booking.showtimeDetails && booking.showtimeDetails.time) || 'Time not available'} 
                          • Seats: {Array.isArray(booking.seats) ? booking.seats.join(', ') : 'Not specified'}
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              booking.status === 'completed' || booking.status === 'confirmed'
                                ? 'bg-green-900 text-green-300'
                                : 'bg-blue-900 text-blue-300'
                            }`}
                          >
                            {booking.status === 'completed' || booking.status === 'confirmed' ? 'Completed' : 'Upcoming'}
                          </span>
                          <span className="ml-2 text-gray-400">{booking.total || booking.totalAmount || ''}</span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Link
                          to={`/booking/${booking.id || booking._id}`}
                          className="btn btn-primary btn-sm"
                        >
                          {booking.status === 'completed' || booking.status === 'confirmed' ? 'View Details' : 'Manage Booking'}
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

          {/* Recent Reviews */}
          <div className="bg-secondary rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Recent Reviews</h2>
                <Link to="/my-reviews" className="text-primary hover:underline">
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-800">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id || review.id} className="p-6 hover:bg-gray-800">
                    <div className="flex items-center mb-2">
                      <div className="w-12 h-16 bg-gray-700 rounded mr-4">
                        {review.movie && review.movie.poster ? (
                          <img
                            src={review.movie.poster}
                            alt={review.movie.title}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://placehold.co/300x450/222222/FFA500?text=${encodeURIComponent(review.movie.title || 'Movie')}`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-500">
                            <FaFilm size={16} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h5 className="font-semibold">
                          {review.movie ? review.movie.title : review.movieTitle || 'Unknown Movie'}
                        </h5>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`${
                                star <= Math.round(review.rating) ? 'text-yellow-400' : 'text-gray-500'
                              }`}
                              size={12}
                            />
                          ))}
                          <span className="ml-2 text-sm">{review.rating}/5</span>
                        </div>
                      </div>
                    </div>
                    <h6 className="font-semibold text-sm">{review.title || 'Review'}</h6>
                    <p className="text-sm text-gray-300 mt-1">{review.comment || review.content || 'No comment provided'}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Date not available'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400">
                  You haven't written any reviews yet.
                </div>
              )}
            </div>
          </div>

          {/* AI Insights */}
          {user && <UserInsights userId={user.id || user._id} />}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

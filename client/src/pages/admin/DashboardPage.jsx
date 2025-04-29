import React, { useState, useEffect } from 'react';
import { FaUsers, FaFilm, FaCalendarAlt, FaTicketAlt, FaNewspaper, FaComments } from 'react-icons/fa';
import { authService } from '../../services/api';
import WelcomeCard from '../../components/admin/WelcomeCard';

const DashboardPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);
  const [stats, setStats] = useState({
    users: 0,
    movies: 0,
    events: 0,
    bookings: 0,
    news: 0,
    comments: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll simulate loading and set some sample data
    const timer = setTimeout(() => {
      setStats({
        users: 1250,
        movies: 48,
        events: 23,
        bookings: 3752,
        news: 67,
        comments: 842,
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.users, icon: <FaUsers className="text-blue-500" />, change: '+12%' },
    { title: 'Movies', value: stats.movies, icon: <FaFilm className="text-red-500" />, change: '+3%' },
    { title: 'Events', value: stats.events, icon: <FaCalendarAlt className="text-green-500" />, change: '+5%' },
    { title: 'Bookings', value: stats.bookings, icon: <FaTicketAlt className="text-yellow-500" />, change: '+18%' },
    { title: 'News Articles', value: stats.news, icon: <FaNewspaper className="text-purple-500" />, change: '+7%' },
    { title: 'Comments', value: stats.comments, icon: <FaComments className="text-indigo-500" />, change: '+22%' },
  ];

  // Sample recent activities
  const recentActivities = [
    { id: 1, action: 'New user registered', user: 'John Doe', time: '5 minutes ago' },
    { id: 2, action: 'New booking created', user: 'Jane Smith', time: '15 minutes ago' },
    { id: 3, action: 'Movie updated', user: 'Admin', time: '1 hour ago' },
    { id: 4, action: 'New comment posted', user: 'Mike Johnson', time: '2 hours ago' },
    { id: 5, action: 'Event created', user: 'Admin', time: '3 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Welcome Card */}
      <WelcomeCard user={user} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-dark rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400">{stat.title}</p>
                {loading ? (
                  <div className="h-8 w-24 bg-gray-700 animate-pulse rounded mt-2"></div>
                ) : (
                  <h3 className="text-2xl font-bold mt-1">{stat.value.toLocaleString()}</h3>
                )}
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
            {!loading && (
              <div className="mt-4 text-sm">
                <span className="text-green-500">{stat.change}</span>
                <span className="text-gray-400 ml-1">since last month</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-dark rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-800">
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="p-6 flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-3/4 bg-gray-700 animate-pulse rounded mb-2"></div>
                    <div className="h-3 w-1/2 bg-gray-700 animate-pulse rounded"></div>
                  </div>
                </div>
              ))
          ) : (
            recentActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-800">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-400">by {activity.user}</p>
                  </div>
                  <div className="text-sm text-gray-400">{activity.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t border-gray-800 text-center">
          <button className="text-primary hover:underline">View All Activity</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

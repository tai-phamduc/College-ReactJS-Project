import React from 'react';
import { FaChartLine, FaFilm, FaUsers, FaCalendarAlt, FaNewspaper } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const WelcomeCard = ({ user }) => {
  const currentTime = new Date().getHours();
  let greeting = 'Good evening';
  
  if (currentTime < 12) {
    greeting = 'Good morning';
  } else if (currentTime < 18) {
    greeting = 'Good afternoon';
  }

  const quickLinks = [
    { icon: <FaFilm />, title: 'Movies', description: 'Manage movies', link: '/admin/movies' },
    { icon: <FaUsers />, title: 'Users', description: 'Manage users', link: '/admin/users' },
    { icon: <FaCalendarAlt />, title: 'Events', description: 'Manage events', link: '/admin/events' },
    { icon: <FaNewspaper />, title: 'News', description: 'Manage news', link: '/admin/news' },
    { icon: <FaChartLine />, title: 'Analytics', description: 'View analytics', link: '/admin/analytics' },
  ];

  return (
    <div className="bg-dark rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold flex items-center">
          <span className="text-primary mr-2">👋</span>
          {greeting}, {user?.name || 'Admin'}!
        </h2>
        <p className="text-gray-400 mt-2">
          Welcome to the admin dashboard. Here's a quick overview of what you can do.
        </p>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.link}
              className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="text-2xl text-primary mr-4">{link.icon}</div>
              <div>
                <h4 className="font-medium">{link.title}</h4>
                <p className="text-sm text-gray-400">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;

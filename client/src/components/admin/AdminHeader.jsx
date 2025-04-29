import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell, FaSignOutAlt, FaCog, FaUser } from 'react-icons/fa';
import { authService } from '../../services/api';

const AdminHeader = ({ user }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Sample notifications - in a real app, these would come from an API
  const notifications = [
    { id: 1, text: 'New user registered', time: '5 minutes ago', read: false },
    { id: 2, text: 'New booking created', time: '1 hour ago', read: false },
    { id: 3, text: 'System update completed', time: '2 hours ago', read: true },
  ];

  return (
    <header className="bg-dark border-b border-gray-800 py-4 px-6 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm">Welcome back, {user?.name}</p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-full hover:bg-gray-800 text-gray-300 relative"
          >
            <FaBell />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-secondary rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                <h3 className="font-medium">Notifications</h3>
                <button className="text-xs text-primary hover:underline">
                  Mark all as read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-gray-700 hover:bg-gray-800 ${
                        !notification.read ? 'bg-gray-800/50' : ''
                      }`}
                    >
                      <div className="flex justify-between">
                        <p className="text-sm">{notification.text}</p>
                        {!notification.read && (
                          <span className="h-2 w-2 bg-primary rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-gray-400">
                    No notifications
                  </div>
                )}
              </div>
              <div className="px-4 py-2 border-t border-gray-700 text-center">
                <Link to="/admin/notifications" className="text-xs text-primary hover:underline">
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={toggleUserMenu}
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-800 text-white"
          >
            <FaUserCircle className="text-xl" />
            <span className="hidden md:inline">{user?.name}</span>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-secondary rounded-md shadow-lg py-1 z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-white hover:bg-gray-700 flex items-center"
              >
                <FaUser className="mr-2" />
                My Profile
              </Link>
              <Link
                to="/admin/settings"
                className="block px-4 py-2 text-white hover:bg-gray-700 flex items-center"
              >
                <FaCog className="mr-2" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

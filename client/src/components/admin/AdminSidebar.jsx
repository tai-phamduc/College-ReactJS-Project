import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaFilm,
  FaCalendarAlt,
  FaNewspaper,
  FaUsers,
  FaTicketAlt,
  FaComments,
  FaCog,
  FaChartBar,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { path: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/admin/movies', icon: <FaFilm />, label: 'Movies' },
    { path: '/admin/events', icon: <FaCalendarAlt />, label: 'Events' },
    { path: '/admin/news', icon: <FaNewspaper />, label: 'News' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
    { path: '/admin/bookings', icon: <FaTicketAlt />, label: 'Bookings' },
    { path: '/admin/comments', icon: <FaComments />, label: 'Comments' },
    { path: '/admin/analytics', icon: <FaChartBar />, label: 'Analytics' },
    { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
  ];

  const sidebarClasses = `bg-dark h-screen ${
    collapsed ? 'w-20' : 'w-64'
  } transition-all duration-300 ease-in-out md:block`;

  const mobileSidebarClasses = `fixed inset-0 bg-dark z-50 md:hidden ${
    mobileOpen ? 'block' : 'hidden'
  }`;

  const renderMenuItems = () => (
    <ul className="mt-6 space-y-2 px-4">
      {menuItems.map((item) => (
        <li key={item.path}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
            end={item.path === '/admin'}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span className="ml-4">{item.label}</span>}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {!collapsed && (
            <div className="text-xl font-bold text-white">
              <span className="text-primary">Admin</span>Panel
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
          >
            {collapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>
        {renderMenuItems()}
      </aside>

      {/* Mobile Sidebar Toggle Button */}
      <button
        className="fixed bottom-4 right-4 z-40 p-3 rounded-full bg-primary text-white shadow-lg md:hidden"
        onClick={toggleMobileSidebar}
      >
        <FaBars />
      </button>

      {/* Mobile Sidebar */}
      <aside className={mobileSidebarClasses}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="text-xl font-bold text-white">
            <span className="text-primary">Admin</span>Panel
          </div>
          <button
            onClick={toggleMobileSidebar}
            className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        {renderMenuItems()}
      </aside>
    </>
  );
};

export default AdminSidebar;

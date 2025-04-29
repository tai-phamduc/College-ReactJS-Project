import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaUserShield, FaUser, FaUserCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll simulate loading and set some sample data
    const timer = setTimeout(() => {
      const sampleUsers = Array(20)
        .fill(0)
        .map((_, index) => ({
          _id: `user-${index + 1}`,
          name: `User ${index + 1}`,
          email: `user${index + 1}@example.com`,
          role: index === 0 ? 'admin' : index % 5 === 0 ? 'moderator' : 'user',
          isActive: index % 7 !== 0, // Some users are inactive
          createdAt: new Date(2023, index % 12, (index % 28) + 1).toISOString(),
          lastLogin: index % 3 === 0 ? new Date().toISOString() : new Date(2023, 11, 25).toISOString(),
          profilePicture: `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${(index % 10) + 1}.jpg`,
        }));

      setUsers(sampleUsers);
      setTotalPages(3); // Simulate pagination
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter and search users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const usersPerPage = 10;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaUserShield className="text-red-400" />;
      case 'moderator':
        return <FaUserCog className="text-yellow-400" />;
      default:
        return <FaUser className="text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Link
          to="/admin/users/create"
          className="btn btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add User</span>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="bg-dark text-white w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-400" />
          <select
            className="bg-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-dark rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gray-700 animate-pulse rounded-full"></div>
                          <div>
                            <div className="h-4 w-24 bg-gray-700 animate-pulse rounded mb-2"></div>
                            <div className="h-3 w-32 bg-gray-700 animate-pulse rounded"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-16 bg-gray-700 animate-pulse rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-16 bg-gray-700 animate-pulse rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-24 bg-gray-700 animate-pulse rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-24 bg-gray-700 animate-pulse rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-4 w-20 bg-gray-700 animate-pulse rounded ml-auto"></div>
                      </td>
                    </tr>
                  ))
              ) : currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user.name
                            )}&background=random`;
                          }}
                        />
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <span
                          className={`capitalize ${
                            user.role === 'admin'
                              ? 'text-red-400'
                              : user.role === 'moderator'
                              ? 'text-yellow-400'
                              : 'text-blue-400'
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.isActive
                            ? 'bg-green-900 text-green-300'
                            : 'bg-red-900 text-red-300'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/users/edit/${user._id}`}
                          className="p-2 text-yellow-400 hover:text-yellow-600 rounded-full hover:bg-gray-700"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="p-2 text-red-400 hover:text-red-600 rounded-full hover:bg-gray-700"
                          title="Delete"
                          disabled={user.role === 'admin'}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
            <div className="text-sm text-gray-400">
              Showing {indexOfFirstUser + 1} to{' '}
              {Math.min(indexOfLastUser, filteredUsers.length)} of{' '}
              {filteredUsers.length} users
            </div>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded ${
                    currentPage === number
                      ? 'bg-primary text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;

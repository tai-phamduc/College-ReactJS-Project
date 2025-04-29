import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { authService } from '../services/api';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

const AdminLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkUser();
    };

    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not logged in or not admin
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Log user info for debugging
  console.log('AdminLayout - User info:', user);

  if (user.role !== 'admin') {
    console.log('User is not admin, redirecting to profile');
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="flex h-screen bg-dark text-white overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader user={user} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-secondary">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

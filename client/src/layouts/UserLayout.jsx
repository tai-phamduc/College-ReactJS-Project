import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { authService } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatAssistant from '../components/ai/ChatAssistant';

const UserLayout = () => {
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

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ChatAssistant />
    </div>
  );
};

export default UserLayout;

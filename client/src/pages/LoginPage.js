import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { authService } from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // For development/testing purposes, add special handling for sample users
      console.log('Checking for sample user login:', { email, isDev: import.meta.env.DEV });

      // Always enable sample users for testing
      if (true &&
          (email === 'user@example.com' ||
           email === 'johndoe@example.com' ||
           email === 'janesmith@example.com') &&
          password === 'password123') {

        console.log('Sample user detected, creating mock data');

        // Create a mock user response
        const mockUserData = {
          _id: email === 'user@example.com' ? '68103f6d15a978dacd8967b8' :
               email === 'johndoe@example.com' ? '68103f8a15a978dacd8967b9' :
               '68103fae15a978dacd8967ba',
          name: email === 'user@example.com' ? 'Regular User' :
                email === 'johndoe@example.com' ? 'John Doe' :
                'Jane Smith',
          email: email,
          role: 'user',
          token: 'mock-token-' + Date.now()
        };

        // Store in localStorage
        localStorage.setItem('token', mockUserData.token);
        localStorage.setItem('user', JSON.stringify(mockUserData));

        // Dispatch auth-change event
        window.dispatchEvent(new Event('auth-change'));

        // Redirect to profile page
        navigate('/profile');
        return;
      }

      // Call the login API for real users
      console.log('Attempting to log in with real API:', { email });

      try {
        const response = await authService.login({
          email,
          password
        });

        console.log('Login successful:', response);

        // The authService.login method already handles storing the token and user data in localStorage
        // and dispatching the auth-change event

        // Redirect to profile page
        navigate('/profile');
      } catch (apiError) {
        console.error('API login error details:', apiError);
        throw apiError; // Re-throw to be caught by the outer catch block
      }
    } catch (err) {
      console.error('Login error:', err);

      // Provide more specific error messages based on the error
      if (err.response) {
        // Server responded with an error status
        console.log('Server error response:', {
          status: err.response.status,
          data: err.response.data
        });

        switch (err.response.status) {
          case 401:
            setError('Invalid email or password. Please try again.');
            break;
          case 404:
            setError('User not found. Please check your email or register a new account.');
            break;
          case 429:
            setError('Too many login attempts. Please try again later.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(err.response.data?.message || 'Login failed. Please try again.');
        }
      } else if (err.request) {
        // Request was made but no response received (network error)
        console.log('Network error - no response received:', err.request);
        setError('Network error. Please check your internet connection and try again.');
      } else {
        // Something else happened while setting up the request
        console.log('Error setting up request:', err.message);
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-secondary rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="mt-2 text-gray-400">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="bg-gray-800 text-white w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="bg-gray-800 text-white w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-primary bg-gray-800 border-gray-700 rounded focus:ring-primary"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-400">Remember me</label>
                </div>
                <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                ) : (
                  <FaSignInAlt className="mr-2" />
                )}
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

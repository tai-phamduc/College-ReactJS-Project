import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import MoviesPage from './pages/MoviesPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchResultsPage from './pages/SearchResultsPage';

// User Pages
import UserProfilePage from './pages/UserProfilePage';
import BookingPage from './pages/BookingPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import AdminMoviesPage from './pages/admin/MoviesPage';
import AdminUsersPage from './pages/admin/UsersPage';

// Home Page Components
import HeroSlider from './components/HeroSlider';
import UpcomingEvents from './components/UpcomingEvents';
import NowShowingMovies from './components/NowShowingMovies';
import ComingSoonMovies from './components/ComingSoonMovies';
import LatestNews from './components/LatestNews';

// HomePage component
const HomePage = () => (
  <div className="min-h-screen bg-dark text-white">
    {/* Hero Slider */}
    <HeroSlider />

    {/* Now Showing Movies Section */}
    <NowShowingMovies />

    {/* Coming Soon Movies Section */}
    <ComingSoonMovies />

    {/* Upcoming Events Section */}
    <UpcomingEvents />

    {/* Latest News Section */}
    <LatestNews />
  </div>
);

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/movies/:id" element={<MovieDetailsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* User Routes - Protected */}
      <Route element={<UserLayout />}>
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/booking/:id" element={<BookingPage />} />

        <Route path="/favorites" element={<div>Favorites Page</div>} />
        <Route path="/my-reviews" element={<div>My Reviews Page</div>} />
        <Route path="/account/reminders" element={<div>Reminders Settings Page</div>} />
        <Route path="/account/edit" element={<div>Edit Profile Page</div>} />
      </Route>

      {/* Admin Routes - Protected */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="movies" element={<AdminMoviesPage />} />
        <Route path="movies/create" element={<div>Create Movie Page</div>} />
        <Route path="movies/edit/:id" element={<div>Edit Movie Page</div>} />
        <Route path="events" element={<div>Admin Events Page</div>} />
        <Route path="news" element={<div>Admin News Page</div>} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="users/create" element={<div>Create User Page</div>} />
        <Route path="users/edit/:id" element={<div>Edit User Page</div>} />
        <Route path="bookings" element={<div>Admin Bookings Page</div>} />
        <Route path="comments" element={<div>Admin Comments Page</div>} />
        <Route path="analytics" element={<div>Analytics Page</div>} />
        <Route path="settings" element={<div>Admin Settings Page</div>} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={
        <PublicLayout>
          <div className="min-h-screen flex items-center justify-center bg-dark text-white">
            <div className="text-center">
              <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
              <p className="text-2xl mb-8">Page not found</p>
              <a href="/" className="btn btn-primary">Go Home</a>
            </div>
          </div>
        </PublicLayout>
      } />
    </Routes>
  );
}

export default App;

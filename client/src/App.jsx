import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MoviesPage from './pages/MoviesPage';
import EventsPage from './pages/EventsPage';
import NewsPage from './pages/NewsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import UserProfilePage from './pages/UserProfilePage';
import BookingPage from './pages/BookingPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import HeroSlider from './components/HeroSlider';
import UpcomingEvents from './components/UpcomingEvents';
import NowShowingMovies from './components/NowShowingMovies';
import ComingSoonMovies from './components/ComingSoonMovies';
import LatestNews from './components/LatestNews';
import Header from './components/Header';
import Footer from './components/Footer';

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

// Enhanced Layout
const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <Layout>
          <HomePage />
        </Layout>
      } />
      <Route path="/movies" element={
        <Layout>
          <MoviesPage />
        </Layout>
      } />
      <Route path="/movies/:id" element={
        <Layout>
          <MovieDetailsPage />
        </Layout>
      } />
      <Route path="/events" element={
        <Layout>
          <EventsPage />
        </Layout>
      } />
      <Route path="/news" element={
        <Layout>
          <NewsPage />
        </Layout>
      } />
      <Route path="/about" element={
        <Layout>
          <AboutPage />
        </Layout>
      } />
      <Route path="/contact" element={
        <Layout>
          <ContactPage />
        </Layout>
      } />
      <Route path="/profile" element={
        <Layout>
          <UserProfilePage />
        </Layout>
      } />
      <Route path="/booking/:id" element={
        <Layout>
          <BookingPage />
        </Layout>
      } />
      <Route path="*" element={
        <Layout>
          <div className="min-h-screen flex items-center justify-center bg-dark text-white">
            <div className="text-center">
              <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
              <p className="text-2xl mb-8">Page not found</p>
              <a href="/" className="btn btn-primary">Go Home</a>
            </div>
          </div>
        </Layout>
      } />
    </Routes>
  );
}

export default App;

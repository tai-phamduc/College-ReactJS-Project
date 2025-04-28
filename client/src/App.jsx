import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MoviesPage from './pages/MoviesPage';
import EventsPage from './pages/EventsPage';
import NewsPage from './pages/NewsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HeroSlider from './components/HeroSlider';
import Header from './components/Header';
import Footer from './components/Footer';

// HomePage component
const HomePage = () => (
  <div className="min-h-screen bg-dark text-white">
    {/* Hero Slider */}
    <HeroSlider />

    {/* Now Showing Section */}
    <section className="py-16 bg-dark">
      <div className="container">
        <h2 className="section-title">
          <span className="text-primary">Now</span> Showing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="card movie-card">
              <div className="aspect-[2/3] bg-light-gray overflow-hidden">
                <div className="movie-poster h-full w-full bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop')] bg-cover bg-center"></div>
              </div>
              <div className="movie-info">
                <h3 className="text-xl font-bold mb-1">Sample Movie {item}</h3>
                <div className="flex items-center mb-2">
                  <span className="text-primary mr-2">★★★★</span>
                  <span className="text-sm text-muted">4.5/5</span>
                </div>
                <p className="text-sm text-muted mb-3">Action, Adventure</p>
                <a href={`/movies/${item}`} className="btn btn-primary btn-sm">Book Now</a>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="/movies" className="btn btn-outline">View All Movies</a>
        </div>
      </div>
    </section>

    {/* Coming Soon Section */}
    <section className="py-16 bg-secondary">
      <div className="container">
        <h2 className="section-title">
          <span className="text-primary">Coming</span> Soon
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[4, 5, 6].map((item) => (
            <div key={item} className="card">
              <div className="aspect-[2/3] bg-light-gray overflow-hidden">
                <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop')] bg-cover bg-center"></div>
              </div>
              <div className="card-body">
                <h3 className="text-xl font-bold mb-2">Upcoming Movie {item}</h3>
                <p className="text-sm text-muted mb-3">Sci-Fi, Thriller</p>
                <p className="text-sm mb-4">Release Date: June 2025</p>
                <button className="btn btn-outline btn-sm">Notify Me</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
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

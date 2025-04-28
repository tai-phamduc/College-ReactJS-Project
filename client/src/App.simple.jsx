import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Simple HomePage component
const HomePage = () => (
  <div className="min-h-screen bg-dark text-white p-8">
    <h1 className="text-4xl font-bold mb-4">Welcome to MovieHub</h1>
    <p className="text-xl mb-8">Your premier destination for movies and entertainment</p>
    <div className="bg-secondary p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-primary">Now Showing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-dark p-4 rounded-lg">
            <div className="aspect-[2/3] bg-gray-800 rounded-md mb-3"></div>
            <h3 className="text-lg font-bold">Sample Movie {item}</h3>
            <p className="text-gray-400">Action, Adventure</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Simple Header component
const Header = () => (
  <header className="bg-secondary py-4 px-8">
    <div className="flex justify-between items-center">
      <div className="text-2xl font-bold text-white">
        <span className="text-primary">Movie</span>Hub
      </div>
      <nav className="hidden md:flex space-x-6">
        <a href="/" className="text-white hover:text-primary">Home</a>
        <a href="/movies" className="text-white hover:text-primary">Movies</a>
        <a href="/events" className="text-white hover:text-primary">Events</a>
      </nav>
    </div>
  </header>
);

// Simple Footer component
const Footer = () => (
  <footer className="bg-secondary py-6 px-8 text-white">
    <div className="text-center">
      <p>&copy; {new Date().getFullYear()} MovieHub. All rights reserved.</p>
    </div>
  </footer>
);

// Simple Layout
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
      <Route path="*" element={
        <Layout>
          <div className="min-h-screen flex items-center justify-center bg-dark text-white">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-xl">Page not found</p>
            </div>
          </div>
        </Layout>
      } />
    </Routes>
  );
}

export default App;

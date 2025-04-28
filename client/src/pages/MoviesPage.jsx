import React from 'react';

const MoviesPage = () => {
  return (
    <div className="min-h-screen bg-dark text-white py-16">
      <div className="container">
        <h1 className="section-title">
          <span className="text-primary">Our</span> Movies
        </h1>

        {/* Filter Section */}
        <div className="bg-secondary p-6 rounded-lg mb-8 shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filter Movies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="filter-group">
              <label className="block text-sm font-medium mb-2 text-gray-300">Genre</label>
              <div className="relative">
                <select className="w-full bg-dark border border-gray-700 text-white p-3 rounded-md appearance-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="">All Genres</option>
                  <option value="action">Action</option>
                  <option value="comedy">Comedy</option>
                  <option value="drama">Drama</option>
                  <option value="horror">Horror</option>
                  <option value="sci-fi">Sci-Fi</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="filter-group">
              <label className="block text-sm font-medium mb-2 text-gray-300">Language</label>
              <div className="relative">
                <select className="w-full bg-dark border border-gray-700 text-white p-3 rounded-md appearance-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="">All Languages</option>
                  <option value="english">English</option>
                  <option value="vietnamese">Vietnamese</option>
                  <option value="korean">Korean</option>
                  <option value="japanese">Japanese</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="filter-group">
              <label className="block text-sm font-medium mb-2 text-gray-300">Format</label>
              <div className="relative">
                <select className="w-full bg-dark border border-gray-700 text-white p-3 rounded-md appearance-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="">All Formats</option>
                  <option value="2d">2D</option>
                  <option value="3d">3D</option>
                  <option value="imax">IMAX</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="filter-group">
              <label className="block text-sm font-medium mb-2 text-gray-300">Sort By</label>
              <div className="relative">
                <select className="w-full bg-dark border border-gray-700 text-white p-3 rounded-md appearance-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="popularity">Popularity</option>
                  <option value="release_date">Release Date</option>
                  <option value="title">Title</option>
                  <option value="rating">Rating</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="btn bg-dark text-white hover:bg-gray-800 mr-3">
              Reset
            </button>
            <button className="btn btn-primary">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
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

        {/* Pagination */}
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-colors">Previous</button>
            <button className="px-4 py-2 bg-primary text-white rounded-md">1</button>
            <button className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-colors">2</button>
            <button className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-colors">3</button>
            <button className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;

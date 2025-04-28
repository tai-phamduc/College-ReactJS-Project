import React from 'react';

const NewsPage = () => {
  return (
    <div className="min-h-screen bg-dark text-white py-16">
      <div className="container">
        <h1 className="section-title">
          <span className="text-primary">Latest</span> News
        </h1>
        
        {/* Featured News */}
        <div className="bg-secondary rounded-lg overflow-hidden shadow-lg mb-12">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="h-64 md:h-full bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop')] bg-cover bg-center"></div>
            </div>
            <div className="p-8 md:w-1/2">
              <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded mb-4">Featured</span>
              <h2 className="text-2xl font-bold mb-4">Upcoming Blockbuster Movies to Watch Out For in 2025</h2>
              <p className="text-muted mb-4">Get ready for an exciting year of cinema with these highly anticipated releases that are set to dominate the box office.</p>
              <div className="flex items-center text-sm text-muted mb-6">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>May 5, 2025</span>
              </div>
              <a href="/news/1" className="btn btn-primary">Read More</a>
            </div>
          </div>
        </div>
        
        {/* News Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button className="px-4 py-2 bg-primary text-white rounded-md">All</button>
          <button className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-colors">Movie News</button>
          <button className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-colors">Industry Updates</button>
          <button className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-colors">Celebrity News</button>
          <button className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-colors">Reviews</button>
        </div>
        
        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-secondary rounded-lg overflow-hidden shadow-lg">
              <div className="h-48 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop')] bg-cover bg-center"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-muted">Movie News</span>
                  <span className="text-xs text-muted">May {item + 10}, 2025</span>
                </div>
                <h3 className="text-xl font-bold mb-3">New Casting Announcement for Upcoming Blockbuster</h3>
                <p className="text-sm text-muted mb-4">Hollywood's biggest stars are joining forces for what promises to be one of the most anticipated movies of the year.</p>
                <a href={`/news/${item}`} className="text-primary hover:underline text-sm font-medium">Read More →</a>
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

export default NewsPage;

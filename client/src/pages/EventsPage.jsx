import React from 'react';

const EventsPage = () => {
  return (
    <div className="min-h-screen bg-dark text-white py-16">
      <div className="container">
        <h1 className="section-title">
          <span className="text-primary">Upcoming</span> Events
        </h1>
        
        {/* Filter Section */}
        <div className="bg-secondary p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-2">Event Type</label>
              <select className="w-full bg-light-gray text-white p-2 rounded-md">
                <option value="">All Events</option>
                <option value="premiere">Movie Premieres</option>
                <option value="fan-meeting">Fan Meetings</option>
                <option value="festival">Film Festivals</option>
                <option value="special">Special Screenings</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2">Date</label>
              <select className="w-full bg-light-gray text-white p-2 rounded-md">
                <option value="">Any Date</option>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="next-month">Next Month</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2">Sort By</label>
              <select className="w-full bg-light-gray text-white p-2 rounded-md">
                <option value="date">Date</option>
                <option value="popularity">Popularity</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-secondary rounded-lg overflow-hidden shadow-lg">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="h-48 md:h-full bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop')] bg-cover bg-center"></div>
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">Special Screening Event {item}</h3>
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded">Premiere</span>
                  </div>
                  <div className="flex items-center text-sm text-muted mb-4">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>May 15, 2025 • 7:00 PM</span>
                  </div>
                  <p className="text-sm mb-4">Join us for the exclusive premiere of this blockbuster movie with special guest appearances and behind-the-scenes footage.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">Location: Cinema City, Hall A</span>
                    <a href={`/events/${item}`} className="btn btn-primary btn-sm">View Details</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Past Events Section */}
        <h2 className="text-2xl font-bold mb-6">
          <span className="text-primary">Past</span> Events
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {[5, 6, 7, 8].map((item) => (
            <div key={item} className="bg-secondary rounded-lg overflow-hidden shadow-lg opacity-75 hover:opacity-100 transition-opacity">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="h-48 md:h-full bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop')] bg-cover bg-center grayscale"></div>
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">Fan Meeting Event {item}</h3>
                    <span className="bg-secondary text-white text-xs px-2 py-1 rounded border border-primary">Past</span>
                  </div>
                  <div className="flex items-center text-sm text-muted mb-4">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>April 10, 2025 • 6:30 PM</span>
                  </div>
                  <p className="text-sm mb-4">A memorable evening with the cast and crew of the movie, including autograph sessions and photo opportunities.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">Location: Cinema City, Main Hall</span>
                    <a href={`/events/${item}`} className="btn btn-outline btn-sm">View Gallery</a>
                  </div>
                </div>
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
            <button className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;

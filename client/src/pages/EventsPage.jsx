import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaFilter, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { eventService } from '../services/api';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    date: '',
    sortBy: 'date'
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const allEvents = await eventService.getEvents();

        // Sort events by date
        allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Separate upcoming and past events
        const now = new Date();
        const upcoming = allEvents.filter(event => new Date(event.date) >= now);
        const past = allEvents.filter(event => new Date(event.date) < now);

        setEvents(allEvents);
        setUpcomingEvents(upcoming);
        setPastEvents(past);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters to events
  const getFilteredEvents = (eventsList) => {
    let filtered = [...eventsList];

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(event =>
        event.category === filters.category ||
        (event.categories && event.categories.includes(filters.category))
      );
    }

    // Filter by date
    if (filters.date) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const thisWeekEnd = new Date(today);
      thisWeekEnd.setDate(today.getDate() + (7 - today.getDay()));

      const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);

      switch (filters.date) {
        case 'today':
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate < tomorrow;
          });
          break;
        case 'this-week':
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate <= thisWeekEnd;
          });
          break;
        case 'this-month':
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate <= thisMonthEnd;
          });
          break;
        case 'next-month':
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate > thisMonthEnd && eventDate <= nextMonthEnd;
          });
          break;
        default:
          break;
      }
    }

    // Sort events
    switch (filters.sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'popularity':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get filtered events
  const filteredUpcomingEvents = getFilteredEvents(upcomingEvents);
  const filteredPastEvents = getFilteredEvents(pastEvents);

  return (
    <div className="min-h-screen bg-dark text-white py-16">
      <div className="container">
        <h1 className="section-title">
          <span className="text-primary">Upcoming</span> Events
        </h1>

        {/* Filter Section */}
        <div className="bg-secondary p-6 rounded-lg mb-8 shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center text-primary">
            <FaFilter className="mr-2" />
            Filter Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="filter-group">
              <label className="block text-sm font-medium mb-2 text-gray-300">Event Type</label>
              <div className="relative">
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full bg-dark border border-gray-700 text-white p-3 rounded-md appearance-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Events</option>
                  <option value="Film Festival">Film Festivals</option>
                  <option value="Premiere">Movie Premieres</option>
                  <option value="Fan Meeting">Fan Meetings</option>
                  <option value="Special Screening">Special Screenings</option>
                  <option value="Award Ceremony">Award Ceremonies</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="filter-group">
              <label className="block text-sm font-medium mb-2 text-gray-300">Date</label>
              <div className="relative">
                <select
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="w-full bg-dark border border-gray-700 text-white p-3 rounded-md appearance-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Any Date</option>
                  <option value="today">Today</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="next-month">Next Month</option>
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
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full bg-dark border border-gray-700 text-white p-3 rounded-md appearance-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="date">Date</option>
                  <option value="popularity">Popularity</option>
                  <option value="name">Name</option>
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
            <button
              className="btn bg-dark text-white hover:bg-gray-800 mr-3"
              onClick={() => setFilters({ category: '', date: '', sortBy: 'date' })}
            >
              Reset
            </button>
            <button className="btn btn-primary">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-8">
            <p className="text-center">{error}</p>
          </div>
        ) : (
          <>
            {/* Upcoming Events Grid */}
            {filteredUpcomingEvents.length === 0 ? (
              <div className="bg-secondary p-8 rounded-lg text-center mb-12">
                <h3 className="text-xl mb-2">No upcoming events found</h3>
                <p className="text-gray-400">Try adjusting your filters or check back later for new events.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {filteredUpcomingEvents.map((event) => (
                  <div key={event._id} className="bg-secondary rounded-lg overflow-hidden shadow-lg">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <div
                          className="h-48 md:h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${event.image})` }}
                        ></div>
                      </div>
                      <div className="p-6 md:w-2/3">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold">{event.title}</h3>
                          <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                            {event.category || 'Event'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400 mb-2">
                          <FaCalendarAlt className="mr-2" />
                          <span>{formatDate(event.date)} • {event.startTime}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400 mb-4">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <p className="text-sm mb-4">
                          {event.shortDescription || event.description.substring(0, 120) + '...'}
                        </p>
                        <div className="flex justify-between items-center">
                          {event.featured && (
                            <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">Featured</span>
                          )}
                          <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Past Events Section */}
            {filteredPastEvents.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mb-6">
                  <span className="text-primary">Past</span> Events
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {filteredPastEvents.map((event) => (
                    <div key={event._id} className="bg-secondary rounded-lg overflow-hidden shadow-lg opacity-75 hover:opacity-100 transition-opacity">
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <div
                            className="h-48 md:h-full bg-cover bg-center grayscale"
                            style={{ backgroundImage: `url(${event.image})` }}
                          ></div>
                        </div>
                        <div className="p-6 md:w-2/3">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold">{event.title}</h3>
                            <span className="bg-secondary text-white text-xs px-2 py-1 rounded border border-primary">
                              Past
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400 mb-2">
                            <FaCalendarAlt className="mr-2" />
                            <span>{formatDate(event.date)} • {event.startTime}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400 mb-4">
                            <FaMapMarkerAlt className="mr-2" />
                            <span>{event.location}</span>
                          </div>
                          <p className="text-sm mb-4">
                            {event.shortDescription || event.description.substring(0, 120) + '...'}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">
                              {event.venue || event.location}
                            </span>
                            <Link to={`/events/${event._id}`} className="btn btn-outline btn-sm">
                              View Gallery
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Pagination - Only show if we have events and not loading */}
        {!loading && !error && (filteredUpcomingEvents.length > 0 || filteredPastEvents.length > 0) && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-md transition-colors ${
                  filteredUpcomingEvents.length > 0 || filteredPastEvents.length > 0
                    ? 'bg-secondary text-white hover:bg-primary'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                disabled={filteredUpcomingEvents.length === 0 && filteredPastEvents.length === 0}
              >
                Previous
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-md">1</button>
              <button
                className={`px-4 py-2 rounded-md transition-colors ${
                  filteredUpcomingEvents.length > 10 || filteredPastEvents.length > 10
                    ? 'bg-secondary text-white hover:bg-primary'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                disabled={filteredUpcomingEvents.length <= 10 && filteredPastEvents.length <= 10}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;

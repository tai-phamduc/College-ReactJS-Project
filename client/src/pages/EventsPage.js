import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTicketAlt, FaSearch } from 'react-icons/fa';
import { eventService } from '../services/api';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        console.log('Fetching events...');
        const eventsData = await eventService.getEvents();
        console.log('Events data:', eventsData);
        setEvents(eventsData);
        setFilteredEvents(eventsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events based on search query and active tab
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by event date
    const now = new Date();
    if (activeTab === 'upcoming') {
      filtered = filtered.filter(item => {
        // Use startDate if available, otherwise fall back to date
        const eventDate = item.startDate ? new Date(item.startDate) : (item.date ? new Date(item.date) : null);
        return eventDate && eventDate > now;
      });
    } else if (activeTab === 'past') {
      filtered = filtered.filter(item => {
        // Use startDate if available, otherwise fall back to date
        const eventDate = item.startDate ? new Date(item.startDate) : (item.date ? new Date(item.date) : null);
        return eventDate && eventDate < now;
      });
    }

    // Sort upcoming events by date (ascending)
    if (activeTab === 'upcoming') {
      filtered.sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate) : (a.date ? new Date(a.date) : new Date(0));
        const dateB = b.startDate ? new Date(b.startDate) : (b.date ? new Date(b.date) : new Date(0));
        return dateA - dateB;
      });
    }
    // Sort past events by date (descending)
    else if (activeTab === 'past') {
      filtered.sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate) : (a.date ? new Date(a.date) : new Date(0));
        const dateB = b.startDate ? new Date(b.startDate) : (b.date ? new Date(b.date) : new Date(0));
        return dateB - dateA;
      });
    }

    setFilteredEvents(filtered);
  }, [searchQuery, activeTab, events]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="bg-dark min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark min-h-screen py-12">
        <div className="container">
          <div className="bg-red-900 text-white p-6 rounded-lg max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-dark min-h-screen">
      <div className="container">
        <h1 className="text-4xl font-bold mb-6 text-center">Theater Events</h1>
        <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto">
          Discover special events, premieres, and exclusive screenings at our theaters.
        </p>

        {/* Search */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events by title, description or location..."
              className="w-full bg-gray-800 text-white px-4 py-3 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={handleSearch}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-secondary rounded-lg p-1 inline-flex shadow-md">
            <button
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'upcoming'
                  ? 'bg-primary text-white shadow-inner'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upcoming Events
              </div>
            </button>
            <button
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'past'
                  ? 'bg-primary text-white shadow-inner'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('past')}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Past Events
              </div>
            </button>
            <button
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-primary text-white shadow-inner'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('all')}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                All Events
              </div>
            </button>
          </div>
        </div>

        {/* Events List */}
        {filteredEvents.length > 0 ? (
          <div className="space-y-6">
            {filteredEvents.map((event) => {
              const eventDate = event.startDate ? new Date(event.startDate) : (event.date ? new Date(event.date) : null);
              const isUpcoming = eventDate && eventDate > new Date();

              return (
                <div
                  key={event._id}
                  className={`bg-secondary rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl ${!isUpcoming ? 'border-l-4 border-gray-600' : ''}`}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      <img
                        src={event.featuredImage || event.image || `https://via.placeholder.com/800x450/1A202C/FFFFFF?text=${encodeURIComponent(event.title)}`}
                        alt={event.title}
                        className={`w-full h-full object-cover ${!isUpcoming ? 'opacity-80 grayscale-[30%]' : ''}`}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/800x450/1A202C/FFFFFF?text=${encodeURIComponent(event.title)}`;
                        }}
                      />
                      {!isUpcoming && (
                        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 flex items-center justify-center">
                          <span className="sr-only">Past Event</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 md:w-2/3">
                      <div className="flex flex-wrap justify-between items-start mb-3">
                        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                        {isUpcoming ? (
                          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Upcoming
                          </span>
                        ) : (
                          <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Past Event
                          </span>
                        )}
                      </div>

                      <p className={`${isUpcoming ? 'text-gray-400' : 'text-gray-500'} mb-4 line-clamp-2`}>
                        {event.shortDescription || event.description}
                        {!isUpcoming && event.organizer && (
                          <span className="block mt-1 text-sm italic">Organized by: {event.organizer}</span>
                        )}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center text-gray-300">
                          <FaCalendarAlt className={`mr-2 ${isUpcoming ? 'text-primary' : 'text-gray-500'}`} />
                          <span>
                            {formatDate(event.startDate || event.date)}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-300">
                          <FaClock className={`mr-2 ${isUpcoming ? 'text-primary' : 'text-gray-500'}`} />
                          <span>
                            {event.startTime && event.endTime
                              ? `${event.startTime} - ${event.endTime}`
                              : event.startDate && event.endDate
                                ? `${new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(event.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                                : 'Time not specified'
                            }
                          </span>
                        </div>

                        <div className="flex items-center text-gray-300">
                          <FaMapMarkerAlt className={`mr-2 ${isUpcoming ? 'text-primary' : 'text-gray-500'}`} />
                          <span>{event.location || 'Location not specified'}</span>
                          {!isUpcoming && event.venue && (
                            <span className="ml-1 text-gray-500">({event.venue})</span>
                          )}
                        </div>

                        {(event.ticketPrice || event.ticketPrice === 0) && (
                          <div className="flex items-center text-gray-300">
                            <FaTicketAlt className={`mr-2 ${isUpcoming ? 'text-primary' : 'text-gray-500'}`} />
                            <span>
                              {typeof event.ticketPrice === 'number'
                                ? `$${event.ticketPrice.toFixed(2)}`
                                : event.ticketPrice}
                              {!isUpcoming && event.capacity &&
                                ` · ${event.attendees || 0}/${event.capacity} attended`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Link
                          to={`/events/${event._id}`}
                          className={`btn ${isUpcoming ? 'btn-primary' : 'bg-gray-600 hover:bg-gray-700'}`}
                        >
                          {isUpcoming ? 'View Details' : 'View Past Event'}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-secondary rounded-lg">
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl mb-4">No events found</h3>
              <p className="text-gray-400 max-w-md">
                {searchQuery
                  ? 'Try adjusting your search criteria or try different keywords.'
                  : activeTab === 'upcoming'
                    ? 'No upcoming events scheduled at this time. Check back later for new events!'
                    : activeTab === 'past'
                      ? 'No past events to display. Our event history will appear here.'
                      : 'No events available at this time. Please check back later.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;

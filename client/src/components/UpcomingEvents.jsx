import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { eventService } from '../services/api';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        console.log('UpcomingEvents: Fetching upcoming events...');

        // Use the dedicated method for upcoming events
        const upcomingEvents = await eventService.getUpcomingEvents(3);
        console.log('UpcomingEvents: Events data:', upcomingEvents);

        // Sort events by date if needed
        const sortedEvents = [...upcomingEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sortedEvents.slice(0, 3)); // Limit to 3 events for the home page

        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        console.error('Error details:', err.message, err.stack);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section className="py-16 bg-dark">
      <div className="container">
        <h2 className="section-title">
          <span className="text-primary">Upcoming</span> Events
        </h2>

        {/* Loading and Error States */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-8">
            <p className="text-center">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-secondary p-8 rounded-lg text-center mb-12">
            <h3 className="text-xl mb-2">No upcoming events found</h3>
            <p className="text-gray-400">Check back later for new events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event._id} className="bg-secondary rounded-lg overflow-hidden shadow-lg h-full flex flex-col">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={
                      event.image ||
                      event.images?.[0] ||
                      event.imageUrl ||
                      event.featuredImage ||
                      `https://placehold.co/800x450/222222/FFA500?text=${encodeURIComponent(event.title || 'Event')}`
                    }
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      // Try with http if https fails
                      if (e.target.src.startsWith('https://')) {
                        const httpUrl = e.target.src.replace('https://', 'http://');
                        console.log('Trying HTTP URL instead:', httpUrl);
                        e.target.src = httpUrl;
                      } else {
                        // Use a placeholder with the event title
                        e.target.src = `https://placehold.co/800x450/222222/FFA500?text=${encodeURIComponent(event.title || 'Event')}`;
                      }
                    }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-2">
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                      {event.category || 'Event'}
                    </span>
                    {event.featured && (
                      <span className="ml-2 text-xs bg-yellow-600 text-white px-2 py-1 rounded">Featured</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <FaCalendarAlt className="mr-2" />
                    <span>{formatDate(event.date)} • {event.startTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <p className="text-sm mb-4 flex-grow">
                    {event.shortDescription ||
                     (event.description && typeof event.description === 'string' ? event.description.substring(0, 120) + '...' : '') ||
                     'Join us for this exciting event. More details coming soon.'}
                  </p>
                  <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm self-start">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/events" className="btn btn-outline">View All Events</Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;

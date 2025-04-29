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
        console.log('UpcomingEvents: Fetching events...');
        const allEvents = await eventService.getEvents();
        console.log('UpcomingEvents: API response type:', typeof allEvents);
        console.log('UpcomingEvents: API response keys:', allEvents ? Object.keys(allEvents) : 'null');
        console.log('UpcomingEvents: API response:', allEvents);

        // Kiểm tra chi tiết cấu trúc dữ liệu
        let eventsArray = [];

        if (Array.isArray(allEvents)) {
          console.log('UpcomingEvents: Response is an array with length:', allEvents.length);
          eventsArray = allEvents;
        } else if (allEvents && typeof allEvents === 'object') {
          console.log('UpcomingEvents: Response is an object');

          // Kiểm tra nếu response có thuộc tính events
          if (allEvents.events && Array.isArray(allEvents.events)) {
            console.log('UpcomingEvents: Found events array in response with length:', allEvents.events.length);
            eventsArray = allEvents.events;
          } else {
            // Kiểm tra tất cả các thuộc tính của response để tìm mảng
            for (const key in allEvents) {
              if (Array.isArray(allEvents[key])) {
                console.log(`UpcomingEvents: Found array in response.${key} with length:`, allEvents[key].length);
                if (allEvents[key].length > 0 && allEvents[key][0].title && allEvents[key][0].date) {
                  console.log(`UpcomingEvents: Array in response.${key} contains event objects`);
                  eventsArray = allEvents[key];
                  break;
                }
              }
            }

            // Nếu không tìm thấy mảng nào, kiểm tra xem response có phải là một event object không
            if (eventsArray.length === 0 && allEvents.title && allEvents.date) {
              console.log('UpcomingEvents: Response is a single event object');
              eventsArray = [allEvents];
            }
          }
        }

        console.log('UpcomingEvents: Events array after processing:', eventsArray);

        // Sort events by date
        if (eventsArray.length > 0) {
          eventsArray.sort((a, b) => new Date(a.date) - new Date(b.date));
          console.log('UpcomingEvents: Sorted events:', eventsArray);
        }

        // Get only upcoming events
        const now = new Date();
        console.log('UpcomingEvents: Current date for filtering:', now);

        // Include all events for now to debug
        const upcoming = eventsArray;
        console.log('UpcomingEvents: All events for display:', upcoming);

        // Sử dụng dữ liệu mẫu nếu không có dữ liệu từ API
        if (upcoming.length === 0) {
          console.log('UpcomingEvents: No events data found, using sample data');
          const sampleEvents = [
            {
              _id: '1',
              title: 'Sample Event 1',
              date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
              startTime: '10:00 AM',
              location: 'Sample Location 1',
              category: 'Sample Category',
              image: 'https://via.placeholder.com/800x600?text=Sample+Event+1',
              shortDescription: 'This is a sample event description.'
            },
            {
              _id: '2',
              title: 'Sample Event 2',
              date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
              startTime: '2:00 PM',
              location: 'Sample Location 2',
              category: 'Sample Category',
              image: 'https://via.placeholder.com/800x600?text=Sample+Event+2',
              shortDescription: 'This is another sample event description.'
            },
            {
              _id: '3',
              title: 'Sample Event 3',
              date: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
              startTime: '7:00 PM',
              location: 'Sample Location 3',
              category: 'Sample Category',
              image: 'https://via.placeholder.com/800x600?text=Sample+Event+3',
              shortDescription: 'This is yet another sample event description.'
            }
          ];
          setEvents(sampleEvents);
        } else {
          // Limit to 3 events for the home page
          setEvents(upcoming.slice(0, 3));
        }

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

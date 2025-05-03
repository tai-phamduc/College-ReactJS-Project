import React from 'react';
import { Link } from 'react-router-dom';
import ChatbotFixed from '../components/ChatbotFixed';

const SimplePage = () => {

  return (
    <div className="min-h-screen bg-dark text-white">

      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark to-transparent z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop)` }}
        ></div>
        <div className="container relative z-20 flex flex-col justify-center h-full">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-primary">Experience</span> the Magic of Cinema
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">Your premier destination for movies and entertainment</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/movies" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold transition-colors">
              Browse Movies
            </Link>
            <Link to="/events" className="border border-white hover:border-orange-500 hover:text-orange-500 text-white px-6 py-3 rounded-lg font-bold transition-colors">
              Upcoming Events
            </Link>
          </div>
        </div>
      </section>

      {/* Now Showing Movies Section */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">
            <span className="text-orange-500">Now</span> Showing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Movie Card 1 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src="https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg"
                  alt="Dune: Part Two"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">Dune: Part Two</h3>
                <div className="flex items-center mb-2">
                  <span className="text-orange-500 mr-2">★★★★★</span>
                  <span className="text-sm text-gray-400">4.8/5</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">Science Fiction, Adventure, Drama</p>
                <Link to="/movies/1" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-bold inline-block">
                  Book Now
                </Link>
              </div>
            </div>

            {/* Movie Card 2 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src="https://image.tmdb.org/t/p/w500/qmgBw1hRi5UxPxzqNL5MjPEjJoN.jpg"
                  alt="Godzilla x Kong: The New Empire"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">Godzilla x Kong: The New Empire</h3>
                <div className="flex items-center mb-2">
                  <span className="text-orange-500 mr-2">★★★★</span>
                  <span className="text-sm text-gray-400">4.2/5</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">Action, Science Fiction, Adventure</p>
                <Link to="/movies/2" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-bold inline-block">
                  Book Now
                </Link>
              </div>
            </div>

            {/* Movie Card 3 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src="https://image.tmdb.org/t/p/w500/5MpUoQz67pzO1T3Isid0uFZZEuF.jpg"
                  alt="Ghostbusters: Frozen Empire"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">Ghostbusters: Frozen Empire</h3>
                <div className="flex items-center mb-2">
                  <span className="text-orange-500 mr-2">★★★★</span>
                  <span className="text-sm text-gray-400">3.9/5</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">Comedy, Fantasy, Adventure</p>
                <Link to="/movies/3" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-bold inline-block">
                  Book Now
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/movies" className="border border-white hover:border-orange-500 hover:text-orange-500 text-white px-6 py-3 rounded-lg font-bold transition-colors">
              View All Movies
            </Link>
          </div>
        </div>
      </section>

      {/* Coming Soon Movies Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">
            <span className="text-orange-500">Coming</span> Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Movie Card 1 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src="https://image.tmdb.org/t/p/w500/vBZ0qvaRxqEhZwl6LWmruJqWE8Z.jpg"
                  alt="Furiosa: A Mad Max Saga"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">Furiosa: A Mad Max Saga</h3>
                <p className="text-sm text-gray-400 mb-3">Action, Adventure, Science Fiction</p>
                <p className="text-sm text-orange-500 mb-3">Release Date: May 24, 2024</p>
                <Link to="/movies/4" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-bold inline-block">
                  More Info
                </Link>
              </div>
            </div>

            {/* Movie Card 2 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src="https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg"
                  alt="Inside Out 2"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">Inside Out 2</h3>
                <p className="text-sm text-gray-400 mb-3">Animation, Comedy, Family</p>
                <p className="text-sm text-orange-500 mb-3">Release Date: June 14, 2024</p>
                <Link to="/movies/5" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-bold inline-block">
                  More Info
                </Link>
              </div>
            </div>

            {/* Movie Card 3 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src="https://image.tmdb.org/t/p/w500/jLLtx3nTRSLGPAKl4RoIv1FbEBr.jpg"
                  alt="A Quiet Place: Day One"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">A Quiet Place: Day One</h3>
                <p className="text-sm text-gray-400 mb-3">Horror, Science Fiction, Thriller</p>
                <p className="text-sm text-orange-500 mb-3">Release Date: June 28, 2024</p>
                <Link to="/movies/6" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-bold inline-block">
                  More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">
            <span className="text-orange-500">Upcoming</span> Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Event Card 1 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <img
                  src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000&auto=format&fit=crop"
                  alt="Film Festival 2024"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 md:w-2/3">
                <h3 className="text-xl font-bold mb-1">Film Festival 2024</h3>
                <p className="text-sm text-orange-500 mb-2">June 15-20, 2024</p>
                <p className="text-sm text-gray-400 mb-3">Join us for a week-long celebration of cinema featuring special screenings, director Q&As, and workshops.</p>
                <Link to="/events/1" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-bold inline-block">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <img
                  src="https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000&auto=format&fit=crop"
                  alt="Marvel Movie Marathon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 md:w-2/3">
                <h3 className="text-xl font-bold mb-1">Marvel Movie Marathon</h3>
                <p className="text-sm text-orange-500 mb-2">July 4-5, 2024</p>
                <p className="text-sm text-gray-400 mb-3">Experience the entire Marvel Cinematic Universe in one epic 48-hour marathon with special themed concessions.</p>
                <Link to="/events/2" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-bold inline-block">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">
            <span className="text-orange-500">Latest</span> News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* News Card 1 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop"
                alt="New IMAX Screen"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">New IMAX Screen Coming Soon</h3>
                <p className="text-sm text-gray-400 mb-3">May 10, 2024</p>
                <p className="text-sm text-gray-300 mb-3">We're excited to announce the installation of a state-of-the-art IMAX screen at our main location.</p>
                <Link to="/news/1" className="text-orange-500 hover:text-orange-400 text-sm font-bold">
                  Read More →
                </Link>
              </div>
            </div>

            {/* News Card 2 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1460881680858-30d872d5b530?q=80&w=1000&auto=format&fit=crop"
                alt="Summer Movie Pass"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">Summer Movie Pass Now Available</h3>
                <p className="text-sm text-gray-400 mb-3">May 5, 2024</p>
                <p className="text-sm text-gray-300 mb-3">Get unlimited movies all summer long with our special Summer Movie Pass, available for a limited time.</p>
                <Link to="/news/2" className="text-orange-500 hover:text-orange-400 text-sm font-bold">
                  Read More →
                </Link>
              </div>
            </div>

            {/* News Card 3 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop"
                alt="Director's Talk"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">Exclusive Director's Talk Event</h3>
                <p className="text-sm text-gray-400 mb-3">April 28, 2024</p>
                <p className="text-sm text-gray-300 mb-3">Join us for an exclusive Q&A session with award-winning director Christopher Nolan on June 12.</p>
                <Link to="/news/3" className="text-orange-500 hover:text-orange-400 text-sm font-bold">
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <ChatbotFixed />
    </div>
  );
};

export default SimplePage;

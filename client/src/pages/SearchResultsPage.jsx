import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaFilm, FaNewspaper } from 'react-icons/fa';
import api from '../services/api';
import '../styles/SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({
    movies: [],
    events: [],
    news: [],
    totals: { movies: 0, events: 0, news: 0, all: 0 }
  });
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
        setResults(response.data);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderMovies = () => {
    if (results.movies.length === 0) {
      return <p className="no-results">No movies found matching "{query}"</p>;
    }

    return (
      <div className="search-results-grid">
        {results.movies.map((movie) => (
          <div key={movie._id} className="search-result-card">
            <Link to={`/movies/${movie._id}`} className="search-result-link">
              <div className="search-result-image">
                <img src={movie.poster} alt={movie.title} />
              </div>
              <div className="search-result-content">
                <h3 className="search-result-title">{movie.title}</h3>
                <div className="search-result-meta">
                  <span className="search-result-year">
                    {new Date(movie.releaseDate).getFullYear()}
                  </span>
                  {movie.duration && (
                    <span className="search-result-duration">
                      <FaClock className="icon" /> {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                    </span>
                  )}
                </div>
                {movie.genre && (
                  <div className="search-result-genres">
                    {movie.genre.slice(0, 3).map((genre, index) => (
                      <span key={index} className="genre-tag">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
                <p className="search-result-description">
                  {movie.shortDescription || movie.description.substring(0, 120)}
                  {(movie.shortDescription && movie.shortDescription.length > 120) || 
                   (!movie.shortDescription && movie.description.length > 120) ? '...' : ''}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    );
  };

  const renderEvents = () => {
    if (results.events.length === 0) {
      return <p className="no-results">No events found matching "{query}"</p>;
    }

    return (
      <div className="search-results-grid">
        {results.events.map((event) => (
          <div key={event._id} className="search-result-card">
            <Link to={`/events/${event._id}`} className="search-result-link">
              <div className="search-result-image">
                <img src={event.image} alt={event.title} />
              </div>
              <div className="search-result-content">
                <h3 className="search-result-title">{event.title}</h3>
                <div className="search-result-meta">
                  <span className="search-result-date">
                    <FaCalendarAlt className="icon" /> {formatDate(event.date)}
                  </span>
                  <span className="search-result-location">
                    {event.venue || event.location}
                  </span>
                </div>
                {event.category && (
                  <div className="search-result-categories">
                    <span className="category-tag">{event.category}</span>
                  </div>
                )}
                <p className="search-result-description">
                  {event.shortDescription || event.description.substring(0, 120)}
                  {(event.shortDescription && event.shortDescription.length > 120) || 
                   (!event.shortDescription && event.description.length > 120) ? '...' : ''}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    );
  };

  const renderNews = () => {
    if (results.news.length === 0) {
      return <p className="no-results">No news found matching "{query}"</p>;
    }

    return (
      <div className="search-results-grid">
        {results.news.map((news) => (
          <div key={news._id} className="search-result-card">
            <Link to={`/news/${news._id}`} className="search-result-link">
              <div className="search-result-image">
                <img src={news.featuredImage} alt={news.title} />
              </div>
              <div className="search-result-content">
                <h3 className="search-result-title">{news.title}</h3>
                <div className="search-result-meta">
                  <span className="search-result-date">
                    {formatDate(news.publishDate)}
                  </span>
                  {news.category && (
                    <span className="search-result-category">
                      {news.category}
                    </span>
                  )}
                </div>
                <p className="search-result-description">
                  {news.excerpt || news.content.substring(0, 120)}
                  {(news.excerpt && news.excerpt.length > 120) || 
                   (!news.excerpt && news.content.length > 120) ? '...' : ''}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="loading">Loading search results...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (!query) {
      return <div className="no-query">Please enter a search term</div>;
    }

    if (results.totals.all === 0) {
      return (
        <div className="no-results-container">
          <h2>No results found for "{query}"</h2>
          <p>Try different keywords or check your spelling</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'movies':
        return renderMovies();
      case 'events':
        return renderEvents();
      case 'news':
        return renderNews();
      default:
        return (
          <>
            {results.movies.length > 0 && (
              <div className="search-section">
                <div className="section-header">
                  <h2>
                    <FaFilm className="section-icon" /> Movies
                  </h2>
                  {results.totals.movies > 3 && (
                    <button 
                      className="view-all-button"
                      onClick={() => setActiveTab('movies')}
                    >
                      View all {results.totals.movies} movies
                    </button>
                  )}
                </div>
                {renderMovies()}
              </div>
            )}

            {results.events.length > 0 && (
              <div className="search-section">
                <div className="section-header">
                  <h2>
                    <FaCalendarAlt className="section-icon" /> Events
                  </h2>
                  {results.totals.events > 3 && (
                    <button 
                      className="view-all-button"
                      onClick={() => setActiveTab('events')}
                    >
                      View all {results.totals.events} events
                    </button>
                  )}
                </div>
                {renderEvents()}
              </div>
            )}

            {results.news.length > 0 && (
              <div className="search-section">
                <div className="section-header">
                  <h2>
                    <FaNewspaper className="section-icon" /> News
                  </h2>
                  {results.totals.news > 3 && (
                    <button 
                      className="view-all-button"
                      onClick={() => setActiveTab('news')}
                    >
                      View all {results.totals.news} news articles
                    </button>
                  )}
                </div>
                {renderNews()}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="search-results-page">
      <div className="search-header">
        <h1>Search Results for "{query}"</h1>
        <div className="search-tabs">
          <button
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({results.totals.all || 0})
          </button>
          <button
            className={`tab-button ${activeTab === 'movies' ? 'active' : ''}`}
            onClick={() => setActiveTab('movies')}
          >
            Movies ({results.totals.movies || 0})
          </button>
          <button
            className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Events ({results.totals.events || 0})
          </button>
          <button
            className={`tab-button ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            News ({results.totals.news || 0})
          </button>
        </div>
      </div>

      <div className="search-results-container">
        {renderContent()}
      </div>
    </div>
  );
};

export default SearchResultsPage;

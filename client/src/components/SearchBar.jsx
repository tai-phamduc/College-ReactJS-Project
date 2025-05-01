import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import api from '../services/api';
import '../styles/SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get(`/search/autocomplete?query=${encodeURIComponent(query)}&limit=6`);
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    switch (suggestion.type) {
      case 'movie':
        navigate(`/movies/${suggestion.id}`);
        break;
      case 'event':
        navigate(`/events/${suggestion.id}`);
        break;
      case 'news':
        navigate(`/news/${suggestion.id}`);
        break;
      default:
        navigate(`/search?q=${encodeURIComponent(suggestion.title)}`);
    }
    setShowSuggestions(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search movies, events, news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
            className="search-input"
          />
          {query && (
            <button type="button" className="clear-button" onClick={clearSearch}>
              <FaTimes />
            </button>
          )}
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-container">
          <ul className="suggestions-list">
            {suggestions.map((suggestion) => (
              <li
                key={`${suggestion.type}-${suggestion.id}`}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.image && (
                  <div className="suggestion-image">
                    <img src={suggestion.image} alt={suggestion.title} />
                  </div>
                )}
                <div className="suggestion-content">
                  <div className="suggestion-title">{suggestion.title}</div>
                  <div className="suggestion-type">
                    {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
                    {suggestion.type === 'movie' && suggestion.releaseDate && 
                      ` (${new Date(suggestion.releaseDate).getFullYear()})`}
                    {suggestion.type === 'event' && suggestion.date && 
                      ` (${new Date(suggestion.date).toLocaleDateString()})`}
                  </div>
                </div>
              </li>
            ))}
            <li className="view-all-results" onClick={handleSearch}>
              View all results for "{query}"
            </li>
          </ul>
        </div>
      )}

      {isLoading && (
        <div className="suggestions-container">
          <div className="loading-indicator">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import { newsService } from '../services/api';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState(['All', 'Movie News', 'Industry Updates', 'Celebrity News', 'Reviews']);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const allNews = await newsService.getNews();

        // Find featured news
        const featured = allNews.find(item => item.featured);
        if (featured) {
          setFeaturedNews(featured);
        }

        // Get all news
        setNews(allNews);

        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(allNews.map(item => item.category).filter(Boolean))];
        if (uniqueCategories.length > 1) {
          setCategories(uniqueCategories);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Filter news by category
  const filteredNews = activeCategory === 'All'
    ? news
    : news.filter(item => item.category === activeCategory);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Total pages
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-dark text-white py-16">
      <div className="container">
        <h1 className="section-title">
          <span className="text-primary">Latest</span> News
        </h1>

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
            {/* Featured News */}
            {featuredNews && (
              <div className="bg-secondary rounded-lg overflow-hidden shadow-lg mb-12">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div
                      className="h-64 md:h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${featuredNews.featuredImage || `https://via.placeholder.com/800x600?text=${encodeURIComponent(featuredNews.title)}`})` }}
                    ></div>
                  </div>
                  <div className="p-8 md:w-1/2">
                    <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded mb-4">Featured</span>
                    <h2 className="text-2xl font-bold mb-4">{featuredNews.title}</h2>
                    <p className="text-muted mb-4">{featuredNews.excerpt || featuredNews.content.substring(0, 150) + '...'}</p>
                    <div className="flex items-center text-sm text-muted mb-6">
                      <FaCalendarAlt className="mr-2" />
                      <span>{formatDate(featuredNews.publishDate)}</span>
                    </div>
                    <Link to={`/news/${featuredNews._id}`} className="btn btn-primary">Read More</Link>
                  </div>
                </div>
              </div>
            )}

            {/* News Categories */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-secondary text-white hover:bg-primary'
                  }`}
                  onClick={() => {
                    setActiveCategory(category);
                    setCurrentPage(1);
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* News Grid */}
            {currentItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {currentItems.map((item) => (
                  <div key={item._id} className="bg-secondary rounded-lg overflow-hidden shadow-lg">
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.featuredImage || `https://via.placeholder.com/800x600?text=${encodeURIComponent(item.title)}`})` }}
                    ></div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-muted">{item.category || 'News'}</span>
                        <span className="text-xs text-muted">{formatDate(item.publishDate)}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-sm text-muted mb-4">{item.excerpt || item.content.substring(0, 100) + '...'}</p>
                      <Link to={`/news/${item._id}`} className="text-primary hover:underline text-sm font-medium">Read More →</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-secondary p-8 rounded-lg text-center mb-12">
                <h3 className="text-xl mb-2">No news articles found</h3>
                <p className="text-gray-400">Try selecting a different category or check back later for updates.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <button
                    className={`px-4 py-2 rounded-md transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-secondary text-white hover:bg-primary'
                    }`}
                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  {[...Array(totalPages).keys()].map(number => (
                    <button
                      key={number + 1}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        currentPage === number + 1
                          ? 'bg-primary text-white'
                          : 'bg-secondary text-white hover:bg-primary'
                      }`}
                      onClick={() => paginate(number + 1)}
                    >
                      {number + 1}
                    </button>
                  ))}

                  <button
                    className={`px-4 py-2 rounded-md transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-secondary text-white hover:bg-primary'
                    }`}
                    onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsPage;

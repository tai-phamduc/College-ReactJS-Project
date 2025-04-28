import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsService } from '../services/api';

const LatestNews = ({ limit = 3 }) => {
  const [news, setNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const allNews = await newsService.getNews();
        
        // Find featured news
        const featured = allNews.find(item => item.featured);
        if (featured) {
          setFeaturedNews(featured);
          // Filter out the featured news and get the rest
          const otherNews = allNews
            .filter(item => item._id !== featured._id)
            .slice(0, limit);
          setNews(otherNews);
        } else {
          // If no featured news, just take the first one as featured
          if (allNews.length > 0) {
            setFeaturedNews(allNews[0]);
            setNews(allNews.slice(1, limit + 1));
          } else {
            setNews([]);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
        setLoading(false);
      }
    };

    fetchNews();
  }, [limit]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section className="py-16 bg-dark">
      <div className="container">
        <h2 className="section-title">
          <span className="text-primary">Latest</span> News
        </h2>
        
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
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>{formatDate(featuredNews.publishDate)}</span>
                    </div>
                    <Link to={`/news/${featuredNews._id}`} className="btn btn-primary">Read More</Link>
                  </div>
                </div>
              </div>
            )}
            
            {/* News Grid */}
            {news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {news.map((item) => (
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
                      <Link to={`/news/${item._id}`} className="text-primary hover:underline">Read More</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-secondary p-8 rounded-lg text-center mb-12">
                <h3 className="text-xl mb-2">No news articles found</h3>
                <p className="text-gray-400">Check back later for updates.</p>
              </div>
            )}
          </>
        )}
        
        <div className="text-center">
          <Link to="/news" className="btn btn-outline">View All News</Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;

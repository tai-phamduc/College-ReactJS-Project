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
        console.log('LatestNews: Fetching latest news...');

        // Use the dedicated method for latest news
        const latestNews = await newsService.getLatestNews(limit + 1); // Get one extra for featured
        console.log('LatestNews: News data:', latestNews);

        // Process the news data
        let newsArray = [];

        if (latestNews && latestNews.length > 0) {
          console.log('LatestNews: Found news data with length:', latestNews.length);
          newsArray = latestNews;
        } else {
          console.log('LatestNews: No news data found, using sample data');
          newsArray = [
            {
              _id: '1',
              title: 'Sample News 1',
              content: 'This is sample news content 1.',
              excerpt: 'This is a sample news excerpt 1.',
              featuredImage: 'https://via.placeholder.com/800x600?text=Sample+News+1',
              publishDate: new Date().toISOString(),
              featured: true,
              category: 'Sample Category'
            },
            {
              _id: '2',
              title: 'Sample News 2',
              content: 'This is sample news content 2.',
              excerpt: 'This is a sample news excerpt 2.',
              featuredImage: 'https://via.placeholder.com/800x600?text=Sample+News+2',
              publishDate: new Date().toISOString(),
              featured: false,
              category: 'Sample Category'
            },
            {
              _id: '3',
              title: 'Sample News 3',
              content: 'This is sample news content 3.',
              excerpt: 'This is a sample news excerpt 3.',
              featuredImage: 'https://via.placeholder.com/800x600?text=Sample+News+3',
              publishDate: new Date().toISOString(),
              featured: false,
              category: 'Sample Category'
            },
            {
              _id: '4',
              title: 'Sample News 4',
              content: 'This is sample news content 4.',
              excerpt: 'This is a sample news excerpt 4.',
              featuredImage: 'https://via.placeholder.com/800x600?text=Sample+News+4',
              publishDate: new Date().toISOString(),
              featured: false,
              category: 'Sample Category'
            }
          ];
        }

        // Find featured news
        const featured = newsArray.find(item => item.featured);
        console.log('LatestNews: Featured news item:', featured);

        if (featured) {
          setFeaturedNews(featured);
          // Filter out the featured news and get the rest
          const otherNews = newsArray
            .filter(item => item._id !== featured._id)
            .slice(0, limit);
          console.log('LatestNews: Other news items:', otherNews);
          setNews(otherNews);
        } else {
          // If no featured news, just take the first one as featured
          if (newsArray.length > 0) {
            console.log('LatestNews: No featured news, using first item as featured');
            setFeaturedNews(newsArray[0]);
            setNews(newsArray.slice(1, limit + 1));
          } else {
            console.log('LatestNews: No news items found');
            setNews([]);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        console.error('Error details:', err.message, err.stack);
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
                    <img
                      src={
                        featuredNews.featuredImage ||
                        featuredNews.image ||
                        featuredNews.images?.[0] ||
                        featuredNews.imageUrl ||
                        `https://placehold.co/800x450/222222/FFA500?text=${encodeURIComponent(featuredNews.title || 'Featured News')}`
                      }
                      alt={featuredNews.title}
                      className="h-64 md:h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        // Try with http if https fails
                        if (e.target.src.startsWith('https://')) {
                          const httpUrl = e.target.src.replace('https://', 'http://');
                          console.log('Trying HTTP URL instead:', httpUrl);
                          e.target.src = httpUrl;
                        } else {
                          // Use a placeholder with the news title
                          e.target.src = `https://placehold.co/800x450/222222/FFA500?text=${encodeURIComponent(featuredNews.title || 'Featured News')}`;
                        }
                      }}
                    />
                  </div>
                  <div className="p-8 md:w-1/2">
                    <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded mb-4">Featured</span>
                    <h2 className="text-2xl font-bold mb-4">{featuredNews.title}</h2>
                    <p className="text-muted mb-4">
                      {featuredNews.excerpt ||
                       (featuredNews.content && typeof featuredNews.content === 'string' ? featuredNews.content.substring(0, 150) + '...' : '') ||
                       'Click to read this featured news article.'}
                    </p>
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
                    <img
                      src={
                        item.featuredImage ||
                        item.image ||
                        item.images?.[0] ||
                        item.imageUrl ||
                        `https://placehold.co/800x450/222222/FFA500?text=${encodeURIComponent(item.title || 'News')}`
                      }
                      alt={item.title}
                      className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        // Try with http if https fails
                        if (e.target.src.startsWith('https://')) {
                          const httpUrl = e.target.src.replace('https://', 'http://');
                          console.log('Trying HTTP URL instead:', httpUrl);
                          e.target.src = httpUrl;
                        } else {
                          // Use a placeholder with the news title
                          e.target.src = `https://placehold.co/800x450/222222/FFA500?text=${encodeURIComponent(item.title || 'News')}`;
                        }
                      }}
                    />
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-muted">{item.category || 'News'}</span>
                        <span className="text-xs text-muted">{formatDate(item.publishDate)}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-sm text-muted mb-4">
                        {item.excerpt ||
                         (item.content && typeof item.content === 'string' ? item.content.substring(0, 100) + '...' : '') ||
                         'Click to read more about this news article.'}
                      </p>
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

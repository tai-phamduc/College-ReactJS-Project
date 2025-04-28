import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChartPie, FaFilm, FaSearch, FaTicketAlt, FaStar, FaLightbulb, FaRobot } from 'react-icons/fa';
import userAnalyticsService from '../../services/userAnalyticsService';

const UserInsights = ({ userId }) => {
  const [insights, setInsights] = useState([]);
  const [genrePreferences, setGenrePreferences] = useState(null);
  const [activitySummary, setActivitySummary] = useState(null);
  const [engagementScore, setEngagementScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [insightsData, genreData, activityData, scoreData] = await Promise.all([
          userAnalyticsService.getPersonalizedInsights(userId),
          userAnalyticsService.getGenrePreferences(userId),
          userAnalyticsService.getActivitySummary(userId),
          userAnalyticsService.getEngagementScore(userId)
        ]);
        
        setInsights(insightsData);
        setGenrePreferences(genreData);
        setActivitySummary(activityData);
        setEngagementScore(scoreData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user insights:', err);
        setError('Failed to load user insights');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  // If no activity, show a message
  if (!activitySummary || activitySummary.counts.total === 0) {
    return (
      <div className="bg-secondary rounded-lg p-6">
        <div className="flex items-center mb-4">
          <FaRobot className="text-primary mr-2" size={20} />
          <h3 className="text-lg font-semibold">AI Insights</h3>
        </div>
        <div className="text-center py-4 text-gray-400">
          <p>Start browsing movies to get personalized insights!</p>
          <Link to="/movies" className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
            Explore Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaRobot className="text-primary mr-2" size={20} />
          <h3 className="text-lg font-semibold">AI Insights</h3>
        </div>
        <span className="text-xs bg-primary text-white px-2 py-1 rounded">AI Powered</span>
      </div>

      {/* Engagement Score */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-400 mb-2">Your Engagement Score</h4>
        <div className="flex items-center">
          <div className="w-full bg-gray-700 rounded-full h-4 mr-3">
            <div
              className="bg-primary h-4 rounded-full"
              style={{ width: `${engagementScore}%` }}
            ></div>
          </div>
          <span className="text-lg font-bold">{engagementScore}</span>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-3 rounded text-center">
          <FaFilm className="mx-auto text-primary mb-1" />
          <div className="text-xl font-bold">{activitySummary.counts.views}</div>
          <div className="text-xs text-gray-400">Movies Viewed</div>
        </div>
        <div className="bg-gray-800 p-3 rounded text-center">
          <FaSearch className="mx-auto text-primary mb-1" />
          <div className="text-xl font-bold">{activitySummary.counts.searches}</div>
          <div className="text-xs text-gray-400">Searches</div>
        </div>
        <div className="bg-gray-800 p-3 rounded text-center">
          <FaTicketAlt className="mx-auto text-primary mb-1" />
          <div className="text-xl font-bold">{activitySummary.counts.bookings}</div>
          <div className="text-xs text-gray-400">Bookings</div>
        </div>
        <div className="bg-gray-800 p-3 rounded text-center">
          <FaStar className="mx-auto text-primary mb-1" />
          <div className="text-xl font-bold">{activitySummary.counts.ratings}</div>
          <div className="text-xs text-gray-400">Ratings</div>
        </div>
      </div>

      {/* Genre Preferences */}
      {genrePreferences && genrePreferences.genres.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm text-gray-400 mb-2">Your Genre Preferences</h4>
          <div className="space-y-2">
            {genrePreferences.genres.slice(0, 5).map((genre, index) => (
              <div key={index} className="flex items-center">
                <span className="w-24 text-sm truncate">{genre.name}</span>
                <div className="flex-1 mx-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${genre.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-xs">{genre.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personalized Insights */}
      {insights.length > 0 && (
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Personalized Insights</h4>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded">
                <div className="flex items-start">
                  <FaLightbulb className="text-yellow-400 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold mb-1">{insight.title}</h5>
                    <p className="text-sm text-gray-400 mb-2">{insight.description}</p>
                    {insight.actionable && (
                      <Link to={insight.actionLink} className="text-primary text-sm hover:underline inline-flex items-center">
                        {insight.action}
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Active */}
      <div className="mt-6 text-center text-sm text-gray-400">
        Last active: {activitySummary.lastActive}
      </div>
    </div>
  );
};

export default UserInsights;

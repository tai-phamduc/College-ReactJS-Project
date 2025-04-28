import React, { useState, useEffect } from 'react';
import { FaChartLine, FaMoneyBillWave, FaUsers, FaSmile, FaMeh, FaFrown, FaRobot, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import trendPredictionService from '../../services/trendPredictionService';

const MovieTrendPrediction = ({ movieId }) => {
  const [popularity, setPopularity] = useState(null);
  const [boxOffice, setBoxOffice] = useState(null);
  const [demographics, setDemographics] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all predictions in parallel
        const [popularityData, boxOfficeData, demographicsData, sentimentData] = await Promise.all([
          trendPredictionService.predictMoviePopularity(movieId),
          trendPredictionService.predictBoxOffice(movieId),
          trendPredictionService.predictAudienceDemographics(movieId),
          trendPredictionService.predictSentiment(movieId)
        ]);

        setPopularity(popularityData);
        setBoxOffice(boxOfficeData);
        setDemographics(demographicsData);
        setSentiment(sentimentData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie predictions:', err);
        setError('Failed to load predictions');
        setLoading(false);
      }
    };

    if (movieId) {
      fetchData();
    }
  }, [movieId]);

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

  if (!popularity || !boxOffice || !demographics || !sentiment) {
    return (
      <div className="text-center py-8 text-gray-400">
        Unable to generate predictions for this movie
      </div>
    );
  }

  // Helper function to get trend icon
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'rising':
        return <FaArrowUp className="text-green-500" />;
      case 'falling':
        return <FaArrowDown className="text-red-500" />;
      default:
        return <FaMinus className="text-yellow-500" />;
    }
  };

  // Helper function to get sentiment icon
  const getSentimentIcon = (sentimentType) => {
    switch (sentimentType) {
      case 'positive':
        return <FaSmile className="text-green-500" size={24} />;
      case 'negative':
        return <FaFrown className="text-red-500" size={24} />;
      default:
        return <FaMeh className="text-yellow-500" size={24} />;
    }
  };

  // Simplified version that only shows the most important information
  return (
    <div className="bg-secondary rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaRobot className="text-primary mr-2" size={20} />
          <h3 className="text-lg font-semibold">AI Insights</h3>
        </div>
        <span className="text-xs bg-primary text-white px-2 py-1 rounded">AI Powered</span>
      </div>

      {/* Box Office Prediction */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <FaMoneyBillWave className="text-green-500 mr-2" />
          <h4 className="text-md font-semibold">Box Office Prediction</h4>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <div className="text-2xl font-bold text-center mb-2">{boxOffice.formattedRevenue}</div>
          <div className="text-sm text-gray-400 text-center">Projected Revenue</div>
        </div>

        <p className="text-sm text-gray-400">{boxOffice.predictionText}</p>
      </div>

      {/* Popularity and Sentiment in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Popularity Prediction */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <FaChartLine className="text-blue-500 mr-2" />
            <h4 className="text-md font-semibold">Popularity</h4>
          </div>

          <div className="flex items-center mb-3">
            <div className="w-full bg-gray-700 rounded-full h-4 mr-3">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${popularity.popularityScore}%` }}
              ></div>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-bold mr-2">{popularity.popularityScore}</span>
              {getTrendIcon(popularity.trendDirection)}
            </div>
          </div>

          <div className="text-sm text-gray-400">
            Trend: <span className={
              popularity.trendDirection === 'rising' ? 'text-green-500' :
              (popularity.trendDirection === 'falling' ? 'text-red-500' : 'text-yellow-500')
            }>{popularity.trendDirection}</span>
          </div>
        </div>

        {/* Sentiment Prediction */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            {getSentimentIcon(sentiment.sentiment)}
            <h4 className="text-md font-semibold ml-2">Audience Sentiment</h4>
          </div>

          <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-3">
            <div className="flex h-full">
              <div
                className="bg-green-500 h-full"
                style={{ width: `${sentiment.distribution.positive}%` }}
              ></div>
              <div
                className="bg-yellow-500 h-full"
                style={{ width: `${sentiment.distribution.neutral}%` }}
              ></div>
              <div
                className="bg-red-500 h-full"
                style={{ width: `${sentiment.distribution.negative}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-400">
            <span>Positive: {sentiment.distribution.positive}%</span>
            <span>Neutral: {sentiment.distribution.neutral}%</span>
            <span>Negative: {sentiment.distribution.negative}%</span>
          </div>
        </div>
      </div>

      {/* Target Audience Summary */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex items-center mb-3">
          <FaUsers className="text-purple-500 mr-2" />
          <h4 className="text-md font-semibold">Target Audience</h4>
        </div>

        <p className="text-sm text-gray-400">
          This movie appeals most to {demographics.demographics.gender.male > demographics.demographics.gender.female ? 'male' : 'female'} viewers
          ({Math.max(demographics.demographics.gender.male, demographics.demographics.gender.female)}%),
          particularly in the {Object.entries(demographics.demographics.age).sort((a, b) => b[1] - a[1])[0][0]} age group.
        </p>
      </div>

      <div className="text-center text-xs text-gray-500">
        These insights are generated by AI and should be used for reference only.
      </div>
    </div>
  );
};

export default MovieTrendPrediction;

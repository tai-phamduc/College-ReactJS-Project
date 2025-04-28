import React, { useState, useEffect } from 'react';
import { FaSmile, FaMeh, FaFrown, FaChartPie } from 'react-icons/fa';
import enhancedSentimentService from '../../services/enhancedSentimentService';

const SentimentAnalysis = ({ reviews }) => {
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyzeSentiment = async () => {
      try {
        setLoading(true);
        if (!reviews || reviews.length === 0) {
          setSentiment({
            score: 0,
            sentiment: 'neutral',
            positive: 0,
            negative: 0,
            neutral: 0,
            total: 0
          });
          setLoading(false);
          return;
        }

        const result = await enhancedSentimentService.analyzeReviews(reviews);
        setSentiment({
          score: result.score,
          sentiment: result.sentiment,
          positive: result.distribution['very positive'] + result.distribution['positive'],
          negative: result.distribution['negative'] + result.distribution['very negative'],
          neutral: result.distribution['neutral'],
          total: result.reviewCount
        });
        setLoading(false);
      } catch (err) {
        console.error('Error analyzing sentiment:', err);
        setError('Failed to analyze sentiment');
        setLoading(false);
      }
    };

    analyzeSentiment();
  }, [reviews]);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        {error}
      </div>
    );
  }

  if (!sentiment || sentiment.total === 0) {
    return (
      <div className="text-center py-4 text-gray-400">
        No reviews to analyze
      </div>
    );
  }

  // Get sentiment icon
  const getSentimentIcon = () => {
    switch (sentiment.sentiment) {
      case 'positive':
        return <FaSmile className="text-green-500" size={24} />;
      case 'negative':
        return <FaFrown className="text-red-500" size={24} />;
      default:
        return <FaMeh className="text-yellow-500" size={24} />;
    }
  };

  // Format percentage
  const formatPercentage = (value, total) => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FaChartPie className="mr-2 text-primary" />
          AI Sentiment Analysis
        </h3>
        <div className="flex items-center">
          {getSentimentIcon()}
          <span className="ml-2 text-sm bg-primary text-white px-2 py-1 rounded">AI Powered</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm">Overall Sentiment:</span>
          <span className={`text-sm font-semibold capitalize ${
            sentiment.sentiment.includes('positive') ? 'text-green-500' :
            sentiment.sentiment.includes('negative') ? 'text-red-500' :
            'text-yellow-500'
          }`}>
            {sentiment.sentiment}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${
              sentiment.sentiment === 'positive'
                ? 'bg-green-500'
                : sentiment.sentiment === 'negative'
                ? 'bg-red-500'
                : 'bg-yellow-500'
            }`}
            style={{ width: `${Math.abs(sentiment.score * 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gray-700 p-2 rounded text-center">
          <div className="text-green-500 text-lg font-bold">{formatPercentage(sentiment.positive, sentiment.total)}</div>
          <div className="text-xs text-gray-400">Positive</div>
        </div>
        <div className="bg-gray-700 p-2 rounded text-center">
          <div className="text-yellow-500 text-lg font-bold">{formatPercentage(sentiment.neutral, sentiment.total)}</div>
          <div className="text-xs text-gray-400">Neutral</div>
        </div>
        <div className="bg-gray-700 p-2 rounded text-center">
          <div className="text-red-500 text-lg font-bold">{formatPercentage(sentiment.negative, sentiment.total)}</div>
          <div className="text-xs text-gray-400">Negative</div>
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center">
        Based on {sentiment.total} review{sentiment.total !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default SentimentAnalysis;

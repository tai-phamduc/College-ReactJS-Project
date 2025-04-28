import React, { useState, useEffect } from 'react';
import { FaChartPie, FaSmile, FaMeh, FaFrown, FaRobot, FaTheaterMasks, FaPencilAlt, FaCamera, FaMusic, FaUserTie } from 'react-icons/fa';
import advancedSentimentService from '../../services/advancedSentimentService';

const AdvancedSentimentAnalysis = ({ reviews }) => {
  const [analysis, setAnalysis] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyzeReviews = async () => {
      try {
        setLoading(true);
        
        if (!reviews || reviews.length === 0) {
          setAnalysis({
            score: 0,
            sentiment: 'neutral',
            positive: 0,
            negative: 0,
            neutral: 0,
            total: 0,
            aspectSentiments: []
          });
          setInsights([]);
          setLoading(false);
          return;
        }

        // Analyze reviews and generate insights in parallel
        const [analysisResult, insightsResult] = await Promise.all([
          advancedSentimentService.analyzeReviewsWithAspects(reviews),
          advancedSentimentService.generateInsights(reviews)
        ]);
        
        setAnalysis(analysisResult);
        setInsights(insightsResult);
        setLoading(false);
      } catch (err) {
        console.error('Error analyzing sentiment:', err);
        setError('Failed to analyze sentiment');
        setLoading(false);
      }
    };

    analyzeReviews();
  }, [reviews]);

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

  if (!analysis || analysis.total === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No reviews to analyze
      </div>
    );
  }

  // Get aspect icon
  const getAspectIcon = (aspect) => {
    switch (aspect) {
      case 'acting':
        return <FaTheaterMasks className="text-yellow-500" />;
      case 'plot':
        return <FaPencilAlt className="text-blue-500" />;
      case 'visuals':
        return <FaCamera className="text-green-500" />;
      case 'sound':
        return <FaMusic className="text-purple-500" />;
      case 'directing':
        return <FaUserTie className="text-red-500" />;
      default:
        return <FaChartPie className="text-gray-500" />;
    }
  };

  // Get sentiment icon
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <FaSmile className="text-green-500" />;
      case 'negative':
        return <FaFrown className="text-red-500" />;
      default:
        return <FaMeh className="text-yellow-500" />;
    }
  };

  // Get sentiment color
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  // Format percentage
  const formatPercentage = (value, total) => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  return (
    <div className="bg-secondary rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaRobot className="text-primary mr-2" size={20} />
          <h3 className="text-lg font-semibold">Advanced Sentiment Analysis</h3>
        </div>
        <span className="text-xs bg-primary text-white px-2 py-1 rounded">AI Powered</span>
      </div>

      {/* Overall Sentiment */}
      <div className="mb-8">
        <h4 className="text-md font-semibold mb-4">Overall Sentiment</h4>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-800 p-3 rounded text-center">
            <FaSmile className="mx-auto text-green-500 mb-1" size={24} />
            <div className="text-xl font-bold">{formatPercentage(analysis.positive, analysis.total)}</div>
            <div className="text-xs text-gray-400">Positive</div>
          </div>
          <div className="bg-gray-800 p-3 rounded text-center">
            <FaMeh className="mx-auto text-yellow-500 mb-1" size={24} />
            <div className="text-xl font-bold">{formatPercentage(analysis.neutral, analysis.total)}</div>
            <div className="text-xs text-gray-400">Neutral</div>
          </div>
          <div className="bg-gray-800 p-3 rounded text-center">
            <FaFrown className="mx-auto text-red-500 mb-1" size={24} />
            <div className="text-xl font-bold">{formatPercentage(analysis.negative, analysis.total)}</div>
            <div className="text-xs text-gray-400">Negative</div>
          </div>
        </div>
        
        <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-2">
          <div className="flex h-full">
            <div
              className="bg-green-500 h-full"
              style={{ width: formatPercentage(analysis.positive, analysis.total) }}
            ></div>
            <div
              className="bg-yellow-500 h-full"
              style={{ width: formatPercentage(analysis.neutral, analysis.total) }}
            ></div>
            <div
              className="bg-red-500 h-full"
              style={{ width: formatPercentage(analysis.negative, analysis.total) }}
            ></div>
          </div>
        </div>
      </div>

      {/* Aspect-Based Sentiment */}
      {analysis.aspectSentiments && analysis.aspectSentiments.length > 0 && (
        <div className="mb-8">
          <h4 className="text-md font-semibold mb-4">Aspect-Based Sentiment</h4>
          
          <div className="space-y-4">
            {analysis.aspectSentiments.map((aspect, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {getAspectIcon(aspect.name)}
                    <span className="ml-2 capitalize">{aspect.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm ${getSentimentColor(aspect.sentiment > 0 ? 'positive' : (aspect.sentiment < 0 ? 'negative' : 'neutral'))}`}>
                      {aspect.sentiment > 0 ? 'Positive' : (aspect.sentiment < 0 ? 'Negative' : 'Neutral')}
                    </span>
                    <span className="ml-2 text-xs text-gray-400">
                      Mentioned in {aspect.mentionPercentage}% of reviews
                    </span>
                  </div>
                </div>
                
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div
                      className="bg-green-500 h-full"
                      style={{ width: `${(aspect.distribution.positive / aspect.count) * 100}%` }}
                    ></div>
                    <div
                      className="bg-yellow-500 h-full"
                      style={{ width: `${(aspect.distribution.neutral / aspect.count) * 100}%` }}
                    ></div>
                    <div
                      className="bg-red-500 h-full"
                      style={{ width: `${(aspect.distribution.negative / aspect.count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Phrases */}
      {analysis.topKeyPhrases && analysis.topKeyPhrases.length > 0 && (
        <div className="mb-8">
          <h4 className="text-md font-semibold mb-4">Common Phrases in Reviews</h4>
          
          <div className="flex flex-wrap gap-2">
            {analysis.topKeyPhrases.map((phrase, index) => (
              <div key={index} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                {phrase.text}
                <span className="ml-1 text-xs text-gray-400">({phrase.count})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-4">AI Insights</h4>
          
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded">
                <div className="flex items-start">
                  {insight.type.includes('aspect') ? (
                    getAspectIcon(insight.aspect)
                  ) : (
                    getSentimentIcon(insight.sentiment)
                  )}
                  <div className="ml-3">
                    <h5 className="font-semibold mb-1">{insight.title}</h5>
                    <p className="text-sm text-gray-400">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-center text-xs text-gray-500">
        Analysis based on {analysis.total} review{analysis.total !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default AdvancedSentimentAnalysis;

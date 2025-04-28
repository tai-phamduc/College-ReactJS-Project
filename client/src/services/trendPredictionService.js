import * as tf from '@tensorflow/tfjs';
import { movieService, searchService } from './api';
import enhancedSentimentService from './enhancedSentimentService';

// Trend Prediction Service
const trendPredictionService = {
  // Predict movie popularity trend
  predictMoviePopularity: async (movieId) => {
    try {
      // Get movie details
      const movie = await movieService.getMovieById(movieId);
      if (!movie) throw new Error('Movie not found');

      // In a real implementation, this would use a trained model
      // For now, we'll use a rule-based approach

      // Factors that influence popularity:
      // 1. Release date (newer movies tend to be more popular)
      // 2. Genre popularity
      // 3. Rating
      // 4. Cast popularity
      // 5. Director popularity

      // Calculate days since release
      const releaseDate = new Date(movie.releaseDate);
      const today = new Date();
      const daysSinceRelease = Math.floor((today - releaseDate) / (1000 * 60 * 60 * 24));

      // Calculate base popularity score
      let popularityScore = 0;

      // Factor 1: Release date (newer movies get higher scores)
      if (daysSinceRelease < 0) {
        // Upcoming movie
        popularityScore += 80 - Math.min(Math.abs(daysSinceRelease), 180) / 3;
      } else if (daysSinceRelease < 30) {
        // Recently released
        popularityScore += 90 - daysSinceRelease;
      } else if (daysSinceRelease < 90) {
        // Released within 3 months
        popularityScore += 60 - (daysSinceRelease - 30) / 2;
      } else {
        // Older release
        popularityScore += Math.max(30 - (daysSinceRelease - 90) / 30, 0);
      }

      // Factor 2: Genre popularity
      const genrePopularityBonus = getGenrePopularityBonus(movie.genres);
      popularityScore += genrePopularityBonus;

      // Factor 3: Rating
      const rating = parseFloat(movie.rating) || 0;
      popularityScore += rating * 5; // 0-50 points based on rating

      // Factor 4 & 5: Cast and Director popularity
      // In a real implementation, this would use actual popularity data
      // For now, we'll use a random bonus
      const castDirectorBonus = Math.random() * 20;
      popularityScore += castDirectorBonus;

      // Normalize to 0-100 range
      popularityScore = Math.min(Math.max(Math.round(popularityScore), 0), 100);

      // Determine trend direction
      let trendDirection = 'stable';
      if (daysSinceRelease < 0) {
        // Upcoming movie
        trendDirection = 'rising';
      } else if (daysSinceRelease < 14) {
        // New release
        trendDirection = rating >= 4 ? 'rising' : (rating <= 2 ? 'falling' : 'stable');
      } else if (daysSinceRelease < 60) {
        // Recent release
        trendDirection = rating >= 4.5 ? 'rising' : (rating <= 3 ? 'falling' : 'stable');
      } else {
        // Older release
        trendDirection = 'falling';
      }

      // Generate prediction text
      const predictionText = generatePopularityPredictionText(
        movie.title,
        popularityScore,
        trendDirection,
        daysSinceRelease,
        rating
      );

      return {
        movieId,
        title: movie.title,
        popularityScore,
        trendDirection,
        predictionText,
        factors: {
          daysSinceRelease,
          genrePopularity: genrePopularityBonus,
          rating,
          castDirectorPopularity: castDirectorBonus
        }
      };
    } catch (error) {
      console.error('Error predicting movie popularity:', error);
      return null;
    }
  },

  // Predict box office revenue
  predictBoxOffice: async (movieId) => {
    try {
      // Get movie details
      const movie = await movieService.getMovieById(movieId);
      if (!movie) throw new Error('Movie not found');

      // In a real implementation, this would use a trained model
      // For now, we'll use a rule-based approach

      // Factors that influence box office:
      // 1. Genre
      // 2. Rating
      // 3. Cast popularity
      // 4. Director popularity
      // 5. Release timing
      // 6. Budget (not available in our data)

      // Base revenue range by genre
      const baseRevenue = getBaseRevenueByGenre(movie.genres);

      // Rating multiplier
      const rating = parseFloat(movie.rating) || 3;
      const ratingMultiplier = 0.7 + (rating / 5) * 0.6; // 0.7-1.3x

      // Cast/Director multiplier (simplified)
      const castDirectorMultiplier = 0.8 + Math.random() * 0.4; // 0.8-1.2x

      // Release timing multiplier
      const releaseDate = new Date(movie.releaseDate);
      const month = releaseDate.getMonth();
      const releaseMultiplier = getReleaseDateMultiplier(month);

      // Calculate predicted revenue
      const predictedRevenue = baseRevenue * ratingMultiplier * castDirectorMultiplier * releaseMultiplier;

      // Round to nearest million
      const roundedRevenue = Math.round(predictedRevenue / 1000000) * 1000000;

      // Generate prediction range (±20%)
      const lowerBound = Math.round(roundedRevenue * 0.8 / 1000000) * 1000000;
      const upperBound = Math.round(roundedRevenue * 1.2 / 1000000) * 1000000;

      // Format as currency
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });

      const formattedRevenue = formatter.format(roundedRevenue);
      const formattedLowerBound = formatter.format(lowerBound);
      const formattedUpperBound = formatter.format(upperBound);

      // Generate prediction text
      const predictionText = generateBoxOfficePredictionText(
        movie.title,
        formattedLowerBound,
        formattedUpperBound,
        movie.genres,
        rating
      );

      return {
        movieId,
        title: movie.title,
        predictedRevenue: roundedRevenue,
        formattedRevenue,
        range: {
          lower: lowerBound,
          upper: upperBound,
          formatted: `${formattedLowerBound} - ${formattedUpperBound}`
        },
        predictionText,
        factors: {
          baseRevenue,
          ratingMultiplier,
          castDirectorMultiplier,
          releaseMultiplier
        }
      };
    } catch (error) {
      console.error('Error predicting box office revenue:', error);
      return null;
    }
  },

  // Predict audience demographics
  predictAudienceDemographics: async (movieId) => {
    try {
      // Get movie details
      const movie = await movieService.getMovieById(movieId);
      if (!movie) throw new Error('Movie not found');

      // In a real implementation, this would use a trained model
      // For now, we'll use genre-based predictions

      // Get demographics based on genre
      const demographics = predictDemographicsByGenre(movie.genres);

      return {
        movieId,
        title: movie.title,
        demographics,
        confidenceScore: 70 // Fixed confidence score for demo
      };
    } catch (error) {
      console.error('Error predicting audience demographics:', error);
      return null;
    }
  },

  // Get trending movies
  getTrendingMovies: async (limit = 5) => {
    try {
      // In a real implementation, this would use actual trending data
      // For now, we'll use featured movies as a proxy
      const featuredMovies = await movieService.getFeaturedMovies();

      // Calculate trending score for each movie
      const trendingMovies = await Promise.all(
        featuredMovies.slice(0, limit * 2).map(async (movie) => {
          const popularity = await trendPredictionService.predictMoviePopularity(movie._id);
          return {
            ...movie,
            trendingScore: popularity ? popularity.popularityScore : 50,
            trendDirection: popularity ? popularity.trendDirection : 'stable'
          };
        })
      );

      // Sort by trending score and return top results
      return trendingMovies
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting trending movies:', error);
      return [];
    }
  },

  // Predict sentiment for upcoming movie
  predictSentiment: async (movieId) => {
    try {
      // Get movie details
      const movie = await movieService.getMovieById(movieId);
      if (!movie) throw new Error('Movie not found');

      // In a real implementation, this would analyze social media, etc.
      // For now, we'll use a simplified approach based on genre and director

      // Base sentiment score by genre
      const baseSentiment = getSentimentScoreByGenre(movie.genres);

      // Director factor (random for demo)
      const directorFactor = Math.random() * 0.4 - 0.2; // -0.2 to 0.2

      // Calculate sentiment score (-1 to 1)
      let sentimentScore = baseSentiment + directorFactor;
      sentimentScore = Math.max(Math.min(sentimentScore, 1), -1);

      // Determine sentiment label
      let sentiment = 'neutral';
      if (sentimentScore > 0.2) {
        sentiment = 'positive';
      } else if (sentimentScore < -0.2) {
        sentiment = 'negative';
      }

      // Calculate percentages
      const positive = Math.round((sentimentScore + 1) / 2 * 70 + 15);
      const negative = Math.round((1 - sentimentScore) / 2 * 70 + 15);
      const neutral = 100 - positive - negative;

      return {
        movieId,
        title: movie.title,
        score: sentimentScore,
        sentiment,
        distribution: {
          positive,
          neutral,
          negative
        },
        predictionText: generateSentimentPredictionText(
          movie.title,
          sentiment,
          positive,
          movie.genres
        )
      };
    } catch (error) {
      console.error('Error predicting sentiment:', error);
      return null;
    }
  }
};

// Helper function to get genre popularity bonus
const getGenrePopularityBonus = (genres) => {
  if (!genres || !Array.isArray(genres)) return 0;

  // Genre popularity weights (0-10 scale)
  const genreWeights = {
    'Action': 9,
    'Adventure': 8,
    'Animation': 7,
    'Comedy': 8,
    'Crime': 6,
    'Documentary': 4,
    'Drama': 7,
    'Family': 6,
    'Fantasy': 7,
    'History': 5,
    'Horror': 7,
    'Music': 5,
    'Mystery': 6,
    'Romance': 7,
    'Science Fiction': 8,
    'Sci-Fi': 8,
    'Thriller': 8,
    'War': 5,
    'Western': 4
  };

  // Calculate average genre popularity
  let totalWeight = 0;
  let genreCount = 0;

  genres.forEach(genre => {
    const genreName = typeof genre === 'string' ? genre : (genre.name || '');
    if (genreName && genreWeights[genreName]) {
      totalWeight += genreWeights[genreName];
      genreCount++;
    }
  });

  // Return scaled bonus (0-20 points)
  return genreCount > 0 ? (totalWeight / genreCount) * 2 : 0;
};

// Helper function to get base revenue by genre
const getBaseRevenueByGenre = (genres) => {
  if (!genres || !Array.isArray(genres)) return 50000000; // Default $50M

  // Base revenue by genre (in millions)
  const genreRevenue = {
    'Action': 120000000,
    'Adventure': 100000000,
    'Animation': 90000000,
    'Comedy': 70000000,
    'Crime': 50000000,
    'Documentary': 5000000,
    'Drama': 40000000,
    'Family': 80000000,
    'Fantasy': 100000000,
    'History': 60000000,
    'Horror': 40000000,
    'Music': 30000000,
    'Mystery': 50000000,
    'Romance': 60000000,
    'Science Fiction': 110000000,
    'Sci-Fi': 110000000,
    'Thriller': 70000000,
    'War': 80000000,
    'Western': 40000000
  };

  // Calculate average genre revenue
  let totalRevenue = 0;
  let genreCount = 0;

  genres.forEach(genre => {
    const genreName = typeof genre === 'string' ? genre : (genre.name || '');
    if (genreName && genreRevenue[genreName]) {
      totalRevenue += genreRevenue[genreName];
      genreCount++;
    }
  });

  // Return average or default
  return genreCount > 0 ? totalRevenue / genreCount : 50000000;
};

// Helper function to get release date multiplier
const getReleaseDateMultiplier = (month) => {
  // Month multipliers (0-11 for Jan-Dec)
  const monthMultipliers = [
    0.9,  // January
    0.85, // February
    0.9,  // March
    0.95, // April
    1.1,  // May (summer blockbuster season starts)
    1.2,  // June
    1.3,  // July (peak summer)
    1.2,  // August
    0.9,  // September
    0.95, // October
    1.1,  // November (holiday season)
    1.2   // December
  ];

  return monthMultipliers[month] || 1.0;
};

// Helper function to predict demographics by genre
const predictDemographicsByGenre = (genres) => {
  if (!genres || !Array.isArray(genres)) {
    return {
      gender: { male: 50, female: 50 },
      age: { '18-24': 20, '25-34': 30, '35-44': 25, '45-54': 15, '55+': 10 }
    };
  }

  // Default demographics
  const demographics = {
    gender: { male: 50, female: 50 },
    age: { '18-24': 20, '25-34': 30, '35-44': 25, '45-54': 15, '55+': 10 }
  };

  // Adjust based on genres
  genres.forEach(genre => {
    const genreName = typeof genre === 'string' ? genre : (genre.name || '');

    switch (genreName) {
      case 'Action':
      case 'Science Fiction':
      case 'Sci-Fi':
        demographics.gender.male += 5;
        demographics.gender.female -= 5;
        demographics.age['18-24'] += 3;
        demographics.age['25-34'] += 2;
        demographics.age['55+'] -= 5;
        break;

      case 'Romance':
        demographics.gender.male -= 10;
        demographics.gender.female += 10;
        demographics.age['25-34'] += 5;
        demographics.age['18-24'] += 3;
        demographics.age['55+'] += 2;
        break;

      case 'Horror':
        demographics.age['18-24'] += 10;
        demographics.age['25-34'] += 5;
        demographics.age['45-54'] -= 5;
        demographics.age['55+'] -= 10;
        break;

      case 'Drama':
      case 'History':
        demographics.age['35-44'] += 5;
        demographics.age['45-54'] += 5;
        demographics.age['55+'] += 5;
        demographics.age['18-24'] -= 10;
        break;

      case 'Animation':
      case 'Family':
        demographics.age['18-24'] -= 5;
        demographics.age['25-34'] += 5;
        demographics.age['35-44'] += 5;
        demographics.gender.female += 5;
        demographics.gender.male -= 5;
        break;

      // Add more genre adjustments as needed
    }
  });

  // Normalize gender to 100%
  const totalGender = demographics.gender.male + demographics.gender.female;
  demographics.gender.male = Math.round(demographics.gender.male / totalGender * 100);
  demographics.gender.female = 100 - demographics.gender.male;

  // Normalize age to 100%
  const totalAge = Object.values(demographics.age).reduce((sum, val) => sum + val, 0);
  Object.keys(demographics.age).forEach(key => {
    demographics.age[key] = Math.round(demographics.age[key] / totalAge * 100);
  });

  // Ensure age adds up to 100% (adjust rounding errors)
  const ageSum = Object.values(demographics.age).reduce((sum, val) => sum + val, 0);
  if (ageSum !== 100) {
    const diff = 100 - ageSum;
    // Add the difference to the largest age group
    const largestGroup = Object.entries(demographics.age)
      .sort((a, b) => b[1] - a[1])[0][0];
    demographics.age[largestGroup] += diff;
  }

  return demographics;
};

// Helper function to get sentiment score by genre
const getSentimentScoreByGenre = (genres) => {
  if (!genres || !Array.isArray(genres)) return 0;

  // Genre sentiment bias (-0.5 to 0.5 scale)
  const genreSentiment = {
    'Action': 0.3,
    'Adventure': 0.4,
    'Animation': 0.5,
    'Comedy': 0.4,
    'Crime': 0.1,
    'Documentary': 0.2,
    'Drama': 0.0,
    'Family': 0.5,
    'Fantasy': 0.3,
    'History': 0.1,
    'Horror': -0.2,
    'Music': 0.3,
    'Mystery': 0.1,
    'Romance': 0.4,
    'Science Fiction': 0.2,
    'Sci-Fi': 0.2,
    'Thriller': 0.0,
    'War': -0.1,
    'Western': 0.1
  };

  // Calculate average sentiment
  let totalSentiment = 0;
  let genreCount = 0;

  genres.forEach(genre => {
    const genreName = typeof genre === 'string' ? genre : (genre.name || '');
    if (genreName && genreSentiment[genreName] !== undefined) {
      totalSentiment += genreSentiment[genreName];
      genreCount++;
    }
  });

  return genreCount > 0 ? totalSentiment / genreCount : 0;
};

// Helper function to generate popularity prediction text
const generatePopularityPredictionText = (title, score, trend, daysSinceRelease, rating) => {
  let text = '';

  if (daysSinceRelease < 0) {
    // Upcoming movie
    text = `Based on pre-release buzz, "${title}" is predicted to have ${
      score > 80 ? 'very high' : (score > 60 ? 'high' : (score > 40 ? 'moderate' : 'limited'))
    } audience interest. The film is trending ${
      trend === 'rising' ? 'upward' : (trend === 'falling' ? 'downward' : 'steadily')
    } as its release approaches.`;
  } else if (daysSinceRelease < 30) {
    // Recent release
    text = `"${title}" is currently showing ${
      score > 80 ? 'exceptional' : (score > 60 ? 'strong' : (score > 40 ? 'moderate' : 'weak'))
    } performance at the box office with a popularity score of ${score}/100. The film is ${
      trend === 'rising' ? 'gaining momentum' : (trend === 'falling' ? 'losing momentum' : 'maintaining steady interest')
    } since its release ${daysSinceRelease} days ago.`;
  } else {
    // Older release
    text = `"${title}" currently has a popularity score of ${score}/100, which is ${
      score > 80 ? 'exceptional' : (score > 60 ? 'strong' : (score > 40 ? 'moderate' : 'weak'))
    } for a film ${daysSinceRelease} days after release. The audience interest is ${
      trend === 'rising' ? 'surprisingly increasing' : (trend === 'falling' ? 'gradually declining' : 'remaining stable')
    } at this stage of its run.`;
  }

  // Add rating context if available
  if (rating > 0) {
    text += ` With an average rating of ${rating}/5, the film has received ${
      rating >= 4.5 ? 'exceptional' : (rating >= 4 ? 'very positive' : (rating >= 3.5 ? 'positive' : (rating >= 3 ? 'mixed to positive' : (rating >= 2.5 ? 'mixed' : 'negative'))))
    } reviews.`;
  }

  return text;
};

// Helper function to generate box office prediction text
const generateBoxOfficePredictionText = (title, lowerBound, upperBound, genres, rating) => {
  // Get primary genre
  const primaryGenre = genres && genres.length > 0 ?
    (typeof genres[0] === 'string' ? genres[0] : (genres[0].name || 'this genre')) :
    'this genre';

  let text = `Based on our AI analysis, "${title}" is projected to earn between ${lowerBound} and ${upperBound} at the box office. `;

  // Add genre context
  text += `For ${primaryGenre} films, this would be ${
    upperBound.includes('$200,000,000') || upperBound.includes('$300,000,000') ? 'an exceptional performance' :
    (upperBound.includes('$100,000,000') ? 'a strong performance' :
    (upperBound.includes('$50,000,000') ? 'a solid performance' : 'a modest performance'))
  }. `;

  // Add rating context if available
  if (rating > 0) {
    text += `With its current rating of ${rating}/5, the film's ${
      rating >= 4 ? 'positive reception is likely to boost its earnings through word-of-mouth' :
      (rating >= 3 ? 'mixed-to-positive reception may help sustain its run' :
      'less favorable reception might limit its long-term potential')
    }.`;
  } else {
    text += `Critical reception will play a key role in determining where within this range the final box office lands.`;
  }

  return text;
};

// Helper function to generate sentiment prediction text
const generateSentimentPredictionText = (title, sentiment, positivePercentage, genres) => {
  // Get primary genre
  const primaryGenre = genres && genres.length > 0 ?
    (typeof genres[0] === 'string' ? genres[0] : (genres[0].name || 'this genre')) :
    'this genre';

  let text = `Our AI predicts that "${title}" will receive ${
    sentiment === 'positive' ? 'predominantly positive' :
    (sentiment === 'negative' ? 'mixed to negative' : 'mixed')
  } audience sentiment upon release. `;

  text += `Approximately ${positivePercentage}% of audience reactions are expected to be positive. `;

  text += `This is ${
    sentiment === 'positive' && positivePercentage > 70 ? 'above average' :
    (sentiment === 'positive' ? 'typical' :
    (sentiment === 'negative' ? 'below average' : 'average'))
  } for ${primaryGenre} films.`;

  return text;
};

export default trendPredictionService;

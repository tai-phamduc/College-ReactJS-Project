// Test file for sentiment analysis services
import enhancedSentimentService from '../services/enhancedSentimentService';

// Sample reviews for testing
const sampleReviews = [
  {
    _id: '1',
    user: 'user1',
    movie: 'movie1',
    rating: 4.5,
    title: 'Great movie!',
    comment: 'I really enjoyed this movie. The acting was superb and the plot was engaging. Highly recommend!'
  },
  {
    _id: '2',
    user: 'user2',
    movie: 'movie1',
    rating: 2,
    title: 'Disappointing',
    comment: 'The visuals were good but the story was boring and predictable. The acting was mediocre at best.'
  },
  {
    _id: '3',
    user: 'user3',
    movie: 'movie1',
    rating: 5,
    title: 'Masterpiece',
    comment: 'Absolutely amazing film! The directing was perfect, the soundtrack was beautiful, and the cinematography was stunning.'
  },
  {
    _id: '4',
    user: 'user4',
    movie: 'movie1',
    rating: 3,
    title: 'Mixed feelings',
    comment: 'Some parts were good, others not so much. The acting was great but the plot had holes.'
  }
];

// Test basic sentiment analysis
async function testBasicSentimentAnalysis() {
  console.log('=== Testing Basic Sentiment Analysis ===');

  // Test single review sentiment
  const singleReview = sampleReviews[0].comment;
  const singleResult = await enhancedSentimentService.analyzeSentiment(singleReview);
  console.log('Single review sentiment:', singleResult);

  // Test multiple reviews sentiment
  const multiResult = await enhancedSentimentService.analyzeReviews(sampleReviews);
  console.log('Multiple reviews sentiment:', multiResult);

  return { singleResult, multiResult };
}

// Test advanced sentiment analysis
async function testAdvancedSentimentAnalysis() {
  console.log('\n=== Testing Advanced Sentiment Analysis ===');

  // Test aspect-based sentiment analysis
  const singleReview = sampleReviews[0].comment;
  const aspectResult = await enhancedSentimentService.analyzeWithAspects(singleReview);
  console.log('Aspect-based sentiment:', aspectResult);

  // Test multiple reviews with aspects
  const multiAspectResult = await enhancedSentimentService.analyzeReviewsWithAspects(sampleReviews);
  console.log('Multiple reviews with aspects:', multiAspectResult);

  // Test insights generation
  const insights = enhancedSentimentService.generateInsights(sampleReviews);
  console.log('Generated insights:', insights);

  return { aspectResult, multiAspectResult, insights };
}

// Run all tests
async function runAllTests() {
  try {
    const basicResults = await testBasicSentimentAnalysis();
    const advancedResults = await testAdvancedSentimentAnalysis();

    console.log('\n=== Test Summary ===');
    console.log('Basic sentiment analysis:', basicResults.singleResult.sentiment);
    console.log('Multiple reviews sentiment:', basicResults.multiResult.sentiment);
    console.log('Aspect-based sentiment detected aspects:', Object.keys(advancedResults.aspectResult.aspects).filter(
      aspect => advancedResults.aspectResult.aspects[aspect].count > 0
    ));
    console.log('Generated insights count:', advancedResults.insights.length);

    return {
      success: true,
      basicResults,
      advancedResults
    };
  } catch (error) {
    console.error('Test failed:', error);
    return {
      success: false,
      error
    };
  }
}

// Export functions for use in browser console
window.sentimentTest = {
  runAllTests,
  testBasicSentimentAnalysis,
  testAdvancedSentimentAnalysis,
  sampleReviews
};

console.log('Sentiment analysis test module loaded. Run tests using window.sentimentTest.runAllTests()');

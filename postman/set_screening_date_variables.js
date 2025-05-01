// This script helps set up date variables for the Screening API Collection
// You can run this in the Postman Pre-request Script tab at the collection level

// Get today's date in YYYY-MM-DD format
const today = new Date();
const todayFormatted = today.toISOString().split('T')[0];

// Format display date (e.g., "December 25, 2023")
const options = { year: 'numeric', month: 'long', day: 'numeric' };
const displayDate = today.toLocaleDateString('en-US', options);

// Get day of week
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayOfWeek = daysOfWeek[today.getDay()];

// Set environment variables
pm.environment.set('date', todayFormatted);
pm.environment.set('displayDate', displayDate);
pm.environment.set('dayOfWeek', dayOfWeek);

console.log('Date variables set:');
console.log('date:', todayFormatted);
console.log('displayDate:', displayDate);
console.log('dayOfWeek:', dayOfWeek);

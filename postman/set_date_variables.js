// This script helps set up date variables for the Cinema By Movie Date Collection
// You can run this in the Postman Pre-request Script tab at the collection level

// Get today's date in YYYY-MM-DD format
const today = new Date();
const todayFormatted = today.toISOString().split('T')[0];

// Get tomorrow's date in YYYY-MM-DD format
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

// Set environment variables
pm.environment.set('todayDate', todayFormatted);
pm.environment.set('tomorrowDate', tomorrowFormatted);

console.log('Date variables set:');
console.log('todayDate:', todayFormatted);
console.log('tomorrowDate:', tomorrowFormatted);

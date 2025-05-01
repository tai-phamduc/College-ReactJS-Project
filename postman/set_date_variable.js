// This script helps set up the date variable for the Seats API Collection
// You can run this in the Postman Pre-request Script tab at the collection level

// Get today's date in YYYY-MM-DD format
const today = new Date();
const todayFormatted = today.toISOString().split('T')[0];

// Set environment variable
pm.environment.set('date', todayFormatted);

console.log('Date variable set:', todayFormatted);

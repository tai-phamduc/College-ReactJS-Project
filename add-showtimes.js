const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/';
const dbName = 'movie-booking';

// Function to generate dates for the next 7 days
function getNext7Days() {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  
  return dates;
}

// Function to format date for display
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

// Function to get day of week
function getDayOfWeek(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

// Function to generate showtimes for a specific date
function generateShowtimesForDate(date, movieId, theaterId, hallId) {
  const showtimes = [];
  const startTimes = ['10:00', '13:00', '16:00', '19:00', '22:00'];
  
  startTimes.forEach(time => {
    const [hours, minutes] = time.split(':').map(Number);
    
    const startTime = new Date(date);
    startTime.setHours(hours, minutes, 0, 0);
    
    // Calculate end time (movie duration + 30 minutes for ads/trailers)
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 120 + 30); // Assuming 120 minutes duration + 30 min for ads
    
    showtimes.push({
      movie: movieId,
      theater: theaterId,
      hall: `Hall ${hallId}`,
      hallId: hallId,
      date: new Date(date),
      displayDate: formatDate(date),
      startTime: startTime,
      endTime: endTime,
      displayTime: startTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      price: 12.99,
      totalSeats: 100,
      seatsAvailable: 100,
      bookedSeats: [],
      reservedSeats: [],
      isActive: true,
      format: '2D',
      language: 'English',
      subtitles: 'None',
      status: 'scheduled',
      bookingEnabled: true,
      dayOfWeek: getDayOfWeek(date),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });
  
  return showtimes;
}

async function addShowtimes() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(dbName);
    const moviesCollection = database.collection('movies');
    const theatersCollection = database.collection('theaters');
    const showtimesCollection = database.collection('showtimes');

    // Get all movies with "Now Playing" status
    const movies = await moviesCollection.find({ status: "Now Playing" }).toArray();
    
    // Get all theaters
    const theaters = await theatersCollection.find({}).toArray();
    
    // If no theaters exist, create a sample theater
    if (theaters.length === 0) {
      const theaterResult = await theatersCollection.insertOne({
        name: "CineStar Multiplex",
        location: "123 Main Street, City Center",
        address: {
          street: "123 Main Street",
          city: "City Center",
          state: "State",
          zipCode: "10000",
          country: "Country"
        },
        contact: {
          phone: "+1234567890",
          email: "info@cinestar.com",
          website: "https://www.cinestar.com"
        },
        halls: [
          { name: "Hall 1", capacity: 100, type: "Standard" },
          { name: "Hall 2", capacity: 100, type: "Premium" },
          { name: "Hall 3", capacity: 100, type: "IMAX" }
        ],
        amenities: ["Parking", "Food Court", "Wheelchair Access"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log("Created a sample theater");
      theaters.push(await theatersCollection.findOne({ _id: theaterResult.insertedId }));
    }
    
    // Get the next 7 days
    const next7Days = getNext7Days();
    
    // Generate showtimes for each movie, theater, and date
    let showtimesCount = 0;
    
    for (const movie of movies) {
      for (const theater of theaters) {
        for (let hallIndex = 0; hallIndex < theater.halls.length; hallIndex++) {
          for (const date of next7Days) {
            const showtimes = generateShowtimesForDate(date, movie._id, theater._id, hallIndex + 1);
            
            if (showtimes.length > 0) {
              await showtimesCollection.insertMany(showtimes);
              showtimesCount += showtimes.length;
            }
          }
        }
      }
    }
    
    console.log(`Added ${showtimesCount} showtimes for ${movies.length} movies in ${theaters.length} theaters`);

  } catch (error) {
    console.error('Error adding showtimes:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
addShowtimes();

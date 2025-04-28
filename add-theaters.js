const { MongoClient } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/';
const dbName = 'movie-booking';

// Sample theaters data
const theaters = [
  {
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
    isActive: true
  },
  {
    name: "MovieMax Cinema",
    location: "456 Park Avenue, Downtown",
    address: {
      street: "456 Park Avenue",
      city: "Downtown",
      state: "State",
      zipCode: "20000",
      country: "Country"
    },
    contact: {
      phone: "+0987654321",
      email: "info@moviemax.com",
      website: "https://www.moviemax.com"
    },
    halls: [
      { name: "Hall 1", capacity: 120, type: "Standard" },
      { name: "Hall 2", capacity: 80, type: "VIP" },
      { name: "Hall 3", capacity: 150, type: "IMAX" },
      { name: "Hall 4", capacity: 100, type: "4DX" }
    ],
    amenities: ["Parking", "Food Court", "Arcade", "Lounge", "Wheelchair Access"],
    isActive: true
  },
  {
    name: "FilmHouse Deluxe",
    location: "789 Ocean Drive, Beachside",
    address: {
      street: "789 Ocean Drive",
      city: "Beachside",
      state: "State",
      zipCode: "30000",
      country: "Country"
    },
    contact: {
      phone: "+1122334455",
      email: "info@filmhouse.com",
      website: "https://www.filmhouse.com"
    },
    halls: [
      { name: "Hall 1", capacity: 90, type: "Standard" },
      { name: "Hall 2", capacity: 90, type: "Standard" },
      { name: "Hall 3", capacity: 60, type: "Premium" }
    ],
    amenities: ["Parking", "Cafe", "Wheelchair Access"],
    isActive: true
  }
];

async function addTheaters() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(dbName);
    const theatersCollection = database.collection('theaters');

    // Check if theaters already exist
    const existingTheaters = await theatersCollection.countDocuments();
    
    if (existingTheaters > 0) {
      console.log(`${existingTheaters} theaters already exist in the database. Skipping insertion.`);
      return;
    }

    // Add timestamps to each theater
    const theatersWithTimestamps = theaters.map(theater => ({
      ...theater,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Insert the theaters
    const result = await theatersCollection.insertMany(theatersWithTimestamps);
    console.log(`${result.insertedCount} theaters added to the database`);

  } catch (error) {
    console.error('Error adding theaters:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
addTheaters();

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Define schemas
const ScreeningSeatSchema = new mongoose.Schema({
  seat_id: mongoose.Schema.Types.ObjectId,
  row: String,
  column: Number,
  seatNumber: String,
  status: {
    type: String,
    enum: ['available', 'booked', 'reserved', 'unavailable', 'maintenance'],
    default: 'available',
  },
  price: Number,
  type: {
    type: String,
    enum: ['standard', 'premium', 'vip', 'couple', 'accessible'],
    default: 'standard',
  }
});

const ScreeningSchema = new mongoose.Schema({
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  cinema_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  format: {
    type: String,
    enum: ['2D', '3D', 'IMAX', '4DX', 'ScreenX'],
    default: '2D'
  },
  price: {
    type: Number,
    required: true
  },
  seats: [ScreeningSeatSchema],
  totalSeats: {
    type: Number,
    default: 0
  },
  seatsAvailable: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['scheduled', 'cancelled', 'sold_out', 'almost_full', 'open'],
    default: 'scheduled'
  }
}, { timestamps: true });

// Create models
const Screening = mongoose.model('Screening', ScreeningSchema);
const Movie = mongoose.model('Movie', { title: String });
const Cinema = mongoose.model('Cinema', { name: String });

// Function to create a test screening
async function createTestScreening() {
  try {
    // Get a movie ID
    let movie = await Movie.findOne();
    if (!movie) {
      movie = await Movie.create({ title: 'Test Movie' });
      console.log('Created test movie:', movie);
    }

    // Get a cinema ID
    let cinema = await Cinema.findOne();
    if (!cinema) {
      cinema = await Cinema.create({ name: 'Test Cinema' });
      console.log('Created test cinema:', cinema);
    }

    // Create a room ID (this would normally come from the cinema's rooms)
    const roomId = new mongoose.Types.ObjectId();

    // Create seats for the screening
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const columns = 12;
    
    for (const row of rows) {
      for (let col = 1; col <= columns; col++) {
        seats.push({
          seat_id: new mongoose.Types.ObjectId(),
          row,
          column: col,
          seatNumber: `${row}${col}`,
          status: 'available',
          price: 10,
          type: 'standard'
        });
      }
    }

    // Create the screening
    const now = new Date();
    const startTime = new Date(now);
    startTime.setHours(startTime.getHours() + 2); // 2 hours from now
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2); // 2 hours duration
    
    const screening = await Screening.create({
      movie_id: movie._id,
      cinema_id: cinema._id,
      room_id: roomId,
      date: now,
      startTime,
      endTime,
      format: '2D',
      price: 10,
      seats,
      totalSeats: seats.length,
      seatsAvailable: seats.length,
      status: 'scheduled'
    });

    console.log('Created test screening with ID:', screening._id);
    console.log('Use this ID in your booking process');
    
    return screening;
  } catch (error) {
    console.error('Error creating test screening:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Run the function
createTestScreening();

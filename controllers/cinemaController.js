const Cinema = require('../models/Cinema');
const Screening = require('../models/Screening');
const mongoose = require('mongoose');

// @desc    Create a new cinema
// @route   POST /api/cinemas
// @access  Private/Admin
const createCinema = async (req, res) => {
  try {
    const cinema = new Cinema(req.body);
    const createdCinema = await cinema.save();
    res.status(201).json(createdCinema);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all cinemas
// @route   GET /api/cinemas
// @access  Public
const getCinemas = async (req, res) => {
  try {
    const { city, name } = req.query;

    // Build filter object
    const filter = {};

    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    // Only show active cinemas
    filter.isActive = true;

    const cinemas = await Cinema.find(filter).sort({ name: 1 });
    res.json(cinemas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get cinema by ID
// @route   GET /api/cinemas/:id
// @access  Public
const getCinemaById = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }
    
    res.json(cinema);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cinema
// @route   PUT /api/cinemas/:id
// @access  Private/Admin
const updateCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }
    
    Object.keys(req.body).forEach(key => {
      cinema[key] = req.body[key];
    });
    
    const updatedCinema = await cinema.save();
    res.json(updatedCinema);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete cinema
// @route   DELETE /api/cinemas/:id
// @access  Private/Admin
const deleteCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }
    
    // Instead of deleting, mark as inactive
    cinema.isActive = false;
    await cinema.save();
    
    res.json({ message: 'Cinema removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get cinemas by city
// @route   GET /api/cinemas/city/:city
// @access  Public
const getCinemasByCity = async (req, res) => {
  try {
    const cinemas = await Cinema.findByCity(req.params.city);
    res.json(cinemas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add room to cinema
// @route   POST /api/cinemas/:id/rooms
// @access  Private/Admin
const addRoom = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }
    
    await cinema.addRoom(req.body);
    
    const updatedCinema = await Cinema.findById(req.params.id);
    res.status(201).json(updatedCinema.rooms[updatedCinema.rooms.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update room in cinema
// @route   PUT /api/cinemas/:id/rooms/:roomId
// @access  Private/Admin
const updateRoom = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }
    
    await cinema.updateRoom(req.params.roomId, req.body);
    
    const updatedCinema = await Cinema.findById(req.params.id);
    const updatedRoom = updatedCinema.rooms.find(room => 
      room._id.toString() === req.params.roomId
    );
    
    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove room from cinema
// @route   DELETE /api/cinemas/:id/rooms/:roomId
// @access  Private/Admin
const removeRoom = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }
    
    await cinema.removeRoom(req.params.roomId);
    
    res.json({ message: 'Room removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get cinemas by movie and date
// @route   GET /api/cinemas/movie/:movieId/date/:date
// @access  Public
const getCinemasByMovieAndDate = async (req, res) => {
  try {
    const { movieId, date } = req.params;
    
    // Validate movieId
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }
    
    // Create date range for the selected date (start of day to end of day)
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    // Find screenings for the given movie and date
    const screenings = await Screening.find({
      movie_id: movieId,
      startTime: { $gte: startDate, $lte: endDate },
      isActive: true
    }).distinct('cinema_id');
    
    if (screenings.length === 0) {
      return res.json([]);
    }
    
    // Find cinemas with those screenings
    const cinemas = await Cinema.find({
      _id: { $in: screenings },
      isActive: true
    }).sort({ name: 1 });
    
    res.json(cinemas);
  } catch (error) {
    console.error('Error getting cinemas by movie and date:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCinema,
  getCinemas,
  getCinemaById,
  updateCinema,
  deleteCinema,
  getCinemasByCity,
  addRoom,
  updateRoom,
  removeRoom,
  getCinemasByMovieAndDate,
};

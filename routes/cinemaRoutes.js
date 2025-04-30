const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/cinemaController');

router.route('/')
  .get(getCinemas)
  .post(protect, admin, createCinema);

router.route('/:id')
  .get(getCinemaById)
  .put(protect, admin, updateCinema)
  .delete(protect, admin, deleteCinema);

router.route('/city/:city')
  .get(getCinemasByCity);

router.route('/movie/:movieId/date/:date')
  .get(getCinemasByMovieAndDate);

router.route('/:id/rooms')
  .post(protect, admin, addRoom);

router.route('/:id/rooms/:roomId')
  .put(protect, admin, updateRoom)
  .delete(protect, admin, removeRoom);

module.exports = router;

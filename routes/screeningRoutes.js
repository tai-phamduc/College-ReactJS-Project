const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createScreening,
  getScreenings,
  getScreeningById,
  updateScreening,
  deleteScreening,
  getAvailableSeats,
  reserveSeats,
  releaseSeats,
  getScreeningsByMovieCinemaDate,
  getScreeningsByMovieDate,
} = require('../controllers/screeningController');

router.route('/')
  .get(getScreenings)
  .post(protect, admin, createScreening);

router.route('/:id')
  .get(getScreeningById)
  .put(protect, admin, updateScreening)
  .delete(protect, admin, deleteScreening);

router.route('/:id/seats')
  .get(getAvailableSeats);

router.route('/:id/reserve')
  .post(reserveSeats);

router.route('/:id/release')
  .post(releaseSeats);

router.route('/movie/:movieId/cinema/:cinemaId/date/:date')
  .get(getScreeningsByMovieCinemaDate);

router.route('/movie/:movieId/date/:date')
  .get(getScreeningsByMovieDate);

module.exports = router;

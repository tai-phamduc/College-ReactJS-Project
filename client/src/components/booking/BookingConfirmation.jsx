import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTicketAlt, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCouch, FaFilm, FaMoneyBillWave, FaDownload, FaEnvelope } from 'react-icons/fa';
import './BookingConfirmation.css';

const BookingConfirmation = ({ 
  booking, 
  movie, 
  showtime, 
  seats, 
  theater, 
  totalAmount,
  bookingReference,
  onViewTickets,
  onDownloadTickets,
  onEmailTickets
}) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="booking-confirmation">
      <div className="confirmation-header">
        <div className="success-icon">
          <FaCheckCircle />
        </div>
        <h2>Booking Confirmed!</h2>
        <p>Your tickets have been booked successfully.</p>
      </div>

      <div className="booking-reference">
        <span>Booking Reference:</span>
        <span className="reference-code">{bookingReference || `BK-${Date.now().toString().slice(-8)}`}</span>
      </div>

      <div className="confirmation-details">
        <div className="movie-info">
          {movie.poster && (
            <div className="movie-poster">
              <img src={movie.poster} alt={movie.title} />
            </div>
          )}
          <div className="movie-details">
            <h3 className="movie-title">{movie.title}</h3>
            <div className="movie-meta">
              {movie.duration && (
                <span className="duration">
                  <FaClock /> {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>
              )}
              {movie.rating && (
                <span className="rating">{movie.rating}</span>
              )}
            </div>
          </div>
        </div>

        <div className="booking-info-grid">
          <div className="booking-info-item">
            <div className="info-icon">
              <FaCalendarAlt />
            </div>
            <div className="info-content">
              <h4>Date</h4>
              <p>{formatDate(showtime.date)}</p>
            </div>
          </div>

          <div className="booking-info-item">
            <div className="info-icon">
              <FaClock />
            </div>
            <div className="info-content">
              <h4>Time</h4>
              <p>{showtime.time}</p>
            </div>
          </div>

          <div className="booking-info-item">
            <div className="info-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="info-content">
              <h4>Theater</h4>
              <p>{theater.name}</p>
              <p className="info-secondary">{theater.location}</p>
            </div>
          </div>

          <div className="booking-info-item">
            <div className="info-icon">
              <FaFilm />
            </div>
            <div className="info-content">
              <h4>Screen</h4>
              <p>{showtime.screen || showtime.hall}</p>
              <p className="info-secondary">{showtime.format}</p>
            </div>
          </div>

          <div className="booking-info-item">
            <div className="info-icon">
              <FaCouch />
            </div>
            <div className="info-content">
              <h4>Seats</h4>
              <p>{seats.map(seat => seat.id).join(', ')}</p>
            </div>
          </div>

          <div className="booking-info-item">
            <div className="info-icon">
              <FaMoneyBillWave />
            </div>
            <div className="info-content">
              <h4>Total Amount</h4>
              <p className="total-amount">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="ticket-actions">
        <button 
          className="action-button primary" 
          onClick={onViewTickets}
        >
          <FaTicketAlt />
          View Tickets
        </button>
        
        <button 
          className="action-button secondary" 
          onClick={onDownloadTickets}
        >
          <FaDownload />
          Download
        </button>
        
        <button 
          className="action-button secondary" 
          onClick={onEmailTickets}
        >
          <FaEnvelope />
          Email
        </button>
      </div>

      <div className="confirmation-footer">
        <p>A confirmation email has been sent to your registered email address.</p>
        <div className="navigation-links">
          <Link to="/my-bookings" className="nav-link">My Bookings</Link>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/movies" className="nav-link">Browse Movies</Link>
        </div>
      </div>
    </div>
  );
};

BookingConfirmation.propTypes = {
  booking: PropTypes.object,
  movie: PropTypes.object.isRequired,
  showtime: PropTypes.object.isRequired,
  seats: PropTypes.array.isRequired,
  theater: PropTypes.object.isRequired,
  totalAmount: PropTypes.number.isRequired,
  bookingReference: PropTypes.string,
  onViewTickets: PropTypes.func.isRequired,
  onDownloadTickets: PropTypes.func.isRequired,
  onEmailTickets: PropTypes.func.isRequired
};

export default BookingConfirmation;

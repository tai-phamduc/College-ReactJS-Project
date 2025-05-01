import React, { useState, useEffect } from 'react';
import { FaCouch, FaWheelchair, FaHeart } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './SeatSelectionMap.css';

const SeatSelectionMap = ({ 
  availableSeats, 
  selectedSeats, 
  onSeatSelect, 
  loading,
  showLegend = true,
  maxSelectableSeats = 10
}) => {
  const [seatMap, setSeatMap] = useState([]);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!availableSeats || availableSeats.length === 0) return;

    try {
      // Extract unique rows
      const uniqueRows = [...new Set(
        availableSeats
          .filter(seat => seat.row && !seat.isLabel && !seat.isAisle)
          .map(seat => seat.row)
      )].sort();
      
      setRows(uniqueRows);
      setSeatMap(availableSeats);
    } catch (err) {
      console.error('Error processing seat map:', err);
      setError('Failed to load seat map. Please try again.');
    }
  }, [availableSeats]);

  const getSeatTypeClass = (seat) => {
    if (seat.status === 'booked') return 'seat-booked';
    if (selectedSeats.some(s => s.id === seat.id)) return 'seat-selected';
    
    switch(seat.type) {
      case 'premium': return 'seat-premium';
      case 'preferred': return 'seat-preferred';
      case 'rear': return 'seat-rear';
      case 'accessible': return 'seat-accessible';
      case 'love': return 'seat-love';
      default: return 'seat-standard';
    }
  };

  const getSeatIcon = (seat) => {
    if (seat.type === 'accessible') return <FaWheelchair />;
    if (seat.type === 'love') return <FaHeart />;
    return <FaCouch />;
  };

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') return;
    
    // Check if we're at the maximum number of selectable seats
    if (!selectedSeats.some(s => s.id === seat.id) && 
        selectedSeats.length >= maxSelectableSeats) {
      setError(`You can select a maximum of ${maxSelectableSeats} seats.`);
      return;
    }
    
    setError(null);
    onSeatSelect(seat);
  };

  if (loading) {
    return (
      <div className="seat-map-loading">
        <div className="loading-spinner"></div>
        <p>Loading seat map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seat-map-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!seatMap.length || !rows.length) {
    return (
      <div className="seat-map-empty">
        <p>No seat information available.</p>
      </div>
    );
  }

  return (
    <div className="seat-selection-container">
      {/* Screen */}
      <div className="screen-container">
        <div className="screen"></div>
        <p className="screen-label">SCREEN</p>
      </div>
      
      {/* Seat Map */}
      <div className="seat-map">
        {rows.map(row => (
          <div key={row} className="seat-row">
            {/* Row Label */}
            <div className="row-label">{row}</div>
            
            {/* Seats */}
            <div className="seats-container">
              {seatMap
                .filter(seat => seat.row === row)
                .sort((a, b) => a.number - b.number)
                .map(seat => {
                  if (seat.isAisle) {
                    return <div key={seat.id} className="seat-aisle"></div>;
                  }
                  
                  return (
                    <button
                      key={seat.id}
                      className={`seat ${getSeatTypeClass(seat)}`}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.status === 'booked'}
                      aria-label={`Seat ${seat.id} - ${seat.type} - ${seat.status}`}
                      title={`${seat.id} - ${seat.type.charAt(0).toUpperCase() + seat.type.slice(1)} Seat`}
                    >
                      {getSeatIcon(seat)}
                      <span className="seat-number">{seat.number}</span>
                    </button>
                  );
                })}
            </div>
            
            {/* Row Label (end) */}
            <div className="row-label">{row}</div>
          </div>
        ))}
      </div>
      
      {/* Seat Legend */}
      {showLegend && (
        <div className="seat-legend">
          <div className="legend-item">
            <div className="legend-icon seat-standard"><FaCouch /></div>
            <span>Standard</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon seat-premium"><FaCouch /></div>
            <span>Premium (+$3)</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon seat-preferred"><FaCouch /></div>
            <span>Preferred (+$2)</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon seat-rear"><FaCouch /></div>
            <span>Rear (-$1)</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon seat-accessible"><FaWheelchair /></div>
            <span>Accessible</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon seat-love"><FaHeart /></div>
            <span>Love Seat (+$5)</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon seat-selected"><FaCouch /></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon seat-booked"><FaCouch /></div>
            <span>Booked</span>
          </div>
        </div>
      )}
    </div>
  );
};

SeatSelectionMap.propTypes = {
  availableSeats: PropTypes.array.isRequired,
  selectedSeats: PropTypes.array.isRequired,
  onSeatSelect: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  showLegend: PropTypes.bool,
  maxSelectableSeats: PropTypes.number
};

export default SeatSelectionMap;

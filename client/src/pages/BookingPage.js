import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt, FaCouch, FaMoneyBillWave } from 'react-icons/fa';
import { movieService, bookingService, authService } from '../services/api';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [step, setStep] = useState(1);
  const [theaters, setTheaters] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [loadingTheaters, setLoadingTheaters] = useState(false);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Generate 7 days from today
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      const displayDate = date.toLocaleDateString('en-US', options);

      dates.push({
        id: i + 1,
        date: date,
        display: displayDate,
        isToday: i === 0
      });
    }

    return dates;
  };

  const dates = generateDates();

  // Theaters and showtimes will be fetched from the API

  // Generate a more realistic seat map with different seat types and sections
  const generateSeatMap = () => {
    const rows = 'ABCDEFGHIJ'.split('');
    const seatMap = [];
    const premiumRows = ['A', 'B']; // First two rows are premium
    const lastRows = ['I', 'J']; // Last two rows

    // Create a pattern of booked seats that looks more realistic
    const createBookedPattern = () => {
      // Common patterns: couples (2 adjacent seats), families (3-4 adjacent seats)
      const patterns = {};

      // Some random bookings for couples (2 adjacent seats)
      for (let i = 0; i < 8; i++) {
        const row = rows[Math.floor(Math.random() * rows.length)];
        const startSeat = Math.floor(Math.random() * 9) + 1; // 1-9 to ensure we don't go out of bounds
        patterns[`${row}${startSeat}`] = true;
        patterns[`${row}${startSeat + 1}`] = true;
      }

      // A few family bookings (4 adjacent seats)
      for (let i = 0; i < 3; i++) {
        const row = rows[Math.floor(Math.random() * rows.length)];
        const startSeat = Math.floor(Math.random() * 7) + 1; // 1-7 to ensure we don't go out of bounds
        for (let j = 0; j < 4; j++) {
          patterns[`${row}${startSeat + j}`] = true;
        }
      }

      // Some single bookings
      for (let i = 0; i < 10; i++) {
        const row = rows[Math.floor(Math.random() * rows.length)];
        const seat = Math.floor(Math.random() * 10) + 1;
        patterns[`${row}${seat}`] = true;
      }

      return patterns;
    };

    const bookedSeats = createBookedPattern();

    // Generate seats row by row
    rows.forEach(row => {
      // Add row label at the beginning
      seatMap.push({
        id: `${row}-label`,
        isLabel: true,
        label: row
      });

      for (let i = 1; i <= 12; i++) {
        // Add aisle after seats 4 and 8
        if (i === 5 || i === 9) {
          seatMap.push({
            id: `${row}-aisle-${i}`,
            isAisle: true
          });
        }

        // Skip seats 5 and 9 (they're aisles)
        if (i === 5 || i === 9) continue;

        const seatId = `${row}${i}`;
        const isBooked = bookedSeats[seatId] || false;
        const isPremium = premiumRows.includes(row);
        const isRearRow = lastRows.includes(row);

        // Determine seat type
        let seatType = 'standard';
        if (isPremium) seatType = 'premium';
        if (isRearRow) seatType = 'rear';

        // Middle seats (3-4, 6-7) in rows C-H are "preferred" seats
        if (!isPremium && !isRearRow &&
            (i === 3 || i === 4 || i === 6 || i === 7 || i === 10 || i === 11)) {
          seatType = 'preferred';
        }

        seatMap.push({
          id: seatId,
          row,
          number: i,
          status: isBooked ? 'booked' : 'available',
          type: seatType
        });
      }

      // Add row label at the end
      seatMap.push({
        id: `${row}-label-end`,
        isLabel: true,
        label: row
      });
    });

    return seatMap;
  };

  const rows = 'ABCDEFGHIJ'.split('');
  const seatMap = generateSeatMap();

  useEffect(() => {
    // Check if user is logged in
    const user = authService.getCurrentUser();
    setCurrentUser(user);

    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await movieService.getMovieById(id);
        setMovie(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Failed to load movie details. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Fetch theaters when a date is selected
  useEffect(() => {
    if (!selectedDate || !id) return;

    const fetchTheaters = async () => {
      try {
        setLoadingTheaters(true);

        // Format the date for API request
        const formattedDate = selectedDate.date.toISOString().split('T')[0];

        // Use the bookingService to get theaters for the movie and date
        const data = await bookingService.getTheatersByMovieAndDate(id, formattedDate);

        if (!data || data.length === 0) {
          console.log('No theaters available for this movie and date');
          setTheaters([]);
          setLoadingTheaters(false);
          return;
        }

        // Format the theater data for display
        const formattedTheaters = data.map(theater => {
          // Extract location information
          const location = theater.location ?
            `${theater.location.address}, ${theater.location.city}, ${theater.location.state}` :
            'Location not available';

          // Add a random distance for UI purposes
          const distance = `${(Math.random() * 5 + 0.5).toFixed(1)} miles`;

          return {
            ...theater,
            formattedLocation: location,
            distance: distance
          };
        });

        setTheaters(formattedTheaters);
        setLoadingTheaters(false);
      } catch (err) {
        console.error('Error fetching theaters:', err);

        // Fallback to sample data if API fails
        const fallbackTheaters = [
          {
            _id: '680fa672205b620d90c2f65e',
            name: 'Cinema City Multiplex',
            formattedLocation: '123 Main Street, New York, NY',
            distance: '1.2 miles',
            halls: [
              { name: 'Hall 1 - IMAX', capacity: 250, type: 'imax' },
              { name: 'Hall 2 - Standard', capacity: 180, type: 'standard' },
              { name: 'Hall 3 - VIP', capacity: 80, type: 'vip' }
            ]
          },
          {
            _id: '680fa672205b620d90c2f65f',
            name: 'Starlight Multiplex',
            formattedLocation: '456 Broadway Avenue, Los Angeles, CA',
            distance: '2.5 miles',
            halls: [
              { name: 'Screen 1 - Premium', capacity: 200, type: 'premium' },
              { name: 'Screen 2 - 3D', capacity: 150, type: '3d' },
              { name: 'Screen 3 - Standard', capacity: 120, type: 'standard' }
            ]
          }
        ];

        setTheaters(fallbackTheaters);
        setLoadingTheaters(false);
      }
    };

    // Add a small delay to prevent UI freezing
    const timerId = setTimeout(() => {
      fetchTheaters();
    }, 100);

    return () => clearTimeout(timerId);
  }, [id, selectedDate]);

  // Fetch showtimes when a theater is selected
  useEffect(() => {
    if (!selectedTheater || !selectedDate || !id) return;

    const fetchShowtimes = async () => {
      try {
        setLoadingShowtimes(true);

        // Format the date for API request
        const formattedDate = selectedDate.date.toISOString().split('T')[0];

        // Use the bookingService to get screenings for the movie, cinema, and date
        const data = await bookingService.getScreeningsByMovieCinemaDate(
          id,
          selectedTheater._id,
          formattedDate
        );

        if (!data || data.length === 0) {
          console.log('No showtimes available for this movie, theater, and date');
          setShowtimes([]);
          setLoadingShowtimes(false);
          return;
        }

        // Format the showtimes for display
        const formattedShowtimes = data.map(showtime => ({
          id: showtime._id,
          time: showtime.displayTime || new Date(showtime.startTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          format: showtime.format || '2D',
          price: showtime.price || 12.99,
          hall: showtime.hall || 'Hall 1',
          startTime: showtime.startTime,
          endTime: showtime.endTime,
          seatsAvailable: showtime.seatsAvailable || 100,
          bookedSeats: showtime.bookedSeats || [],
          reservedSeats: showtime.reservedSeats || []
        }));

        setShowtimes(formattedShowtimes);
        setLoadingShowtimes(false);
      } catch (err) {
        console.error('Error fetching showtimes:', err);

        // Fallback to sample data if API fails
        const fallbackShowtimes = [
          {
            id: `${selectedTheater._id}-1`,
            time: '10:00 AM',
            format: '2D',
            price: 12.99,
            hall: 'Hall 1',
            seatsAvailable: 85,
            bookedSeats: [],
            reservedSeats: []
          },
          {
            id: `${selectedTheater._id}-2`,
            time: '1:00 PM',
            format: '2D',
            price: 12.99,
            hall: 'Hall 2',
            seatsAvailable: 92,
            bookedSeats: [],
            reservedSeats: []
          },
          {
            id: `${selectedTheater._id}-3`,
            time: '4:00 PM',
            format: '3D',
            price: 14.99,
            hall: 'Hall 3',
            seatsAvailable: 78,
            bookedSeats: [],
            reservedSeats: []
          },
          {
            id: `${selectedTheater._id}-4`,
            time: '7:00 PM',
            format: 'IMAX',
            price: 17.99,
            hall: 'Hall 1 - IMAX',
            seatsAvailable: 65,
            bookedSeats: [],
            reservedSeats: []
          }
        ];

        setShowtimes(fallbackShowtimes);
        setLoadingShowtimes(false);
      }
    };

    // Add a small delay to prevent UI freezing
    const timerId = setTimeout(() => {
      fetchShowtimes();
    }, 100);

    return () => clearTimeout(timerId);
  }, [id, selectedTheater, selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTheater(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
  };

  const handleTheaterSelect = (theater) => {
    setSelectedTheater(theater);
    setSelectedShowtime(null);
    setSelectedSeats([]);
  };

  const handleShowtimeSelect = async (showtime) => {
    setSelectedShowtime(showtime);
    setSelectedSeats([]);

    try {
      setLoadingSeats(true);

      // Try to fetch available seats from the API
      const seats = await bookingService.getAvailableSeats(showtime.id);

      // If we have seat data from the API, use it
      if (seats && seats.length > 0) {
        // Create a map of booked seats
        const bookedSeatsMap = {};

        // If the showtime has booked seats, mark them as booked
        if (showtime.bookedSeats && showtime.bookedSeats.length > 0) {
          showtime.bookedSeats.forEach(seatId => {
            bookedSeatsMap[seatId] = true;
          });
        }

        // Update the seat map with the booked seats
        const updatedSeatMap = seatMap.map(seat => {
          if (seat.id && bookedSeatsMap[seat.id]) {
            return { ...seat, status: 'booked' };
          }
          return seat;
        });

        setAvailableSeats(updatedSeatMap);
      } else {
        // If no seat data from API, create a realistic pattern of booked seats
        const createRealisticBookedSeats = () => {
          // Create a pattern of booked seats that looks realistic based on the showtime
          const bookedSeatsMap = {};
          const rows = 'ABCDEFGHIJ'.split('');

          // More seats are booked for popular showtimes (evening shows)
          const isEveningShow = showtime.time.includes('PM') &&
                               (showtime.time.includes('7:00') ||
                                showtime.time.includes('8:30') ||
                                showtime.time.includes('10:00'));

          const isPremiumFormat = showtime.format === 'IMAX' ||
                                 showtime.format === '3D' ||
                                 showtime.format === '4DX';

          // Number of booked seats depends on time and format
          const numberOfBookings = isEveningShow ?
                                 (isPremiumFormat ? 25 : 20) :
                                 (isPremiumFormat ? 15 : 10);

          // Book some random seats
          for (let i = 0; i < numberOfBookings; i++) {
            const row = rows[Math.floor(Math.random() * rows.length)];
            const seatNumber = Math.floor(Math.random() * 12) + 1;
            // Skip aisles (seats 5 and 9)
            if (seatNumber !== 5 && seatNumber !== 9) {
              bookedSeatsMap[`${row}${seatNumber}`] = true;
            }
          }

          // Book some specific patterns (couples, families)
          // Couples (2 adjacent seats)
          for (let i = 0; i < 4; i++) {
            const row = rows[Math.floor(Math.random() * rows.length)];
            const startSeat = [1, 2, 3, 6, 7, 10, 11][Math.floor(Math.random() * 7)];
            bookedSeatsMap[`${row}${startSeat}`] = true;
            bookedSeatsMap[`${row}${startSeat + 1}`] = true;
          }

          // Family (4 adjacent seats)
          const familyRow = rows[Math.floor(Math.random() * rows.length)];
          const familyStart = Math.random() < 0.5 ? 1 : 6; // Either seats 1-4 or 6-8,10
          for (let i = 0; i < 4; i++) {
            const seatNum = familyStart + i;
            // Skip aisles
            if (seatNum !== 5 && seatNum !== 9) {
              bookedSeatsMap[`${familyRow}${seatNum}`] = true;
            }
          }

          return bookedSeatsMap;
        };

        // Update the seat map with the simulated booked seats
        const bookedSeatsMap = createRealisticBookedSeats();
        const updatedSeatMap = seatMap.map(seat => {
          if (seat.id && bookedSeatsMap[seat.id]) {
            return { ...seat, status: 'booked' };
          }
          return seat;
        });

        setAvailableSeats(updatedSeatMap);
      }

      setLoadingSeats(false);
    } catch (err) {
      console.error('Error fetching available seats:', err);

      // Fallback to the generated seat map with some random booked seats
      const fallbackBookedSeats = {};
      const rows = 'ABCDEFGHIJ'.split('');

      // Book 15 random seats
      for (let i = 0; i < 15; i++) {
        const row = rows[Math.floor(Math.random() * rows.length)];
        const seatNumber = Math.floor(Math.random() * 12) + 1;
        if (seatNumber !== 5 && seatNumber !== 9) {
          fallbackBookedSeats[`${row}${seatNumber}`] = true;
        }
      }

      // Update the seat map with the fallback booked seats
      const updatedSeatMap = seatMap.map(seat => {
        if (seat.id && fallbackBookedSeats[seat.id]) {
          return { ...seat, status: 'booked' };
        }
        return seat;
      });

      setAvailableSeats(updatedSeatMap);
      setLoadingSeats(false);
    }
  };

  const handleSeatSelect = (seat) => {
    if (seat.status === 'booked') return;

    const seatIndex = selectedSeats.findIndex(s => s.id === seat.id);

    if (seatIndex === -1) {
      // Add seat if not already selected
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      // Remove seat if already selected
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    }
  };

  const handleContinue = async () => {
    if (step === 1 && selectedShowtime) {
      setStep(2);
    } else if (step === 2 && selectedSeats.length > 0) {
      setStep(3);
    } else if (step === 3) {
      // Check if user is logged in
      if (!currentUser) {
        // Redirect to login page with return URL
        navigate(`/login?redirect=/booking/${id}`);
        return;
      }

      try {
        setPaymentProcessing(true);
        setBookingError(null);

        // Calculate total price
        const totals = calculateTotal();

        // Get payment method (credit_card or paypal)
        const paymentMethod = document.getElementById('credit-card').checked ? 'credit_card' : 'paypal';

        // Get current date and time
        const bookingDate = new Date().toISOString();

        // Create booking object with detailed information
        const bookingData = {
          // Basic booking info
          movieId: id,
          showtimeId: selectedShowtime.id,
          theaterId: selectedTheater._id,
          userId: currentUser._id || currentUser.id,

          // Seat information
          seats: selectedSeats.map(seat => seat.id),
          seatCount: selectedSeats.length,

          // Price details
          basePrice: parseFloat(selectedShowtime.price),
          subtotal: parseFloat(totals.subtotal),
          tax: parseFloat(totals.tax),
          serviceFee: parseFloat(totals.serviceFee),
          totalPrice: parseFloat(totals.total),

          // Payment details
          paymentMethod: paymentMethod,
          paymentStatus: 'completed', // For demo purposes
          bookingStatus: 'confirmed', // For demo purposes

          // Additional information
          bookingDate: bookingDate,
          bookingReference: `BK-${Date.now().toString().slice(-8)}`, // Generate a booking reference

          // Movie and showtime details for history
          movieDetails: {
            title: movie.title,
            poster: movie.poster,
            duration: movie.duration
          },
          showtimeDetails: {
            date: selectedDate.display,
            time: selectedShowtime.time,
            format: selectedShowtime.format,
            hall: selectedShowtime.hall
          },
          theaterDetails: {
            name: selectedTheater.name,
            location: selectedTheater.formattedLocation || selectedTheater.location?.address || 'Location not available'
          }
        };

        // Submit booking to API
        const response = await bookingService.createBooking(bookingData);

        // Save booking to history
        if (response && response._id) {
          try {
            await bookingService.saveBookingToHistory(response._id);
          } catch (historyError) {
            console.error('Error saving booking to history:', historyError);
            // Continue with success flow even if history saving fails
          }
        }

        setPaymentProcessing(false);
        setBookingSuccess(true);

        // Store booking reference in local storage for display on tickets page
        localStorage.setItem('lastBookingReference', bookingData.bookingReference);

        // Show success message and redirect after a delay
        setTimeout(() => {
          navigate('/my-tickets');
        }, 3000);
      } catch (err) {
        console.error('Error creating booking:', err);
        setPaymentProcessing(false);

        // Provide more specific error message based on the error
        if (err.response && err.response.data && err.response.data.message) {
          setBookingError(err.response.data.message);
        } else if (err.message && err.message.includes('network')) {
          setBookingError('Network error. Please check your internet connection and try again.');
        } else {
          setBookingError('Failed to process your booking. Please try again.');
        }
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(`/movies/${id}`);
    }
  };

  const calculateTotal = () => {
    if (!selectedShowtime || selectedSeats.length === 0) {
      return {
        subtotal: '0.00',
        tax: '0.00',
        serviceFee: '0.00',
        total: '0.00'
      };
    }

    // Calculate base price
    let subtotal = 0;

    // Add price for each seat based on type
    selectedSeats.forEach(seat => {
      let seatPrice = selectedShowtime.price;

      // Apply price adjustments based on seat type
      switch(seat.type) {
        case 'premium':
          seatPrice += 3; // $3 extra for premium seats
          break;
        case 'preferred':
          seatPrice += 2; // $2 extra for preferred seats
          break;
        case 'rear':
          seatPrice -= 1; // $1 discount for rear seats
          break;
      }

      subtotal += seatPrice;
    });

    const tax = subtotal * 0.1; // 10% tax
    const serviceFee = selectedSeats.length * 1.5; // $1.5 per ticket service fee

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      serviceFee: serviceFee.toFixed(2),
      total: (subtotal + tax + serviceFee).toFixed(2)
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-dark py-12">
        <div className="container">
          <div className="bg-secondary p-6 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-gray-300 mb-6">{error || 'Movie not found'}</p>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-primary flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-300 hover:text-primary mb-4"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold mb-2">Book Tickets</h1>
          <div className="flex items-center">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-16 h-24 object-cover rounded mr-4"
            />
            <div>
              <h2 className="text-xl font-semibold">{movie.title}</h2>
              <div className="flex items-center text-gray-400 text-sm mt-1">
                <FaClock className="mr-1" />
                <span>{movie.duration} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Steps */}
        <div className="bg-secondary rounded-lg p-6 mb-8">
          <div className="flex justify-between mb-8">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-700'}`}>1</div>
              <span>Showtime</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${step >= 2 ? 'bg-primary' : 'bg-gray-700'}`}></div>
            </div>
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-700'}`}>2</div>
              <span>Seats</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${step >= 3 ? 'bg-primary' : 'bg-gray-700'}`}></div>
            </div>
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-700'}`}>3</div>
              <span>Payment</span>
            </div>
          </div>

          {/* Step 1: Select Showtime */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Select Date</h3>
              <div className="flex overflow-x-auto md:grid md:grid-cols-7 gap-2 mb-8 pb-2 -mx-1 px-1">
                {dates.map(date => (
                  <button
                    key={date.id}
                    className={`p-2 rounded-lg border flex-shrink-0 md:flex-shrink w-[calc(100%/7-0.5rem)] md:w-auto mx-1 md:mx-0 ${selectedDate?.id === date.id ? 'border-primary bg-primary bg-opacity-20' : 'border-gray-700'} hover:border-primary transition-colors`}
                    onClick={() => handleDateSelect(date)}
                  >
                    <div className="flex flex-col items-center">
                      <FaCalendarAlt className={`${date.isToday ? 'text-primary' : ''}`} />
                      <span className="text-xs font-medium mt-1">{date.isToday ? 'Today' : date.date.toLocaleDateString('en-US', {weekday: 'short'})}</span>
                      <span className="text-xs mt-0.5">{date.date.getDate()}</span>
                      <span className="text-xs text-gray-400">{date.date.toLocaleDateString('en-US', {month: 'short'})}</span>
                    </div>
                  </button>
                ))}
              </div>

              {selectedDate && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Select Theater</h3>

                  {loadingTheaters ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : theaters.length === 0 ? (
                    <div className="bg-gray-800 p-6 rounded-lg text-center mb-8">
                      <p className="text-gray-400">No theaters available for this date. Please select another date.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-8">
                      {theaters.map(theater => (
                        <button
                          key={theater._id}
                          className={`w-full p-4 rounded-lg border ${selectedTheater?._id === theater._id ? 'border-primary bg-primary bg-opacity-20' : 'border-gray-700'} hover:border-primary transition-colors text-left`}
                          onClick={() => handleTheaterSelect(theater)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold">{theater.name}</h4>
                              <div className="flex items-center text-gray-400 text-sm mt-1">
                                <FaMapMarkerAlt className="mr-1" />
                                <span>{theater.formattedLocation || theater.location?.address || 'Location not available'}</span>
                              </div>
                            </div>
                            <span className="text-gray-400 text-sm">{theater.distance || ''}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {selectedTheater && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Select Showtime</h3>

                  {loadingShowtimes ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : showtimes.length === 0 ? (
                    <div className="bg-gray-800 p-6 rounded-lg text-center mb-8">
                      <p className="text-gray-400">No showtimes available for this date and theater. Please select another date or theater.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                      {showtimes.map(showtime => (
                        <button
                          key={showtime.id}
                          className={`p-3 rounded-lg border ${selectedShowtime?.id === showtime.id ? 'border-primary bg-primary bg-opacity-20' : 'border-gray-700'} hover:border-primary transition-colors`}
                          onClick={() => handleShowtimeSelect(showtime)}
                          disabled={showtime.seatsAvailable === 0}
                        >
                          <div className="flex flex-col items-center">
                            <span className="font-semibold mb-1">{showtime.time}</span>
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-xs px-1.5 py-0.5 bg-gray-700 rounded">{showtime.format}</span>
                              <span className="text-xs px-1.5 py-0.5 bg-gray-700 rounded">{showtime.hall}</span>
                            </div>
                            <span className="text-sm">${showtime.price.toFixed(2)}</span>
                            {showtime.seatsAvailable !== undefined && (
                              <span className={`text-xs mt-1 ${showtime.seatsAvailable < 10 ? 'text-red-400' : 'text-gray-400'}`}>
                                {showtime.seatsAvailable === 0 ? 'Sold Out' :
                                 showtime.seatsAvailable < 10 ? `${showtime.seatsAvailable} seats left` :
                                 'Available'}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 2: Select Seats */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Select Seats</h3>

              <div className="mb-8">
                {/* Screen */}
                <div className="w-full bg-gray-800 p-4 rounded-lg mb-8 text-center relative overflow-hidden">
                  <div className="w-3/4 h-1 bg-white mx-auto mb-8 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                  <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-semibold">Screen</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent opacity-60"></div>
                </div>

                {/* Seat Map Container */}
                <div className="max-w-4xl mx-auto mb-8 overflow-x-auto pb-4">
                  <div className="grid grid-flow-row gap-2 min-w-max">
                    {/* Seat Map */}
                    {loadingSeats ? (
                      <div className="flex justify-center items-center py-16 col-span-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : rows.map(row => (
                      <div key={row} className="flex items-center gap-2">
                        {(availableSeats.length > 0 ? availableSeats : seatMap)
                          .filter(seat => seat.row === row || (seat.isLabel && seat.label === row))
                          .map(seat => {
                            if (seat.isLabel) {
                              return (
                                <div
                                  key={seat.id}
                                  className="w-8 h-8 flex items-center justify-center text-gray-400 font-semibold"
                                >
                                  {seat.label}
                                </div>
                              );
                            }

                            if (seat.isAisle) {
                              return (
                                <div
                                  key={seat.id}
                                  className="w-4 h-8"
                                ></div>
                              );
                            }

                            // Determine seat style based on type and status
                            let seatStyle = '';
                            if (seat.status === 'booked') {
                              seatStyle = 'bg-gray-700 cursor-not-allowed opacity-50';
                            } else if (selectedSeats.some(s => s.id === seat.id)) {
                              seatStyle = 'bg-primary border-primary shadow-[0_0_8px_rgba(220,38,38,0.5)]';
                            } else {
                              switch(seat.type) {
                                case 'premium':
                                  seatStyle = 'bg-yellow-900/30 border-yellow-600 hover:bg-yellow-900/50';
                                  break;
                                case 'preferred':
                                  seatStyle = 'bg-blue-900/30 border-blue-600 hover:bg-blue-900/50';
                                  break;
                                case 'rear':
                                  seatStyle = 'bg-gray-800/80 border-gray-700 hover:bg-gray-700';
                                  break;
                                default:
                                  seatStyle = 'bg-gray-800 border-gray-700 hover:bg-gray-700';
                              }
                            }

                            return (
                              <button
                                key={seat.id}
                                disabled={seat.status === 'booked'}
                                className={`
                                  w-8 h-8 rounded flex items-center justify-center text-xs
                                  border transition-all duration-200 transform
                                  ${seatStyle}
                                  ${selectedSeats.some(s => s.id === seat.id) ? 'scale-110' : ''}
                                `}
                                onClick={() => handleSeatSelect(seat)}
                                title={`${seat.id} - ${seat.type.charAt(0).toUpperCase() + seat.type.slice(1)} Seat`}
                              >
                                {seat.number}
                              </button>
                            );
                          })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seat Legend */}
                <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-4 text-center">Seat Types</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-yellow-900/30 border border-yellow-600 rounded mr-2"></div>
                      <span className="text-sm">Premium - $3 extra</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-900/30 border border-blue-600 rounded mr-2"></div>
                      <span className="text-sm">Preferred - $2 extra</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-800 border border-gray-700 rounded mr-2"></div>
                      <span className="text-sm">Standard</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-800/80 border border-gray-700 rounded mr-2"></div>
                      <span className="text-sm">Rear - $1 discount</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 my-4"></div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-primary border border-primary rounded mr-2 shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>
                      <span className="text-sm">Selected</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-700 border border-gray-700 rounded mr-2 opacity-50"></div>
                      <span className="text-sm">Booked</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 border border-dashed border-gray-500 rounded mr-2"></div>
                      <span className="text-sm">Available</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-lg">Selected Seats</h4>
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedSeats.map(seat => {
                      // Determine badge color based on seat type
                      let badgeClass = 'bg-gray-700';
                      if (seat.type === 'premium') badgeClass = 'bg-yellow-900/50 border border-yellow-600';
                      if (seat.type === 'preferred') badgeClass = 'bg-blue-900/50 border border-blue-600';
                      if (seat.type === 'rear') badgeClass = 'bg-gray-800 border border-gray-700';

                      return (
                        <div
                          key={seat.id}
                          className={`${badgeClass} px-3 py-1.5 rounded-lg text-sm flex items-center group relative`}
                        >
                          <span className="font-medium">{seat.id}</span>
                          <button
                            onClick={() => handleSeatSelect(seat)}
                            className="ml-2 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove seat"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>Base price:</span>
                      <span>${selectedShowtime.price.toFixed(2)} per seat</span>
                    </div>

                    {/* Calculate extra charges based on seat types */}
                    {['premium', 'preferred', 'rear'].some(type => selectedSeats.some(seat => seat.type === type)) && (
                      <div className="mt-2 space-y-1">
                        {selectedSeats.some(seat => seat.type === 'premium') && (
                          <div className="flex justify-between items-center text-sm text-yellow-500">
                            <span>Premium seats:</span>
                            <span>+$3.00 each × {selectedSeats.filter(s => s.type === 'premium').length}</span>
                          </div>
                        )}
                        {selectedSeats.some(seat => seat.type === 'preferred') && (
                          <div className="flex justify-between items-center text-sm text-blue-500">
                            <span>Preferred seats:</span>
                            <span>+$2.00 each × {selectedSeats.filter(s => s.type === 'preferred').length}</span>
                          </div>
                        )}
                        {selectedSeats.some(seat => seat.type === 'rear') && (
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Rear seats:</span>
                            <span>-$1.00 each × {selectedSeats.filter(s => s.type === 'rear').length}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4 font-semibold">
                      <span>Total Seats:</span>
                      <span>{selectedSeats.length}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span>Movie:</span>
                  <span>{movie.title}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Date:</span>
                  <span>{selectedDate.display}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Time:</span>
                  <span>{selectedShowtime.time} ({selectedShowtime.format})</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Theater:</span>
                  <span>{selectedTheater.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Seats:</span>
                  <span>{selectedSeats.map(seat => seat.id).join(', ')}</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">Payment Details</h3>

              <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Base Tickets ({selectedSeats.length} x ${selectedShowtime.price}):</span>
                    <span>${(selectedShowtime.price * selectedSeats.length).toFixed(2)}</span>
                  </div>

                  {/* Seat type adjustments */}
                  {selectedSeats.some(seat => seat.type === 'premium') && (
                    <div className="flex justify-between items-center text-yellow-500">
                      <span>Premium Seat Upgrade:</span>
                      <span>+${(selectedSeats.filter(s => s.type === 'premium').length * 3).toFixed(2)}</span>
                    </div>
                  )}

                  {selectedSeats.some(seat => seat.type === 'preferred') && (
                    <div className="flex justify-between items-center text-blue-500">
                      <span>Preferred Seat Upgrade:</span>
                      <span>+${(selectedSeats.filter(s => s.type === 'preferred').length * 2).toFixed(2)}</span>
                    </div>
                  )}

                  {selectedSeats.some(seat => seat.type === 'rear') && (
                    <div className="flex justify-between items-center text-gray-500">
                      <span>Rear Seat Discount:</span>
                      <span>-${(selectedSeats.filter(s => s.type === 'rear').length * 1).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="font-medium">${calculateTotal().subtotal}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tax (10%):</span>
                    <span>${calculateTotal().tax}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Service Fee (${(1.5).toFixed(2)}/ticket):</span>
                    <span>${calculateTotal().serviceFee}</span>
                  </div>

                  <div className="border-t border-gray-700 my-3 pt-3"></div>

                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-primary">${calculateTotal().total}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">Payment Method</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border border-primary rounded-lg p-5 bg-primary bg-opacity-10 hover:bg-opacity-20 transition-colors cursor-pointer shadow-lg relative">
                  <input
                    type="radio"
                    id="credit-card"
                    name="payment-method"
                    className="absolute opacity-0"
                    defaultChecked
                  />
                  <label htmlFor="credit-card" className="flex flex-col cursor-pointer">
                    <div className="flex items-center mb-3">
                      <div className="w-5 h-5 rounded-full border-2 border-primary mr-3 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                      </div>
                      <span className="font-semibold">Credit / Debit Card</span>
                    </div>
                    <div className="flex space-x-2 mb-3">
                      <div className="w-10 h-6 bg-blue-600 rounded"></div>
                      <div className="w-10 h-6 bg-red-500 rounded"></div>
                      <div className="w-10 h-6 bg-yellow-500 rounded"></div>
                      <div className="w-10 h-6 bg-gray-700 rounded"></div>
                    </div>
                    <p className="text-sm text-gray-400">
                      Safe and secure payment with credit or debit card.
                    </p>
                  </label>
                </div>

                <div className="border border-gray-700 rounded-lg p-5 hover:border-gray-500 transition-colors cursor-pointer shadow-lg relative">
                  <input
                    type="radio"
                    id="paypal"
                    name="payment-method"
                    className="absolute opacity-0"
                  />
                  <label htmlFor="paypal" className="flex flex-col cursor-pointer">
                    <div className="flex items-center mb-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-500 mr-3 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-transparent"></div>
                      </div>
                      <span className="font-semibold">PayPal</span>
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="w-16 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">
                        Pay<span className="text-blue-300">Pal</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      Fast and secure payment with your PayPal account.
                    </p>
                  </label>
                </div>
              </div>

              <div className="bg-gray-800/50 p-5 rounded-lg mb-6 border border-gray-700">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-300 font-medium mb-1">
                      Demo Implementation
                    </p>
                    <p className="text-sm text-gray-400">
                      This is a demo implementation. No actual payment will be processed. Your booking information will be saved for demonstration purposes only.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {bookingSuccess && (
            <div className="bg-green-900/50 border border-green-500 p-6 rounded-lg mb-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Booking Successful!</h3>
                <p className="text-gray-300 mb-4">Your tickets have been booked successfully. You will be redirected to your tickets page shortly.</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-primary mb-3">Booking Reference: {`BK-${Date.now().toString().slice(-8)}`}</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Movie</p>
                    <p className="font-medium">{movie.title}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Date & Time</p>
                    <p className="font-medium">{selectedDate.display}, {selectedShowtime.time}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Theater</p>
                    <p className="font-medium">{selectedTheater.name}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Seats</p>
                    <p className="font-medium">{selectedSeats.map(seat => seat.id).join(', ')}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Format</p>
                    <p className="font-medium">{selectedShowtime.format}, {selectedShowtime.hall}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                    <p className="font-medium text-primary">${calculateTotal().total}</p>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-400">
                <p>A confirmation email has been sent to your registered email address.</p>
                <p className="mt-2">You can view your booking details in the "My Tickets" section.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {bookingError && (
            <div className="bg-red-900/50 border border-red-500 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold mb-2">Booking Failed</h3>
              <p className="text-gray-300 mb-4">{bookingError}</p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              className="btn btn-secondary"
              disabled={paymentProcessing || bookingSuccess}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={handleContinue}
              disabled={
                (step === 1 && !selectedShowtime) ||
                (step === 2 && selectedSeats.length === 0) ||
                paymentProcessing ||
                bookingSuccess
              }
              className={`btn btn-primary ${
                (step === 1 && !selectedShowtime) ||
                (step === 2 && selectedSeats.length === 0) ||
                paymentProcessing ||
                bookingSuccess
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {paymentProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : step === 3 ? 'Confirm Payment' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

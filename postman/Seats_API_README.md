# Seats API Postman Collection

This Postman collection contains API requests for testing seat-related endpoints in the Movie Ticket Booking API, with a particular focus on getting available seats for screenings.

## Setup Instructions

1. Install [Postman](https://www.postman.com/downloads/) if you haven't already.
2. Import the collection file (`Seats_API_Collection.json`) into Postman:
   - Open Postman
   - Click "Import" button
   - Select the collection file
   - Click "Import"
3. Import the environment file (`Seats_API_Environment.json`):
   - Click "Import" button
   - Select the environment file
   - Click "Import"
4. Select the "Seats API Environment" from the environment dropdown in the top right corner.
5. Set up the date variable:
   - Click the "Environment quick look" button (eye icon)
   - Set the `date` variable to today's date in YYYY-MM-DD format (e.g., "2023-12-01")

## Environment Variables

The collection uses the following environment variables:

- `baseUrl`: The base URL of the API (default: https://movie-ticket-booking-api.vercel.app)
- `userToken`: JWT token for authenticated user requests
- `movieId`: ID of a movie for testing screening-related endpoints
- `cinemaId`: ID of a cinema for testing screening-related endpoints
- `roomId`: ID of a room within a cinema for testing booking-related endpoints
- `screeningId`: ID of a screening for testing seat-related endpoints
- `showtimeId`: ID of a showtime for testing seat-related endpoints (legacy)
- `seatId1`: ID of a seat for testing seat reservation and booking
- `seatId2`: ID of another seat for testing seat reservation and booking
- `bookingId`: ID of a booking for testing booking-related endpoints
- `date`: Date in YYYY-MM-DD format for testing date-specific endpoints

## Testing Workflow

A typical testing workflow for seat-related operations might look like:

1. **Find a Movie and Cinema**:
   - Run "Get Now Playing Movies" to find a movie ID
   - Set the `movieId` environment variable
   - Run "Get Cinemas by Movie and Date" to find cinemas showing the movie
   - Set the `cinemaId` environment variable

2. **Find a Screening**:
   - Run "Get Screenings by Movie, Cinema and Date" to find screenings
   - From the response, copy a screening ID
   - Set the `screeningId` environment variable

3. **Get Available Seats**:
   - Run "Get Available Seats (Screening)" to see all available seats
   - From the response, copy two seat IDs
   - Set the `seatId1` and `seatId2` environment variables

4. **Reserve Seats** (optional):
   - Run "Reserve Seats" to temporarily hold the selected seats
   - This is useful for testing the seat reservation system

5. **Create a Booking**:
   - Run "Login User" to get an authentication token
   - Set the `userToken` environment variable
   - Run "Create Booking" to book the selected seats
   - From the response, copy the booking ID
   - Set the `bookingId` environment variable

6. **Verify Booking**:
   - Run "Get Booking by ID" to verify the booking details
   - Run "Get Available Seats (Screening)" again to verify the seats are no longer available

## Collection Structure

The collection is organized into the following folders:

- **Authentication**: Login endpoint for user authentication
- **Movies**: Endpoints to get movie data for finding screenings
- **Cinemas**: Endpoints to get cinema data for finding screenings
- **Screenings**: Endpoints to get screening data for finding seats
- **Seats**: The main endpoints for seat operations (get available seats, reserve, release)
- **Bookings**: Endpoints for booking operations (which include seat selection)
- **Cinema Rooms**: Endpoints for cinema room operations (which include seat layouts)

## Key Endpoints

### Get Available Seats (Screening)

- **URL**: `/api/screenings/{screeningId}/seats`
- **Method**: GET
- **Description**: Returns a list of available seats for the specified screening
- **Parameters**:
  - `screeningId`: The ID of the screening
- **Response**: Array of seat objects with details like row, column, seat number, type, and price

### Reserve Seats

- **URL**: `/api/screenings/{screeningId}/reserve`
- **Method**: POST
- **Description**: Temporarily reserves seats for a specified screening (typically for 15 minutes)
- **Parameters**:
  - `screeningId`: The ID of the screening
  - Request Body: `{ "seatIds": ["seatId1", "seatId2", ...] }`
- **Response**: Success message or error if seats are not available

### Release Seats

- **URL**: `/api/screenings/{screeningId}/release`
- **Method**: POST
- **Description**: Releases previously reserved seats
- **Parameters**:
  - `screeningId`: The ID of the screening
  - Request Body: `{ "seatIds": ["seatId1", "seatId2", ...] }`
- **Response**: Success message

## Seat Status Lifecycle

Seats in the system can have the following statuses:

1. **available**: The seat is available for booking
2. **reserved**: The seat is temporarily reserved (typically for 15 minutes)
3. **booked**: The seat has been booked and is no longer available
4. **unavailable**: The seat is not available for booking (e.g., maintenance, blocked)

The typical lifecycle is:
`available` → `reserved` → `booked` or `available` (if reservation expires)

## Notes

- The "Get Available Seats (Screening)" endpoint only returns seats with status "available"
- Seat reservations typically expire after 15 minutes if not confirmed with a booking
- When creating a booking, you should first reserve the seats to prevent conflicts
- The system has both "screenings" and "showtimes" endpoints for historical reasons
- The newer "screenings" endpoints are recommended over the legacy "showtimes" endpoints

## Troubleshooting

- If you get a 404 error, check that the screening ID is valid
- If you get an empty array from "Get Available Seats", the screening might be sold out
- If you can't reserve seats, they might already be reserved or booked by someone else
- Make sure to use the correct seat IDs when reserving seats or creating bookings

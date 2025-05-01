# Screening API Postman Collection

This Postman collection contains API requests for testing screening-related endpoints in the Movie Ticket Booking API, with a particular focus on getting screenings by movie, cinema, date, and other filtering options.

## Setup Instructions

1. Install [Postman](https://www.postman.com/downloads/) if you haven't already.
2. Import the collection file (`Screening_API_Collection.json`) into Postman:
   - Open Postman
   - Click "Import" button
   - Select the collection file
   - Click "Import"
3. Import the environment file (`Screening_API_Environment.json`):
   - Click "Import" button
   - Select the environment file
   - Click "Import"
4. Select the "Screening API Environment" from the environment dropdown in the top right corner.
5. Set up the date variable:
   - Click the "Environment quick look" button (eye icon)
   - Set the `date` variable to today's date in YYYY-MM-DD format (e.g., "2023-12-01")

## Environment Variables

The collection uses the following environment variables:

- `baseUrl`: The base URL of the API (default: https://movie-ticket-booking-api.vercel.app)
- `adminToken`: JWT token for admin authentication (required for admin operations)
- `userToken`: JWT token for user authentication (required for booking operations)
- `movieId`: ID of a movie for testing screening-related endpoints
- `cinemaId`: ID of a cinema for testing screening-related endpoints
- `theaterId`: ID of a theater for testing legacy showtime endpoints
- `roomId`: ID of a room within a cinema for testing screening creation
- `screeningId`: ID of a screening for testing specific screening operations
- `showtimeId`: ID of a showtime for testing legacy showtime endpoints
- `seatId1`, `seatId2`: IDs of seats for testing seat reservation and booking
- `date`: Date in YYYY-MM-DD format for testing date-specific endpoints
- `displayDate`: Human-readable date for creating screenings
- `city`: City name for testing city-specific endpoints

## Testing Workflow

A typical testing workflow for screening-related operations might look like:

1. **Find a Movie**:
   - Run "Get Now Playing Movies" to find a movie ID
   - Set the `movieId` environment variable

2. **Find a Cinema**:
   - Run "Get Cinemas by Movie and Date" to find cinemas showing the movie
   - Set the `cinemaId` environment variable

3. **Get Screenings**:
   - Run "Get Screenings by Movie, Cinema and Date" to find screenings
   - From the response, copy a screening ID
   - Set the `screeningId` environment variable

4. **Get Screening Details**:
   - Run "Get Screening by ID" to see detailed information about the screening
   - Run "Get Available Seats for Screening" to see available seats

5. **Admin Operations** (optional):
   - Run "Login Admin" to get an admin token
   - Set the `adminToken` environment variable
   - Create, update, or delete screenings as needed

## Collection Structure

The collection is organized into the following folders:

- **Authentication**: Login endpoint for admin authentication
- **Movies**: Endpoints to get movie data for finding screenings
- **Cinemas**: Endpoints to get cinema data for finding screenings
- **Screenings**: The main endpoints for screening operations
- **Legacy Showtimes**: Legacy endpoints for showtime operations
- **Booking Flow**: Endpoints for the booking flow that use screenings

## Key Endpoints

### Get Screenings by Movie, Cinema and Date

- **URL**: `/api/screenings/movie/{movieId}/cinema/{cinemaId}/date/{date}`
- **Method**: GET
- **Description**: Returns all screenings for the specified movie at the specified cinema on the specified date
- **Parameters**:
  - `movieId`: The ID of the movie
  - `cinemaId`: The ID of the cinema
  - `date`: The date in YYYY-MM-DD format
- **Response**: Array of screening objects with details like start time, end time, room, and price

### Get Screenings by Movie and Date

- **URL**: `/api/screenings/movie/{movieId}/date/{date}`
- **Method**: GET
- **Description**: Returns all screenings for the specified movie on the specified date across all cinemas, grouped by cinema
- **Parameters**:
  - `movieId`: The ID of the movie
  - `date`: The date in YYYY-MM-DD format
- **Response**: Array of objects, each containing cinema details and an array of screenings at that cinema

### Get Screenings with Filters

- **URL**: `/api/screenings?movie={movieId}&cinema={cinemaId}&date={date}`
- **Method**: GET
- **Description**: Returns screenings filtered by the provided query parameters
- **Parameters**:
  - `movie`: (optional) The ID of the movie
  - `cinema`: (optional) The ID of the cinema
  - `date`: (optional) The date in YYYY-MM-DD format
- **Response**: Array of screening objects matching the filter criteria

### Get Available Seats for Screening

- **URL**: `/api/screenings/{screeningId}/seats`
- **Method**: GET
- **Description**: Returns a list of available seats for the specified screening
- **Parameters**:
  - `screeningId`: The ID of the screening
- **Response**: Array of seat objects with details like row, column, seat number, type, and price

## Screening Model

The screening model includes the following key components:

- Basic information (movie, cinema, room, date, start time, end time)
- Display information (display date, display time, day of week)
- Pricing information (price, pricing tiers for different seat types)
- Seat information (total seats, seats available, seat status)
- Status information (active status, booking status, screening status)
- Format information (2D/3D, language, subtitles)
- Special event information (promotional discounts, special event details)

## Notes

- The date format for date-related endpoints is YYYY-MM-DD
- The system has both "screenings" and "showtimes" endpoints for historical reasons
- The newer "screenings" endpoints are recommended over the legacy "showtimes" endpoints
- Admin operations (create, update, delete) require authentication with a valid admin JWT token
- When "deleting" a screening, the API marks it as inactive rather than removing it from the database

## Troubleshooting

- If you get a 404 error, check that the movie ID, cinema ID, or screening ID is valid
- If you get an empty array, try a different date or movie
- Make sure the date format is correct (YYYY-MM-DD)
- Verify that the API base URL is correct
- For admin operations, ensure you have a valid admin token

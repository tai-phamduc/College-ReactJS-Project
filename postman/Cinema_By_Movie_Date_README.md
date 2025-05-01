# Cinema By Movie and Date Postman Collection

This Postman collection is specifically designed for testing the functionality to find cinemas showing a particular movie on a specific date. This is a key part of the movie ticket booking flow where users need to find theaters playing their chosen movie.

## Setup Instructions

1. Install [Postman](https://www.postman.com/downloads/) if you haven't already.
2. Import the collection file (`Cinema_By_Movie_Date_Collection.json`) into Postman:
   - Open Postman
   - Click "Import" button
   - Select the collection file
   - Click "Import"
3. Import the environment file (`Cinema_By_Movie_Date_Environment.json`):
   - Click "Import" button
   - Select the environment file
   - Click "Import"
4. Select the "Cinema By Movie Date Environment" from the environment dropdown in the top right corner.
5. Set up the date variables:
   - Click the "Environment quick look" button (eye icon)
   - Set the `todayDate` variable to today's date in YYYY-MM-DD format (e.g., "2023-12-01")
   - Set the `tomorrowDate` variable to tomorrow's date in YYYY-MM-DD format (e.g., "2023-12-02")

## Environment Variables

The collection uses the following environment variables:

- `baseUrl`: The base URL of the API (default: https://movie-ticket-booking-api.vercel.app)
- `movieId`: ID of a movie to search for cinemas showing it
- `date`: A specific date in YYYY-MM-DD format (e.g., "2023-12-25")
- `todayDate`: Today's date in YYYY-MM-DD format (you need to set this manually)
- `tomorrowDate`: Tomorrow's date in YYYY-MM-DD format (you need to set this manually)
- `cinemaId`: ID of a cinema for getting detailed information
- `city`: City name for finding cinemas in a specific location

## Testing Workflow

A typical testing workflow might look like:

1. **Find a Movie ID**:
   - Run "Get Now Playing Movies" to see movies currently in theaters
   - Copy an ID from one of the movies and set it as the `movieId` environment variable

2. **Find Cinemas Showing the Movie**:
   - Run "Get Cinemas by Movie and Date" to find cinemas showing the movie on the specified date
   - Run "Get Cinemas by Movie and Today's Date" to find cinemas showing the movie today
   - If no results are found, try a different movie or date

3. **Get Cinema Details**:
   - From the results, copy a cinema ID and set it as the `cinemaId` environment variable
   - Run "Get Cinema by ID" to see detailed information about the cinema

4. **Find Screenings**:
   - Run "Get Screenings by Movie, Cinema and Date" to see all showtimes for the movie at the selected cinema
   - This gives you the complete information needed for booking tickets

## Collection Structure

The collection is organized into the following folders:

- **Movies**: Endpoints to find and get details about movies
- **Cinemas by Movie and Date**: The main endpoints for finding cinemas showing a specific movie on a particular date
- **Screenings**: Endpoints to get screening/showtime information
- **Cinema Details**: Endpoints to get detailed information about cinemas

## Key Endpoints

### Get Cinemas by Movie and Date

- **URL**: `/api/cinemas/movie/{movieId}/date/{date}`
- **Method**: GET
- **Description**: Returns a list of cinemas that have screenings for the specified movie on the specified date
- **Parameters**:
  - `movieId`: The ID of the movie
  - `date`: The date in YYYY-MM-DD format
- **Response**: Array of cinema objects with details like name, location, and amenities

### Get Screenings by Movie, Cinema and Date

- **URL**: `/api/screenings/movie/{movieId}/cinema/{cinemaId}/date/{date}`
- **Method**: GET
- **Description**: Returns all screenings (showtimes) for the specified movie at the specified cinema on the specified date
- **Parameters**:
  - `movieId`: The ID of the movie
  - `cinemaId`: The ID of the cinema
  - `date`: The date in YYYY-MM-DD format
- **Response**: Array of screening objects with details like start time, end time, room, and price

## Notes

- If no cinemas are showing the movie on the specified date, you'll receive an empty array `[]`
- The date format must be YYYY-MM-DD (e.g., "2023-12-25")
- The API filters out inactive cinemas and screenings
- Results are typically sorted alphabetically by cinema name
- This collection focuses on the read operations for finding cinemas and screenings, not on booking tickets

## Troubleshooting

- If you get a 404 error, check that the movie ID and cinema ID are valid
- If you get an empty array, try a different date or movie
- Make sure the date format is correct (YYYY-MM-DD)
- If the API is not responding, check that the base URL is correct

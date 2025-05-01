# Movie API Postman Collection

This Postman collection contains API requests for testing movie-related endpoints in the Movie Ticket Booking API.

## Setup Instructions

1. Install [Postman](https://www.postman.com/downloads/) if you haven't already.
2. Import the collection file (`Movie_API_Collection.json`) into Postman:
   - Open Postman
   - Click "Import" button
   - Select the collection file
   - Click "Import"
3. Import the environment file (`Movie_API_Environment.json`):
   - Click "Import" button
   - Select the environment file
   - Click "Import"
4. Select the "Movie API Environment" from the environment dropdown in the top right corner.

## Environment Variables

The collection uses the following environment variables:

- `baseUrl`: The base URL of the API (default: https://movie-ticket-booking-api.vercel.app)
- `userToken`: JWT token for authenticated user requests
- `adminToken`: JWT token for admin requests
- `movieId`: ID of a movie for testing movie-related endpoints
- `genreId`: ID of a genre for testing genre-related endpoints
- `actorId`: ID of an actor for testing actor-related endpoints
- `directorId`: ID of a director for testing director-related endpoints
- `theaterId`: ID of a theater for testing theater-related endpoints
- `showtimeId`: ID of a showtime for testing showtime-related endpoints
- `reviewId`: ID of a review for testing review-related endpoints

## Authentication

To use authenticated endpoints:

1. Run the "Login" request in the Authentication folder
2. The response will contain a JWT token
3. Copy the token value
4. Set the environment variable:
   - For regular user: Set `userToken` to the copied token
   - For admin user: Set `adminToken` to the copied token (use admin credentials)

## Testing Workflow

A typical testing workflow might look like:

1. Run "Get All Movies" to see available movies
2. Copy an ID from one of the movies and set it as the `movieId` environment variable
3. Run "Get Movie by ID" to verify you can fetch a specific movie
4. Run "Get Movies by Status" to see movies with a specific status
5. Run "Login" to get an authentication token
6. Set the token in the environment variables
7. Run authenticated requests like "Create Review"

## Collection Structure

The collection is organized into the following folders:

- **Authentication**: Login and register endpoints
- **Movies**: Movie-related endpoints (get, create, update, delete)
- **Reviews**: Movie review endpoints
- **Theaters**: Theater-related endpoints
- **Showtimes**: Movie showtime endpoints
- **Genres**: Movie genre endpoints
- **Actors**: Actor-related endpoints
- **Directors**: Director-related endpoints

## Notes

- Some endpoints require authentication with a valid JWT token
- Admin endpoints require an admin token
- The collection includes examples of filtering, sorting, and pagination
- You can modify request parameters as needed for your testing scenarios

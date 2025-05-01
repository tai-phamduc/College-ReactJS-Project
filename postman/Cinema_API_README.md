# Cinema API Postman Collection

This Postman collection contains API requests for testing cinema-related endpoints in the Movie Ticket Booking API.

## Setup Instructions

1. Install [Postman](https://www.postman.com/downloads/) if you haven't already.
2. Import the collection file (`Cinema_API_Collection.json`) into Postman:
   - Open Postman
   - Click "Import" button
   - Select the collection file
   - Click "Import"
3. Import the environment file (`Cinema_API_Environment.json`):
   - Click "Import" button
   - Select the environment file
   - Click "Import"
4. Select the "Cinema API Environment" from the environment dropdown in the top right corner.

## Environment Variables

The collection uses the following environment variables:

- `baseUrl`: The base URL of the API (default: https://movie-ticket-booking-api.vercel.app)
- `adminToken`: JWT token for admin authentication (required for admin operations)
- `cinemaId`: ID of a cinema for testing cinema-related endpoints
- `roomId`: ID of a room within a cinema for testing room-related endpoints
- `movieId`: ID of a movie for testing screening-related endpoints
- `screeningId`: ID of a screening for testing screening-related endpoints
- `date`: Date in YYYY-MM-DD format for testing date-specific endpoints
- `city`: City name for testing city-specific endpoints

## Authentication

To use admin-only endpoints:

1. Run the "Login Admin" request in the Authentication folder
2. The response will contain a JWT token
3. Copy the token value
4. Set the `adminToken` environment variable to the copied token

## Testing Workflow

A typical testing workflow might look like:

1. Run "Get All Cinemas" to see available cinemas
2. Copy an ID from one of the cinemas and set it as the `cinemaId` environment variable
3. Run "Get Cinema by ID" to verify you can fetch a specific cinema
4. Run "Login Admin" to get an authentication token
5. Set the token in the environment variables
6. Create a new cinema using "Create Cinema (Admin)"
7. Add a room to the cinema using "Add Room to Cinema (Admin)"
8. Copy the room ID from the response and set it as the `roomId` environment variable
9. Create a screening for a movie at the cinema using "Create Screening (Admin)"
10. Test other cinema-related functionality as needed

## Collection Structure

The collection is organized into the following folders:

- **Authentication**: Login endpoint for admin authentication
- **Cinemas**: Cinema-related endpoints (get, create, update, delete)
- **Cinema Rooms**: Room-related endpoints (add, update, remove)
- **Screenings**: Screening-related endpoints (get, create, update, delete)
- **Products**: Product-related endpoints for cinema concessions

## Notes

- Admin endpoints require authentication with a valid admin JWT token
- The cinema model includes detailed information about the cinema, its location, amenities, and rooms
- When "deleting" a cinema or screening, the API marks it as inactive rather than removing it from the database
- The date format for date-related endpoints is YYYY-MM-DD
- Room operations are nested under the cinema endpoints

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200/201: Success
- 400: Bad Request (invalid input)
- 401: Unauthorized (invalid or missing token)
- 404: Not Found
- 500: Server Error

## Cinema Model Structure

The cinema model includes the following key components:

- Basic information (name, slug, description)
- Location (address, city, state, zip code, coordinates)
- Contact information (phone, email, website)
- Opening hours for each day of the week
- Amenities and features
- Rooms with detailed seat layouts
- Social media links
- Accessibility information
- Parking information
- Concessions information

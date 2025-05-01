# User API Postman Collection

This Postman collection contains API requests for testing user-related endpoints in the Movie Ticket Booking API.

## Setup Instructions

1. Install [Postman](https://www.postman.com/downloads/) if you haven't already.
2. Import the collection file (`User_API_Collection.json`) into Postman:
   - Open Postman
   - Click "Import" button
   - Select the collection file
   - Click "Import"
3. Import the environment file (`User_API_Environment.json`):
   - Click "Import" button
   - Select the environment file
   - Click "Import"
4. Select the "User API Environment" from the environment dropdown in the top right corner.

## Environment Variables

The collection uses the following environment variables:

- `baseUrl`: The base URL of the API (default: https://movie-ticket-booking-api.vercel.app)
- `userToken`: JWT token for authenticated user requests
- `adminToken`: JWT token for admin requests
- `userId`: ID of a user for testing user-related endpoints
- `movieId`: ID of a movie for testing watchlist and favorites
- `showtimeId`: ID of a showtime for testing booking creation
- `bookingId`: ID of a booking for testing booking-related endpoints
- `resetToken`: Token for password reset testing

## Authentication

To use authenticated endpoints:

1. Run the "Register User" request to create a new user, or "Login User" if you already have credentials
2. The response will contain a JWT token
3. Copy the token value
4. Set the environment variable:
   - For regular user: Set `userToken` to the copied token
   - For admin user: Run "Login Admin" and set `adminToken` to the copied token

## Testing Workflow

A typical testing workflow might look like:

1. Register a new user or login with existing credentials
2. Set the token in the environment variables
3. Get user profile to verify authentication
4. Update user profile to test profile management
5. Create a booking to test booking functionality
6. Get user bookings to verify booking was created
7. Test other user-related functionality as needed

## Collection Structure

The collection is organized into the following folders:

- **Authentication**: Register, login, forgot password, and reset password endpoints
- **User Profile**: Get and update user profile, update password, upload profile picture
- **User Bookings**: Get user bookings, create booking, get booking details, cancel booking
- **Two-Factor Authentication**: Setup, verify, disable 2FA, and manage backup codes
- **Admin User Management**: Admin-only endpoints for managing users
- **User Preferences**: Update preferences, manage watchlist and favorites

## Notes

- Some endpoints require authentication with a valid JWT token
- Admin endpoints require an admin token
- For testing the booking functionality, you'll need valid movie and showtime IDs
- The password reset flow requires a valid reset token, which would normally be sent via email
- Two-factor authentication testing requires a valid token from an authenticator app

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200/201: Success
- 400: Bad Request (invalid input)
- 401: Unauthorized (invalid or missing token)
- 404: Not Found
- 500: Server Error

## Security Considerations

- JWT tokens are sensitive information. Do not share them.
- The API uses Bearer token authentication
- Passwords are hashed before storage
- Two-factor authentication adds an extra layer of security

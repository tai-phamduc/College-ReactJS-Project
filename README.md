# Movie Booking Website

A full-stack movie booking website similar to Aovis, built with React, Node.js, Express, and MongoDB. This project allows users to browse movies, events, and news, as well as book movie tickets with seat selection.

## Features

- Movie listings with details, trailers, and filtering by category/status
- Event listings and details
- News/blog section
- User authentication and profile management
- Ticket booking system with seat selection
- Booking history and management
- Admin dashboard for content management
- Responsive design for mobile and desktop

## Tech Stack

### Frontend
- React (Vite)
- React Router for navigation
- Axios for API requests
- React Icons for icons
- Tailwind CSS for styling
- Swiper for carousels/sliders
- React Query for data fetching

### Backend
- Node.js
- Express.js for the server
- MongoDB with Mongoose for database
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads

## Project Structure

```
group-project-react/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── layouts/        # Layout components
│   │   ├── assets/         # Assets (CSS, images)
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   ├── App.js          # Main App component
│   │   ├── index.js        # Entry point
│   │   └── routes.js       # Route definitions
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── server/                 # Backend Node.js/Express application
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── docs/               # API documentation
│   ├── tests/              # Test files
│   ├── server.js           # Express server
│   └── package.json        # Backend dependencies
├── .gitignore              # Git ignore file
├── package.json            # Root package.json for scripts
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
   ```
   git clone https://github.com/tai-phamduc/College-ReactJS-Project.git
   cd group-project-react
   ```

2. Install dependencies
   ```
   npm run install-all
   ```
   This will install dependencies for the root project, client, and server.

3. Set up environment variables
   - Create a `.env` file in the server directory with the following variables:
     ```
     NODE_ENV=development
     PORT=5010
     MONGODB_URI=mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/movie-booking?retryWrites=true&w=majority&appName=movie-booking
     JWT_SECRET=movie_booking_secret_key_2024
     JWT_EXPIRE=30d
     ```

4. Start the development server
   ```
   npm run dev
   ```
   This will start both the frontend and backend servers concurrently.

## Deployment

The application is deployed on Vercel:
- Frontend: https://movie-booking-client.vercel.app
- Backend API: https://movie-ticket-booking-api.vercel.app

### Deployment Steps

1. Set up Vercel CLI:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. Deploy the server:
   ```bash
   cd server
   vercel
   vercel --prod
   ```

3. Deploy the client:
   ```bash
   cd client
   vercel
   vercel --prod
   ```

4. Configure environment variables in Vercel dashboard for both projects.

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `GET /api/movies/status/:status` - Get movies by status (Now Playing, Coming Soon, Featured)
- `GET /api/movies/genre/:genre` - Get movies by genre

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `GET /api/events/featured` - Get featured events
- `GET /api/events/upcoming` - Get upcoming events

### News
- `GET /api/news` - Get all news articles
- `GET /api/news/:id` - Get news article by ID
- `GET /api/news/category/:category` - Get news articles by category

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Showtimes
- `GET /api/showtimes` - Get all showtimes
- `GET /api/showtimes/movie/:movieId` - Get showtimes for a movie
- `GET /api/showtimes/:id/seats` - Get available seats for a showtime

### Theaters
- `GET /api/theaters` - Get all theaters
- `GET /api/theaters/:id` - Get theater by ID

## Testing

To run tests:
```bash
cd server
npm test
```

## Demo Account

You can use the following credentials to test the application:
- Email: admin@example.com
- Password: password123

## License

This project is licensed under the MIT License.

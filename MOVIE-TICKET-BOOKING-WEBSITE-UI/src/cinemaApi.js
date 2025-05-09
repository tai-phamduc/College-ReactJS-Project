import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://movie-ticket-booking-api.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default axiosInstance;

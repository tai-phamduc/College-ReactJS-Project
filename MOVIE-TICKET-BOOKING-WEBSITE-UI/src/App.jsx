import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import MovieNowPlayingPage from './pages/MovieNowPlayingPage';
import MovieComingSoon from './pages/MovieComingSoon';
import SeatChoosingPage from './pages/SeatChoosingPage';
import MyAccountPage from './pages/MyAcountPage';
import CheckoutPage from "./pages/CheckoutPage";
import ThankYouPage from './pages/ThankYouPage';
import { AuthProvider } from './contexts/AuthContext';
import { MoviesProvider } from './contexts/MoviesContext';
import { MovieProvider } from './contexts/MovieContext';
import { ScreeningProvider } from './contexts/ScreeningContext';
import { SeatProductProvider } from './contexts/SeatContext';

function App() {
  return (
    <AuthProvider>
      <MoviesProvider>      
        <MovieProvider>
          <ScreeningProvider>
            <SeatProductProvider>
              <Router>
                  <Routes>
                    <Route path="*" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/movie/:id" element={<MovieDetailsPage />} />
                    <Route path="/movies-now-playing" element={<MovieNowPlayingPage />} />
                    <Route path="/movies-coming-soon" element={<MovieComingSoon />} />
                    <Route path="/cart-movies/:id" element={<SeatChoosingPage />} />
                    <Route path="/my-account" element={<MyAccountPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/thank-you" element={<ThankYouPage />} />
                  </Routes>
                </Router>
              </SeatProductProvider>
          </ScreeningProvider>
        </MovieProvider>
      </MoviesProvider>   
    </AuthProvider>
  );
}

export default App;

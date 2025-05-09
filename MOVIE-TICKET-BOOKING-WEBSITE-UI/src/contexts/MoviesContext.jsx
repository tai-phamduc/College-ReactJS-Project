// src/contexts/MoviesContext.js
import React, { createContext, useState, useContext } from "react";
import cinemaApi from "../cinemaApi";

export const MoviesContext = createContext();

export const MoviesProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesNowPlaying = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cinemaApi.get("/movies/now-playing");
      setMovies(response.data);
    } catch (err) {
      console.error(
        "Fetch Movies Now Playing Error:",
        err.response ? err.response.data : err.message
      );
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMoviesComingSoon = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cinemaApi.get("/movies/upcoming");
      setMovies(response.data);
    } catch (err) {
      console.error(
        "Fetch Movies Upcoming Error:",
        err.response ? err.response.data : err.message
      );
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MoviesContext.Provider
      value={{
        movies,
        loading,
        error,
        fetchMoviesNowPlaying,
        fetchMoviesComingSoon
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

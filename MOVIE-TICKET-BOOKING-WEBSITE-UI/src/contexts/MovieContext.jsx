import React, { createContext, useState, useContext } from "react";
import cinemaApi from "../cinemaApi";

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovieById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await cinemaApi.get(`/movies/${id}`)

      response.data["related_movies"] = [
        {
          title: "The Fifth Day",
          genre: "Comedy",
          length: 180,
          image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-12-768x513.jpg"
        },
        {
          title: "Black and White Twins",
          genre: "Animation, Comedy",
          length: 190,
          image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/banner-10-768x660.jpg"
        },
        {
          title: "The Scariest Dream",
          genre: "Thriller",
          length: 180,
          image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-09-768x513.jpg"
        },
        {
          title: "The Pursuit of Dreams",
          genre: "Animation",
          length: 180,
          image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-08-768x513.jpg"
        },
        {
          title: "Alis Keep Walking",
          genre: "Crime, Thriller",
          length: 180,
          image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-07-768x519.jpg"
        }
      ]

      setMovie(response.data);
    } catch (err) {
      console.error("Fetch Movie by ID Error:", err.response?.data || err.message);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMovie(null);
    setError(null);
  };


  return (
    <MovieContext.Provider
      value={{
        movie,
        loading,
        error,
        fetchMovieById,
        reset
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

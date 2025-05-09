import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

function MoviesComingSoon() {
  const movies = [
    {
      name: "The Fifth Day",
      genre: "Comedy",
      length: 180,
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-12-768x513.jpg"
    },
    {
      name: "Black and White Twins",
      genre: "Animation, Comedy",
      length: 190,
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/banner-10-768x660.jpg"
    },
    {
      name: "The Scariest Dream",
      genre: "Thriller",
      length: 180,
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-09-768x513.jpg"
    },
    {
      name: "The Pursuit of Dreams",
      genre: "Animation",
      length: 180,
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-08-768x513.jpg"
    },
    {
      name: "Alis Keep Walking",
      genre: "Crime, Thriller",
      length: 180,
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-07-768x519.jpg"
    }
  ];
  return (
    <section className="movies-coming-soon position-relative overflow-hidden py-7">
      <div className="background-overlay" />
      <div className="container-sm position-relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-5">
          <img src="/src/assets/film-roll.png" alt="Film roll" className="mb-3" />
          <h5 className="text-muted">New Upcoming Movies</h5>
          <h1 className="display-4 fw-bold">Movies Coming Soon</h1>
        </div>

        <Swiper
          spaceBetween={30}
          slidesPerView={4}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          breakpoints={{
            320: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
          }}
          className="position-relative pb-5"
        >
          {movies.map((movie, idx) => (
            <SwiperSlide key={idx}>
            <div className="movie-card shadow">
              <div
                className="movie-card__img"
                style={{
                  backgroundImage: `url(${movie.image_link})`,
                }}
              />
              <div
                className="position-absolute bottom-0 w-100 text-white p-4"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0,0,0,0.0))',
                  zIndex: 2,
                }}
              >
                <p className="mb-1 small">
                  {movie.genre} / {movie.length} Mins
                </p>
                <h5 className="fw-bold">{movie.name}</h5>
                <button className="get-ticket-btn btn fw-bold btn-sm mt-2">
                  Get Ticket
                </button>
              </div>
            </div>

            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default MoviesComingSoon
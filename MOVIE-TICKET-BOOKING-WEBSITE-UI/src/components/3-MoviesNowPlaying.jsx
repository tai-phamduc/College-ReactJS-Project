import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';

export default function CurrentMovies({ movies = [] }) {
  const navigate = useNavigate();

  return (
    <section className="current-movies-section position-relative overflow-hidden py-7">
      <div className="background-overlay" />
      <div className="container-sm position-relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-5">
          <img src="/src/assets/film-roll.png" alt="Film roll" className="mb-3" />
          <h5 className="text-muted">Watch New Movies</h5>
          <h1 className="display-4 fw-bold">Movies Now Playing</h1>
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
                <button
                  className="get-ticket-btn btn fw-bold btn-sm mt-2"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  Get Ticket
                </button>
              </div>
            </div>

            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

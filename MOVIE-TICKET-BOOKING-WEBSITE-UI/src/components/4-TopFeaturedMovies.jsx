import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function TopFeaturedMovies() {
  const movies = [
    {
      name: "The Fifth Day",
      genre: "Comedy",
      length: 180,
      image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-12-768x513.jpg"
    },
    {
      name: "Black and White Twins",
      genre: "Comedy",
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
    <section className="top-featured-movies-section py-7 pb-9">
      <div className='container-sm'>
        <div className="row mb-4">
          <div className="col-md-6">
            <img src="/src/assets/film-roll.png" alt="Film roll" className="mb-3" />
            <div className="text-secondary fw-bold mb-2" style={{marginTop: "-0.5rem"}}>Checkout Movies</div>
            <div className="display-4 fw-bold">Top Featured Movies</div>
          </div>
          <div className="offset-md-1 col-md-5">
            <div className="text-secondary">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi id, porro nisi, dignissimos, et cupiditate iure nihil iste assumenda quidem doloremque at pariatur? Nisi quam dolorem voluptate non eaque saepe.
            </div>
          </div>
        </div>
        <div className="row">

        <Swiper
          spaceBetween={30}
          slidesPerView={3}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
          }}
          className="top-featured-swiper"
        >
          {movies.map((movie, idx) => (
            <SwiperSlide key={idx}>
              <div className="movie-card">
                <img
                  src={movie.image_link}
                  alt={movie.name}
                  className="movie-card__image"
                />
                <div className="movie-card__content">
                  <h3 className="movie-card__title">{movie.name}</h3>
                  <div className="movie-card__meta">
                    <span className="tag-icon">
                      <img src="/src/assets/price-tag.png" alt="" />  
                    </span> {movie.genre}
                    <span className="dot">·</span>
                    <span className="clock-icon">
                      <img src="/src/assets/time.png" alt="" />  
                    </span> {movie.length} Mins
                  </div>
                  <div className="movie-card__buttons">
                    <button className="movie-btn">Watch Trailer</button>
                    <button className="movie-btn">Get Ticket</button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      </div>
    </section>
  )
}

import { FaPlay, FaTimes } from 'react-icons/fa';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useRef, useState, useEffect } from 'react';
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const movies = [
  {
    name: "The Switcher Season 2",
    genre: "Action Movie",
    written_and_directed_by: "Alessa Rose",
    country: "Ireland",
    year: 2023,
    in_theater: "March 2023",
    background_image: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/banner-02.jpg",
    trailer_image: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/movie-image-02-300x202.jpg",
    trailer_link: "https://www.youtube.com/watch?v=LlJGhxL4yUI"
  },
  {
    name: "Love Nightmare",
    genre: "Adventure Movie",
    written_and_directed_by: "Alessa Rose",
    country: "Ireland",
    year: 2023,
    in_theater: "March 2023",
    background_image: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/banner3.jpg",
    trailer_image: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/movie-image-03-300x201.jpg",
    trailer_link: "https://www.youtube.com/watch?v=1cRzZcMlJh8"
  },
  {
    name: "Behind the mask",
    genre: "Action Movie",
    written_and_directed_by: "Kevin Lord",
    country: "German",
    year: 2023,
    in_theater: "June 2023",
    background_image: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/banner-04.jpg",
    trailer_image: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-04-300x200.jpg",
    trailer_link: "https://www.youtube.com/watch?v=7RiJDEZywlw"
  }
];

const TrailerSwiper = ({ activeIndex, onSlideClick, onPlayClick }) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.slideTo) {
      swiperRef.current.slideToLoop(activeIndex);
    }
  }, [activeIndex]);

  return (
    <div className="trailer-swiper py-5 px-3" style={{ width: "600px", zIndex: 10, position: 'relative' }}>
      <div className="container">
        <img src="https://demo.ovatheme.com/aovis/wp-content/plugins/movie-booking/assets/img/arrow-watch-trailer.png" alt=""
          style={{ position: "absolute", left: "-32px" }}
        />
        <div className="mb-4 text-white fs-5">Trailers</div>
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Pagination, Autoplay]}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          spaceBetween={16}
          slidesPerView={2}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 2 },
          }}
        >
          {movies.map((movie, idx) => (
            <SwiperSlide key={idx}>
              <div
                className={`position-relative overflow-hidden border ${
                  idx === activeIndex ? 'border-primary' : 'border-transparent'
                }`}
                style={{
                  width: '100%',
                  height: '128px',
                  cursor: 'pointer',
                  transition: 'border 0.3s'
                }}
              >
                <img
                  src={movie.trailer_image}
                  alt={movie.name}
                  className="img-fluid w-100 h-100 object-fit-cover"
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-25 d-flex justify-content-center align-items-center trailer-hover"
                  onClick={() => onSlideClick(idx)}
                >
                  <div
                    className="circle rounded-circle d-flex justify-content-center align-items-center"
                    style={{ width: '48px', height: '48px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayClick(movie.trailer_link);
                    }}
                  >
                    <FaPlay className="play-icon ms-1" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState(null);
  const mainSwiperRef = useRef(null);

  const handleTrailerClick = (index) => {
    setActiveIndex(index);
    mainSwiperRef.current?.slideTo(index);
  };

  const openTrailerModal = (trailerLink) => {
    setCurrentTrailer(trailerLink);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTrailer(null);
  };

  return (
    <div className='hero-section'>
      <Swiper
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        modules={[Autoplay]}
        className="movie-swiper"
        onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        spaceBetween={0}
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={index}>
            <div
              className="movie-banner text-white"
              style={{
                backgroundImage:  `url('${movie.background_image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh"
              }}
            >
              <div className="overlay">
                <div className="hero-container container">
                  <div className="left-content">
                    <div className="genre mb-2 display-5 text-primary">
                      {movie.genre}
                    </div>
                    <h1 className="display-1 fw-bold" style={{ lineHeight: "1" }}>
                      {movie.name}
                    </h1>
                    <p className="lead">
                      Written and Directed by {movie.written_and_directed_by} / {movie.country} {movie.year}
                    </p>
                    <div className="mt-4">
                      <button className="btn btn-light me-3">More Info</button>
                      <button className="btn btn-primary text-white">Get Ticket</button>
                    </div>
                  </div>

                  <div className="in-theater-date">
                    <p className="fs-6 pb-0 mb-0">In theater</p>
                    <div className="date-highlight">
                      <span className="date-text">{movie.in_theater}</span>
                      <img
                        src="https://demo.ovatheme.com/aovis/wp-content/plugins/movie-booking/assets/img/underline-heading-entire.png"
                        alt="underline"
                        className="underline-img"
                      />
                    </div>
                  </div>

                  <div className="vertical-share-bar">
                    <span className="share-text">Share</span>
                    <div className="line" />
                    <div className="icons">
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-twitter" />
                      </a>
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook-f" />
                      </a>
                      <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-pinterest-p" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="trailers">
        <TrailerSwiper
          activeIndex={activeIndex}
          onSlideClick={handleTrailerClick}
          onPlayClick={openTrailerModal}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content position-relative" onClick={(e) => e.stopPropagation()}>
            <FaTimes
              onClick={closeModal}
              className="position-absolute text-white"
              style={{ top: '-10px', right: '-10px', cursor: 'pointer', fontSize: '1rem', zIndex: 10 }}
            />
            <div className="ratio ratio-21x9">
              <iframe
                src={currentTrailer.replace("watch?v=", "embed/")}
                title="YouTube Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <img src="https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/image-lines-header.jpg" alt="" style={{width: "100%"}} />
    </div>
  );
};

export default Hero;

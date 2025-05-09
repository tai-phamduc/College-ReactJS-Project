import React, { useEffect, useContext, useState } from 'react'
import "./styles/MovieDetailsPage.css" 
import Navbar from "../components/Navbar"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useParams } from 'react-router-dom';
import { MovieContext } from "../contexts/MovieContext";
import Loading from "../components/Loading"
import { format } from 'date-fns';
import { Modal } from 'bootstrap'; // ✅ Add this
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ScheduleModal from "./ScheduleModal"

function MovieDetailsPage() {

  const { id } = useParams();

  const { movie, loading, error, fetchMovieById, reset } = useContext(MovieContext);

  const [selectedMovieId, setSelectedMovieId] = useState(null);

  useEffect(() => {
    fetchMovieById(id);
  }, []);

  useEffect(() => {
    if (movie) {
      console.log(movie)
    }
  }, [movie]);
  
  function openScheduleModal(movieId) {
    setSelectedMovieId(movieId);
    const modalEl = document.getElementById('scheduleModal');
    const modal = new Modal(modalEl);
    modal.show();
  }
  
  // const movie = {
  //   title: "The Witcher Season 2",
  //   genre: ["Action", "Thriller"],
  //   duration: 180,
  //   gallery: [
  //     "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/sub-movie-image-01.jpg",
  //     "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/movie-image-02.jpg"
  //   ],
  //   trailer: "https://www.youtube.com/embed/ndl1W4ltcmg",
  //   trailerThumbnail: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/movie-image-02.jpg",
  //   directorName: "Christine Eve",
  //   writer: ["Aleesha Rose"],
  //   rating: "PG-13",
  //   releaseDate: "06, March 2023",
  //   cast: [
  //     { 
  //       title: "Millie Brown", 
  //       character: "Eleven", 
  //       image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/cast-01.jpg" 
  //     },
  //     { 
  //       title: "Finn Wolfhard", 
  //       character: "Mike Wheeler", 
  //       image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/cast-02.jpg" 
  //     },
  //     { 
  //       title: "Winona Ryder", 
  //       character: "Joyce Byers", 
  //       image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/cast-03.jpg" 
  //     },
  //     { 
  //       title: "David Harbour", 
  //       character: "Jim Hopper", 
  //       image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/cast-04.jpg" 
  //     },
  //     { 
  //       title: "Gaten Matarazo", 
  //       character: "Ted Wheeler", 
  //       image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/cast-05.jpg" 
  //     },
  //     { 
  //       title: "Natalia Dyer", 
  //       character: "Nancy Wheeler", 
  //       image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/cast-06.jpg" 
  //     },
  //     { 
  //       title: "Caleb Laughlin", 
  //       character: "Lucas Sinclair", 
  //       image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/cast-07.jpg" 
  //     },
  //     { 
  //       title: "Sadie Sink", 
  //       character: "Max Mayfield", 
  //       image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/cast-08.jpg" 
  //     }
  //   ],
  //   description: "In a small town where everyone knows everyone, a peculiar incident starts a chain of events that leads to a child’s disappearance, which begins to tear at the fabric of an otherwise-peaceful community. Dark government agencies and seemingly malevolent supernatural forces converge on the town, while a few of the locals begin to understand that more is going on than meets the eye.",
  //   related_movies: [
  //     {
  //       title: "The Fifth Day",
  //       genre: "Comedy",
  //       length: 180,
  //       image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-12-768x513.jpg"
  //     },
  //     {
  //       title: "Black and White Twins",
  //       genre: "Animation, Comedy",
  //       length: 190,
  //       image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/banner-10-768x660.jpg"
  //     },
  //     {
  //       title: "The Scariest Dream",
  //       genre: "Thriller",
  //       length: 180,
  //       image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-09-768x513.jpg"
  //     },
  //     {
  //       title: "The Pursuit of Dreams",
  //       genre: "Animation",
  //       length: 180,
  //       image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-08-768x513.jpg"
  //     },
  //     {
  //       title: "Alis Keep Walking",
  //       genre: "Crime, Thriller",
  //       length: 180,
  //       image_link: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-07-768x519.jpg"
  //     }
  //   ]
  // }


  useEffect(() => {
    if (!movie) return;
  
    const videoModalEl = document.getElementById('videoModal');
    const video = document.getElementById('video');
    const videoBtns = document.querySelectorAll('.video-btn');
  
    let videoSrc = '';
  
    const handleClick = (e) => {
      e.preventDefault();
      const btn = e.currentTarget;
      videoSrc = btn.getAttribute('data-bs-src');
    };
  
    const handleShow = () => {
      video.setAttribute('src', `${videoSrc}?autoplay=1&modestbranding=1&showinfo=0`);
    };
  
    const handleHide = () => {
      video.setAttribute('src', '');
    };
  
    videoBtns.forEach((btn) => btn.addEventListener('click', handleClick));
    videoModalEl?.addEventListener('shown.bs.modal', handleShow);
    videoModalEl?.addEventListener('hide.bs.modal', handleHide);
  
    return () => {
      videoBtns.forEach((btn) => btn.removeEventListener('click', handleClick));
      videoModalEl?.removeEventListener('shown.bs.modal', handleShow);
      videoModalEl?.removeEventListener('hide.bs.modal', handleHide);
    };
  }, [movie]);


  if (loading || error || !movie) return <Loading />

  return (
    <div className='movie-details-page'>
      <Navbar />
      <Header title={movie.title} />
      <section className='main py-6'>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h3 className="display-6 fw-semibold">{movie.title}</h3>
              <div className='d-flex align-items-center gap-2'>
                <div>
                  {
                    movie.genre.map((genre, index) => (
                      <span key={index} className="badge bg-dark me-1">{genre}</span>
                    ))
                  }
                </div>
                <span>/</span>
                <div>
                  <span>{movie.formattedDuration}</span>
                </div>
              </div>
            </div>
            <button className="btn btn-primary text-white px-5 py-3 fw-bold" onClick={() => openScheduleModal(movie.id)}>Get Ticket</button>
          </div>
          <div className="row">
            <div className="col-md-3">
              <a href="#" className='gallery-box h-100'>
                <img src={movie.poster} alt="" className='w-100 h-100 object-fit-cover'/>
              </a>
            </div>
            <div className="col-md-9">
              <div className="position-relative gallery-box h-100">
                <img src={movie.trailerThumbnail} alt="" className="trailerThumbnailImage"/>
                <a className="video-btn" data-bs-toggle="modal" data-bs-target="#videoModal" data-bs-src={movie.trailer}>
                  <span className="video-play-button">
                    <span></span>
                  </span>
                </a>
                <span className='text-trailer'>
                  Watch the Trailer
                  <i className="fas fa-arrow-right"></i>
                </span>
              </div>
            </div>
          </div>  
          <div className="vstack gap-3 py-4 border-bottom border-light">

            <div className="d-flex gap-7">
              <div className="d-flex gap-3"><span className="fw-bold">Director: </span><span className='text-secondary'>{movie.directorName}</span></div>
              <div className="d-flex gap-3"><span className="fw-bold">Premimier: </span><span className='text-secondary'>
                {format(new Date(movie.releaseDate), 'dd/MM/yyyy')}
              </span></div>
            </div>

            <div className="d-flex gap-7">
              <div className="d-flex gap-3"><span className="fw-bold">Writer: </span><span className='text-secondary'>{movie.writers}</span></div>
              <div className="d-flex gap-3"><span className="fw-bold">Time: </span><span className='text-secondary'>{movie.duration} Mins</span></div>
            </div>

            <div className="d-flex gap-7">
              <div className="d-flex gap-3"><span className="fw-bold">Rating: </span><span className='text-secondary'>{movie.rating}</span></div>
            </div>

          </div>

          <div className='py-5'>
            <h3 className="fw-bold fs-3 mb-5">Top Cast</h3>
            <div className="row gy-5">
              {
                movie.cast.map((cast, index) => (
                  <div className="col-md-3">
                    <div className="d-flex gap-3 align-items-center">
                      <img src={cast.image_link} alt="" className='rounded-circle cast-image'/>
                      <div className='cast-content'>
                        <h5 className="fw-bold mb-1">{cast.title}</h5>
                        <span className='text-secondary mt-1'>{cast.character}</span>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="py-4">
            <h3 className="fw-bold fs-3 mb-4">Story Line</h3>
            <p className='text-secondary'>{movie.description}</p>
          </div>

          <section className="related-movies-section position-relative overflow-hidden">
            <h3 className="fw-bold fs-3 mb-4">More Movies Like This</h3>
            <div className="container position-relative" style={{ zIndex: 1 }}>
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
                {movie.related_movies.map((movie, idx) => (
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
                      <h5 className="fw-bold">{movie.title}</h5>
                      <button
                        className="get-ticket-btn btn fw-bold btn-sm mt-2">
                        Get Ticket
                      </button>
                    </div>
                  </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
          
        </div>
      </section>
      <Footer />
      <div className="video-modal">
        <div id="videoModal" className="modal fade">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="ratio ratio-16x9">
                <iframe frameborder="0" className="embed-responsive-item" id="video"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScheduleModal movieId={selectedMovieId} />

    </div>
  )
}

export default MovieDetailsPage
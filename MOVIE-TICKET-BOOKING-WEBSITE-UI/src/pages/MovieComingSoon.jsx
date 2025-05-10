import Navbar from "../components/Navbar"
import Header from "../components/Header"
import Footer from "../components/Footer"
import "./styles/MovieNowPlayingPage.css"
import { useEffect, useContext } from "react"
import { MoviesContext } from "../contexts/MoviesContext";
import Loading from "../components/Loading";

function MovieNowPlayingPage() {
  // const movies = [
  //   {
  //     title: "The Fifth Day",
  //     genre: "Comedy",
  //     duration: 180,
  //     poster: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-12-768x513.jpg"
  //   },
  //   {
  //     title: "Black and White Twins",
  //     genre: "Animation, Comedy",
  //     duration: 190,
  //     poster: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/banner-10-768x660.jpg"
  //   },
  //   {
  //     title: "The Scariest Dream",
  //     genre: "Thriller",
  //     duration: 180,
  //     poster: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-09-768x513.jpg"
  //   },
  //   {
  //     title: "The Pursuit of Dreams",
  //     genre: "Animation",
  //     duration: 180,
  //     poster: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-08-768x513.jpg"
  //   },
  //   {
  //     title: "Alis Keep Walking",
  //     genre: "Crime, Thriller",
  //     duration: 180,
  //     poster: "https://demo.ovatheme.com/aovis/wp-content/uploads/2023/03/movie-image-07-768x519.jpg"
  //   }
  // ];

  const { movies, loading, error, fetchMoviesComingSoon } = useContext(MoviesContext);

  useEffect(() => {
    fetchMoviesComingSoon()
  }, [])

  useEffect(() => {
    if (movies) {
      console.log(movies)
    }
  }, [movies])

  if (loading) return <Loading />
  return (
    <div className="movie-now-playing-page">
      <Navbar />
      <Header title="Movie Coming Soon" />
      
      <main className="py-7">
        <div className="container-lg">
          <div className="row gy-5">
            {
              movies.map((movie, index) => (
                <div className="col-md-6">
                  <div className="movie-now-card">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="movie-image-box">
                          <img src={movie.poster} alt="" className=""/>
                        </div>
                      </div>
                      <div className="col-md-6 position-relative">
                        <div className="mask"></div>
                        <div className="movie-info-box p-3">
                          <div className="d-flex align-items-center gap-2">
                            <img src="/src/assets/ribbon.png" alt="" />
                            <span className="text-secondary">
                              {movie.genre.join(", ")}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <img src="/src/assets/time.png" alt="" />
                            <span className="text-secondary">
                              {movie.duration} Mins
                            </span>
                          </div>
                          <h3 className="fw-bold fs-4 mt-3">{movie.title}</h3>
                          <button className="btn btn-light text-secondary rounded-0 fw-bold get-ticket-btn">Get Ticket</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default MovieNowPlayingPage
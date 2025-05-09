import { useState, useEffect, useContext } from 'react'
import Navbar from "../components/Navbar"
import Header from "../components/Header"
import Footer from "../components/Footer"
import api from '../cinemaApi.js'

import ScreeningContext from "../contexts/ScreeningContext";
import Loading from "../components/Loading.jsx"
import { useParams, useNavigate } from 'react-router-dom'
import "./styles/SeatChoosingPage.css"
import SeatProductContext from "../contexts/SeatContext.jsx"

function SeatChoosingPage() {

  const { id } = useParams()
  const {screeningsState, dispatchScreenings} = useContext(ScreeningContext); 
  const [seatsGroupedByRowArray, setSeatsGroupedByRowArray] = useState([]) 
    const [seatChosenList, setSeatChosenList] = useState([])
  const { seatProduct, dispatchSeatProduct } = useContext(SeatProductContext);
  useEffect(() => {
    console.log(screeningsState.screening)
  }, [screeningsState.screening])
  const navigate = useNavigate();
  useEffect(() => {
    const fetchScreening = async () => {
      try {
        dispatchScreenings({type: "FETCH_SCREENING_PENDING"})
        const response = await api.get(`/screenings/${id}/details`)
        dispatchScreenings({type: "FETCH_SCREENING_SUCCESS", payload: response.data})
      } catch (err) {
        console.error("Failed to fetch screenings:", err)
        dispatchScreenings({type: "FETCH_SCREENING_FAILURE"})
      }
    }

    fetchScreening()
  }, [])

  const { screening, isLoading } = screeningsState

  useEffect(() => {
    const seatsGroupedByRow = screening?.seats.reduce((acc, seat) => {
      if (!acc[seat.row]) {
        acc[seat.row] = [];
      }
      acc[seat.row].push(seat);
      return acc;
    }, {});
    if (seatsGroupedByRow) {
      const seatsGroupedByRowArray = Object.entries(seatsGroupedByRow).map(([row, seats]) => ({ [row]: seats }));
      console.log(seatsGroupedByRowArray)
      setSeatsGroupedByRowArray(seatsGroupedByRowArray)
    }
  }, [screening])


  if (!screening || screeningsState.isLoading) {
    return <Loading />
  }

  function handleOnClick(seat) {
    // Toggle seat selection
    setSeatChosenList(prevList => {
      const exists = prevList.find(s => s._id === seat._id);
      if (exists) {
        // Remove if already selected
        return prevList.filter(s => s._id !== seat._id);
      } else {
        // Add if not selected
        return [...prevList, seat];
      }
    });
  }

  function handleProceedToCheckout() {
    dispatchSeatProduct({type: "SET_SEATS", payload: seatChosenList})
    navigate("/checkout")
  }

  return (
    <>
      <Navbar />
      <Header title="Cart Movies" />

      <main className='py-6'>
        <div className="container">
          <h2 className="display-4 fw-bold">Cart Movies</h2>
          <div className="p-1 mb-4">
            <div><span className="fw-bold">Movie name</span>: <span className="text-secondary">{screening.movieName}</span></div>
            <div><span className="fw-bold">Room</span>: <span className="text-secondary">{screening.format}</span></div>
            <div><span className="fw-bold">Showtime</span>: <span className="text-secondary">{screening.startTime}</span></div>
          </div>
          <div className="row">
            <div className="col-md-8 d-flex flex-column align-items-center">
              <img className='' src="/src/assets/stage.png" alt="" style={{height: "100px"}}/>
              <div className="seats-container py-4 align-self-stretch d-flex flex-column align-items-center" style={{fontSize: "10px"}}>
                {seatsGroupedByRowArray.map((rowObj, index) => {
                  const [rowLabel, seats] = Object.entries(rowObj)[0];
                  return (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <div className="me-2 fw-bold">{rowLabel}</div>
                      <div className="d-flex gap-2 pb-2">
                        {seats.map((seat) => (
                          <div
                            onClick={() => handleOnClick(seat)}
                            key={seat._id}
                            className={`border border-1 d-flex align-items-center justify-content-center mx-1 
                              ${seat.status !== "available" ? "bg-danger" : ""}
                              ${seat.status === "available" && seatChosenList.find(s => s._id === seat._id) ? "bg-success" : ""}`
                            }
                            style={{ width: "40px", height: "40px", cursor: seat.status === "available" ? "pointer" : "not-allowed" }}
                          >
                            {seat.seatNumber}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="d-flex justify-content-center align-items-center gap-3">
                <div className="d-flex gap-2 align-items-center">
                  <div className='border border-black bg-white' style={{width: "20px", height: "20px"}}></div>
                  <div>Available</div>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <div className='bg-danger' style={{width: "20px", height: "20px"}}></div>
                  <div>Unavailable</div>
                </div>
              </div>
            </div>
            <div className="col-md-4 pt-4">
              <div className="booking-information-box shadow-lg px-4">
                <h3 className="fs-4 fw-bold text-uppercase py-4 border-bottom border-light">Booking Information</h3>
                <div className="text-secondary pb-3">
                  <div className="d-flex justify-content-between py-3">
                    <span className='fw-semibold'>Seat</span>
                    <span className='fw-semibold'>Price</span>
                  </div>
                  {
                    seatChosenList.map((seat) => (
                      <div key={seat._id} className="d-flex justify-content-between py-3">
                        <span>{seat.seatNumber}</span>
                        <span>${seat.price.toFixed(2)}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className="d-flex justify-content-between py-4 px-4 bg-secondary text-white mb-4">
                <span className='fw-semibold'>Total</span>
                <span className='fw-semibold'>${seatChosenList.reduce((acc, seat) => acc + seat.price, 0).toFixed(2)}</span>
              </div>
              <button onClick={() => handleProceedToCheckout()} className="btn btn-success py-3 w-100">Proceed to checkout</button>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </>
  )
}

export default SeatChoosingPage

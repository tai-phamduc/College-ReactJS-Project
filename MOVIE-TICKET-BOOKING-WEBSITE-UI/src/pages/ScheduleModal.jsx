import React, { useEffect, useRef, useContext, useState } from 'react';
import ScreeningContext from "../contexts/ScreeningContext";
import cinemaApi from "../cinemaApi";
import './styles/ScheduleModal.css'; // Create this file for custom styles if needed
import { useNavigate } from 'react-router-dom'
import { Modal } from 'bootstrap';

function ScheduleModal({ movieId }) {

  const navigate = useNavigate()

  const modalRef = useRef(null);
  const { screeningsState, dispatchScreenings } = useContext(ScreeningContext);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const generateDates = (days = 15) => {
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        key: date.toDateString(),
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        dateNum: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "2-digit" }),
        fullISO: date.toISOString().split("T")[0],
      };
    });
  };

  const dates = generateDates();

  const fetchScreenings = async (dateStr) => {
    try {
      dispatchScreenings({ type: "FETCH_SCREENINGS_PENDING" });
      const response = await cinemaApi.get(`/screenings/movie/${movieId}/date/${dateStr}`);
      dispatchScreenings({ type: "FETCH_SCREENINGS_SUCCESS", payload: response.data });
    } catch (error) {
      dispatchScreenings({ type: "FETCH_SCREENINGS_FAILURE", error });
      console.error(error);
    }
  };

  useEffect(() => {
    const modalEl = modalRef.current;
    if (!modalEl) return;

    const handleShow = () => {
      console.log("Modal opened for movieId:", movieId);
      const isoDate = selectedDate.toISOString().split("T")[0];
      fetchScreenings(isoDate);
    };

    modalEl.addEventListener('shown.bs.modal', handleShow);
    return () => {
      modalEl.removeEventListener('shown.bs.modal', handleShow);
    };
  }, [movieId, selectedDate]);

  useEffect(() => {
    console.log("Screenings: ", screeningsState.screenings)
  }, [screeningsState.screenings])

  function handleScreeningClick(screening) {

    // Close the Bootstrap modal using its native API
    const modalEl = modalRef.current;
    if (modalEl) {
      const modalInstance = Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      }
    }

    // Slight delay to allow modal animation to finish before navigating
    setTimeout(() => {
      navigate(`/cart-movies/${screening._id}`);
    }, 300);
  }

  return (
    
    <div className="modal fade fixed-size-modal" id="scheduleModal" tabIndex="-1" aria-hidden="true" ref={modalRef}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content p-4">
            <div className="modal-header">
              <h5 className="modal-title">Schedule for Movie</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
          <div className="modal-body">
            <div className="d-flex overflow-auto gap-2 bg-light p-2 rounded">
              {dates.map(({ key, day, dateNum, month, fullISO }) => (
                <div
                  key={key}
                  className={`text-center px-3 py-2 rounded border ${
                    selectedDate.toDateString() === key ? "selected-date text-white bg-primary" : "bg-white"
                  }`}
                  onClick={() => {
                    setSelectedDate(new Date(key));
                    fetchScreenings(fullISO);
                  }}
                  style={{ cursor: "pointer", minWidth: "60px" }}
                >
                  <div className="small text-muted">{month}</div>
                  <div className="fs-4 fw-bold">{String(dateNum).padStart(2, "0")}</div>
                  <div className="small">{day}</div>
                </div>
              ))}
            </div>

            {/* You can now use `screenings` to render times, rooms, etc. */}

            { screeningsState.isLoading ? (
              <p className='text-muted mt-3'>Loading...</p>
            ) : 
            screeningsState.screenings.length === 0 ? (
              <p className="text-muted mt-3">No screenings found for the selected date.</p>
            ) : (
              screeningsState.screenings.map(({ cinema, screenings }) => (
                <div key={cinema._id} className="mt-4">
                  <h5 className="fw-bold">{cinema.name}</h5>
                  <div className="mb-2 text-uppercase text-muted small">IMAX</div>
                  <div className="d-flex flex-wrap gap-2">
                    {screenings.map(s => (
                      <button
                        onClick={() => handleScreeningClick(s)}
                        key={s._id}
                        className="btn btn-outline-secondary"
                        style={{ padding: '0.25rem 0.75rem' }}
                      >
                        {new Date(s.startTime).toLocaleTimeString([], {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </button>
                    ))}
                  </div>
                  <hr className="mt-4" />
                </div>
              ))
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleModal;

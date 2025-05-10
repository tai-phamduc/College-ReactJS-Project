import React, { useRef, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useLocation } from "react-router-dom"
import { useContext } from "react";
import ScreeningContext from "../contexts/ScreeningContext";
import SeatContext from "../contexts/SeatContext"
import { useNavigate } from "react-router-dom";
import { generatePDF } from "../utils/pdfGenerator";
import QRCodeGenerator from "../components/QRCodeGenerator";

const ThankYouPage = () => {
  // State for tracking PDF generation
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Reference to the ticket container element
  const ticketContainerRef = useRef(null);

  const navigate = useNavigate();

  const location = useLocation();
  const { newBooking, formData } = location.state;
  console.dir(newBooking);

  const { screeningsState: {screening} } = useContext(ScreeningContext);
  const { seatProduct } = useContext(SeatContext)

  // Function to generate and download PDF ticket
  const downloadTicket = async () => {
    // Set loading state
    setIsGeneratingPDF(true);

    // Generate and download the PDF ticket with QR code
    if (ticketContainerRef.current) {
      try {
        await generatePDF(
          ticketContainerRef.current,
          `ticket-${bookingInfo.bookingId}.pdf`,
          bookingInfo.bookingId.toString() // Pass booking ID for QR code
        );
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("There was an error generating your ticket. Please try again.");
      } finally {
        // Reset loading state
        setIsGeneratingPDF(false);
      }
    } else {
      console.error("Ticket container reference not found");
      setIsGeneratingPDF(false);
    }
  };

  const bookingInfo = {
    bookingId: newBooking.bookingNumber,
    movie: screening.movieName,
    showTime: screening.startTime,
    room: screening.format,
    paymentMethod: newBooking.paymentMethod,
    status: newBooking.bookingStatus,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    address: formData.country,
    ticketItems: seatProduct.seats.map(seat => ({
      item: `${seat.seatNumber}`,
      quantity: 1,
      unitPrice: seat.price,
    }))
  };

  return (
    <>
    <Navbar />
    <Header title="Thank You" />
    <div className="container my-5">
      <h6 className="mb-4">Thank you for your ticket. You can download tickets in your mail or click the button below.</h6>

      <div id="ticket-container" ref={ticketContainerRef} className="p-4 bg-white text-dark rounded shadow">
        <div className="row mb-4 align-items-center">
          <div className="col-md-8 text-center text-md-start">
            <h2 className="mb-1">Movie Ticket</h2>
            <h5 className="text-muted">Booking #{bookingInfo.bookingId}</h5>
          </div>
          <div className="col-md-4 text-center">
            <div className="qr-code-wrapper border p-2 d-inline-block bg-white">
              <QRCodeGenerator
                value={bookingInfo.bookingId.toString()}
                size={100}
              />
            </div>
            <p className="small text-muted mt-1">Scan for verification</p>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <h4 className="border-bottom pb-2 mb-3">Movie Details</h4>
            <p>
              <strong>Movie:</strong>{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/movie/${screening.movieId}`);
                }}
                className="text-primary text-decoration-none"
              >
                {bookingInfo.movie}
              </a>
            </p>
            <p><strong>Show Time:</strong> {bookingInfo.showTime}</p>
            <p><strong>Room:</strong> {bookingInfo.room}</p>
            <p><strong>Status:</strong> <span className="badge bg-success">{bookingInfo.status}</span></p>
          </div>

          <div className="col-md-6">
            <h4 className="border-bottom pb-2 mb-3">Customer Information</h4>
            <p><strong>Name:</strong> {bookingInfo.firstName} {bookingInfo.lastName}</p>
            <p><strong>Email:</strong> {bookingInfo.email}</p>
            <p><strong>Phone:</strong> {bookingInfo.phone}</p>
            <p><strong>Payment Method:</strong> {bookingInfo.paymentMethod}</p>
          </div>
        </div>

        <h4 className="border-bottom pb-2 mb-3">Ticket Details</h4>
        <table className="table table-bordered">
          <thead className="bg-light">
            <tr>
              <th>Seat</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {bookingInfo.ticketItems.map((ticketItem, index) => (
              <tr key={index}>
                <td>{ticketItem.item}</td>
                <td>{ticketItem.quantity}</td>
                <td>${ticketItem.unitPrice.toFixed(2)}</td>
                <td>${(ticketItem.unitPrice * ticketItem.quantity).toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="3" className="text-end"><strong>Subtotal</strong></td>
              <td>${bookingInfo.ticketItems.map(ticketItem => (ticketItem.unitPrice * ticketItem.quantity)).reduce((a, b) => a + b, 0).toFixed(2)}</td>
            </tr>
            <tr className="table-active">
              <td colSpan="3" className="text-end"><strong>Total</strong></td>
              <td><strong>${bookingInfo.ticketItems.map(ticketItem => (ticketItem.unitPrice * ticketItem.quantity)).reduce((a, b) => a + b, 0).toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 text-center text-muted small">
          <p>Thank you for your purchase! Please arrive 15 minutes before showtime.</p>
          <p>This ticket serves as proof of purchase. No refunds or exchanges.</p>
        </div>
      </div>

      <div className="text-center mt-4">
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button
            className="btn btn-primary text-white py-2 px-4"
            onClick={downloadTicket}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Generating PDF...
              </>
            ) : (
              <>
                <i className="bi bi-file-earmark-pdf me-2"></i>
                Download PDF Ticket
              </>
            )}
          </button>

          <button
            className="btn btn-outline-primary py-2 px-4"
            onClick={() => navigate('/movies-now-playing')}
          >
            <i className="bi bi-film me-2"></i>
            Continue Browsing Movies
          </button>
        </div>
        <p className="text-muted mt-3 small">
          {isGeneratingPDF
            ? "Please wait while we generate your ticket..."
            : "Download your ticket or continue browsing more movies"}
        </p>
      </div>

      <div className="mt-5 py-4 bg-light text-center rounded">
        <h4 className="mb-3">Explore More Movies</h4>
        <p className="text-muted mb-4">Discover the latest blockbusters and upcoming releases</p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/movies-now-playing')}
          >
            <i className="bi bi-film me-2"></i>
            Now Playing
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/movies-coming-soon')}
          >
            <i className="bi bi-calendar-event me-2"></i>
            Coming Soon
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/home')}
          >
            <i className="bi bi-house me-2"></i>
            Back to Home
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </>


  );
};

export default ThankYouPage;

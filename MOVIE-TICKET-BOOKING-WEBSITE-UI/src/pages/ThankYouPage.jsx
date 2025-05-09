import React, { useEffect } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useLocation } from "react-router-dom"
import { useContext } from "react";
import ScreeningContext from "../contexts/ScreeningContext";
import SeatContext from "../contexts/SeatContext"
import { useNavigate } from "react-router-dom";

const ThankYouPage = () => {

  const navigate = useNavigate();

  const location = useLocation();
  const { newBooking } = location.state;
  console.dir(newBooking);

  const { screeningsState: {screening} } = useContext(ScreeningContext);
  const { seatProduct } = useContext(SeatContext)

  const bookingInfo = {
    bookingId: newBooking.bookingNumber,
    movie: screening.movieName,
    showTime: screening.startTime,
    room: screening.format,
    paymentMethod: newBooking.paymentMethod,
    status: newBooking.bookingStatus,
    firstName: "kdfljkjf",
    lastName: "efjkfjk",
    email: "phamductai102703@gmail.com",
    phone: "08498",
    address: "wlejr",
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
      <h6 className="mb-4">Thank you for your ticket. You can download tickets in your mail.</h6>

      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>Booking ID</th>
            <td>{bookingInfo.bookingId}</td>
          </tr>
          <tr>
            <th>Movie</th>
            <td><a onClick={() => {navigate(`/movie/${screening.movieId}`)}} className="text-decoration-none">{bookingInfo.movie}</a></td>
          </tr>
          <tr>
            <th>Show Time</th>
            <td>{bookingInfo.showTime}</td>
          </tr>
          <tr>
            <th>Room</th>
            <td>{bookingInfo.room}</td>
          </tr>
          <tr>
            <th>Payment method</th>
            <td>{bookingInfo.paymentMethod}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>{bookingInfo.status}</td>
          </tr>
          <tr>
            <th>First name</th>
            <td>{bookingInfo.firstName}</td>
          </tr>
          <tr>
            <th>Last name</th>
            <td>{bookingInfo.lastName}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{bookingInfo.email}</td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>{bookingInfo.phone}</td>
          </tr>
          <tr>
            <th>Address</th>
            <td>{bookingInfo.address}</td>
          </tr>
        </tbody>
      </table>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          { bookingInfo.ticketItems.map(ticketItem => (
            <tr>
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
          <tr>
            <td colSpan="3" className="text-end"><strong>Total</strong></td>
            <td>${bookingInfo.ticketItems.map(ticketItem => (ticketItem.unitPrice * ticketItem.quantity)).reduce((a, b) => a + b, 0).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <button className="btn btn-primary text-white mt-3">Download Tickets</button>
    </div>
    <Footer />
    </>


  );
};

export default ThankYouPage;

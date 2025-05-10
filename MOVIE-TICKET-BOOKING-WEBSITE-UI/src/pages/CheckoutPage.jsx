import { useState, useContext, useEffect } from 'react'

import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Footer from '../components/Footer'

import ScreeningContext from "../contexts/ScreeningContext";
import SeatContext from "../contexts/SeatContext";
import { useAuth } from '../contexts/AuthContext';

import cinemaApi from "../cinemaApi";
import { useNavigate } from 'react-router-dom'

function CheckoutPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    email: '',
    country: 'United States (US)',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    state: 'California',
    zip: '',
    orderNotes: '',
    hasCoupon: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const { screeningsState: {screening}, dispatchScreenings } = useContext(ScreeningContext);
  const { seatProduct: {seats}, dispatchSeatProduct } = useContext(SeatContext);

  useEffect(() => {
    console.log(seats)
  }, [seats])

  const [order, setOrder] = useState({
    product: screening.movieName,
    quantity: 1,
    date: screening.startTime,
    room: screening.format,
    seat: seats.map(seat => seat.seatNumber),
    service: '',
    address: screening.address,
    subtotal: seats.reduce((sum, seat) => sum + seat.price, 0),
    ticketFees: 0.0,
  })

  const [paymentMethod, setPaymentMethod] = useState('Direct bank transfer');
  const [isProcessing, setIsProcessing] = useState(false);

  const total = order.subtotal + order.ticketFees;

  async function handlePlaceOrderButtonClicked() {
    // Prevent multiple submissions
    if (isProcessing) {
      return;
    }

    // Validate required fields
    const requiredFields = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      streetAddress1: 'Street Address',
      city: 'City',
      zip: 'ZIP Code'
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Check if user is logged in and has a token
    if (!currentUser || !currentUser.token) {
      console.error('User not authenticated or missing token');
      alert('Please log in to complete your order');
      navigate('/my-account');
      return;
    }

    // Set loading state to true
    setIsProcessing(true);

    try {
      console.log('Updating seat status with authentication...');

      // update seat with authentication header
      for (let seat of seats) {
        await cinemaApi.put(
          "/seats/status",
          {
            screeningId: screening.screeningId,
            seatNumber: seat.seatNumber,
            status: "booked"
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`
            }
          }
        );
      }

      const orderData = {
        ...order,
        screeningId: screening.screeningId,
        userId: currentUser._id,
        paymentMethod,
        total
      };

      console.log('Creating order with data:', orderData);
      console.log('Using authentication token:', currentUser.token);

      // create order with authentication header
      const response = await cinemaApi.post(
        "/bookings/create-simple",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        }
      );

      const newBooking = response.data;

      console.log(newBooking);
      // reset all the contexts

      console.log("Order created successfully");

      navigate("/thank-you", {
        state: { newBooking, formData }
      });
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      alert('There was an error processing your order. Please try again.');

      // Reset loading state on error
      setIsProcessing(false);
    }

    // dispatchSeatProduct({ type: "RESET" })
    // dispatchScreenings({ type: "RESET"})

  }

  return (
    <>
      <Navbar />
      <Header title="Checkout" />
      <main>
        <div className="container pt-5">
          <h2>Checkout</h2>

          <div className="alert alert-light border d-flex align-items-center" role="alert">
            <input
              type="checkbox"
              className="me-2"
              name="hasCoupon"
              checked={formData.hasCoupon}
              onChange={handleChange}
            />
            <span>
              Have a coupon? <a href="#">Click here to enter your code</a>
            </span>
          </div>

          <div className="row">
            {/* Billing Details */}
            <div className="col-md-7">
              <h5 className="mb-3">Billing Details</h5>
              <p className="small text-muted mb-3">
                Fields marked with <span className="text-danger">*</span> are required.
              </p>

              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">
                    First name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${!formData.firstName && 'border-danger'}`}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col">
                  <label className="form-label">
                    Last name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${!formData.lastName && 'border-danger'}`}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Company name (optional)</label>
                <input
                  type="text"
                  className="form-control"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">
                    Phone <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${!formData.phone && 'border-danger'}`}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col">
                  <label className="form-label">
                    Email address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${!formData.email && 'border-danger'}`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Country / Region <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                >
                  <option>United States (US)</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  {/* Add more countries as needed */}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Street address <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control mb-2 ${!formData.streetAddress1 && 'border-danger'}`}
                  placeholder="House number and street name"
                  name="streetAddress1"
                  value={formData.streetAddress1}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  name="streetAddress2"
                  value={formData.streetAddress2}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Town / City <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${!formData.city && 'border-danger'}`}
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">
                    State <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  >
                    <option>California</option>
                    <option>Texas</option>
                    <option>New York</option>
                    {/* Add more states */}
                  </select>
                </div>
                <div className="col">
                  <label className="form-label">
                    ZIP Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${!formData.zip && 'border-danger'}`}
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="col-md-5">
              <h5 className="mb-3">Additional Information</h5>
              <div className="mb-3">
                <label className="form-label">Order notes (optional)</label>
                <textarea
                  className="form-control"
                  rows="7"
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleChange}
                  placeholder="Notes about your order, e.g. special notes for delivery."
                />
              </div>
            </div>
          </div>

          <div className="row">

          </div>
        </div>
        <div className="container py-5">
          <h5 className="mb-3">YOUR ORDER</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Product</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{order.product}</strong> &times; {order.quantity}
                  <div className="text-muted small mt-2">
                    <div><strong>Date:</strong> {order.date}</div>
                    <div><strong>Room:</strong> {order.room}</div>
                    <div><strong>Seat:</strong> {order.seat.join(', ')}</div>
                    <div><strong>Extra Service:</strong> {order.service}</div>
                    <div><strong>Address:</strong> {order.address || '(not provided)'}</div>
                  </div>
                </td>
                <td className="text-end">${order.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Subtotal</strong></td>
                <td className="text-end">${order.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Ticket Fees</strong></td>
                <td className="text-end">${order.ticketFees.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Total</strong></td>
                <td className="text-end fw-bold">${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* Payment Options */}
          <div className="bg-light p-3 mt-4 border rounded">
            <div className="form-check mb-2">
              <input
                type="radio"
                className="form-check-input"
                id="bankTransfer"
                name="paymentMethod"
                value="Direct bank transfer"
                checked={paymentMethod === 'Direct bank transfer'}
                onChange={() => setPaymentMethod('Direct bank transfer')}
              />
              <label className="form-check-label fw-bold" htmlFor="bankTransfer">
                Direct bank transfer
              </label>
            </div>
            {paymentMethod === 'Direct bank transfer' && (
              <div className="bg-white p-3 border mb-3">
                Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.
              </div>
            )}

            <div className="form-check mb-3">
              <input
                type="radio"
                className="form-check-input"
                id="cashOnDelivery"
                name="paymentMethod"
                value="Cash on delivery"
                checked={paymentMethod === 'Cash on delivery'}
                onChange={() => setPaymentMethod('Cash on delivery')}
              />
              <label className="form-check-label fw-bold" htmlFor="cashOnDelivery">
                Cash on delivery
              </label>
            </div>

            <p className="small text-muted">
              Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <a href="#" className="text-decoration-underline text-danger">privacy policy</a>.
            </p>

            <button
              onClick={() => handlePlaceOrderButtonClicked()}
              className="btn btn-dark w-100 mt-3"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing Order...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CheckoutPage
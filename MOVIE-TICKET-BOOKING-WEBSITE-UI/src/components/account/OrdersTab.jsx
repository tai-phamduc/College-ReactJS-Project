import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import cinemaApi from '../../cinemaApi';
import { generatePDF } from '../../utils/pdfGenerator';
import './OrdersTab.css';

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Test API connectivity
  const testApiConnection = async () => {
    try {
      console.log('Testing API connectivity...');
      const testResponse = await cinemaApi.get('/users/test');
      console.log('API test successful:', testResponse.data);
      return true;
    } catch (err) {
      console.error('API test failed:', err);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      } else if (err.request) {
        console.error('No response received. Request:', err.request);
      } else {
        console.error('Error setting up request:', err.message);
      }
      return false;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser || !currentUser.token) {
        console.log('No current user or token available', currentUser);
        setLoading(false);
        return;
      }

      // First test API connectivity
      await testApiConnection();

      console.log('Attempting to fetch orders for user:', currentUser.email);

      try {
        // Try our new simplified endpoint
        console.log('Trying to fetch from /users/my-bookings endpoint');

        const response = await cinemaApi.get('/users/my-bookings', {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });

        console.log('Response received:', response.status);

        if (response.data) {
          console.log(`Received ${Array.isArray(response.data) ? response.data.length : 0} orders`);
          setOrders(response.data);
        } else {
          console.log('Response data is empty or undefined');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders from simplified endpoint:', err);

        // Log detailed error information
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
        } else if (err.request) {
          console.error('No response received. Request:', err.request);
        } else {
          console.error('Error setting up request:', err.message);
        }

        // Try original endpoints as fallback
        try {
          console.log('Trying fallback endpoint /users/bookings');

          const fallbackResponse = await cinemaApi.get('/users/bookings', {
            headers: {
              Authorization: `Bearer ${currentUser.token}`
            }
          });

          console.log('Fallback response received:', fallbackResponse.status);

          if (fallbackResponse.data) {
            console.log(`Received ${Array.isArray(fallbackResponse.data) ? fallbackResponse.data.length : 0} orders from fallback`);
            setOrders(fallbackResponse.data);
            setLoading(false);
            return;
          }
        } catch (fallbackErr) {
          console.error('Error fetching from first fallback endpoint:', fallbackErr);

          // Try second fallback
          try {
            console.log('Trying second fallback endpoint /bookings');

            const secondFallbackResponse = await cinemaApi.get('/bookings', {
              headers: {
                Authorization: `Bearer ${currentUser.token}`
              }
            });

            console.log('Second fallback response received:', secondFallbackResponse.status);

            if (secondFallbackResponse.data) {
              console.log(`Received ${Array.isArray(secondFallbackResponse.data) ? secondFallbackResponse.data.length : 0} orders from second fallback`);
              setOrders(secondFallbackResponse.data);
              setLoading(false);
              return;
            }
          } catch (secondFallbackErr) {
            console.error('Error fetching from second fallback endpoint:', secondFallbackErr);
          }
        }

        setError('Failed to load your orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const handleDownloadTicket = async (order) => {
    try {
      // Check if order has necessary data
      if (!order || !order.bookingNumber) {
        alert('Cannot generate ticket: Missing booking information');
        return;
      }

      // Create a temporary container for the ticket
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.className = 'p-4 bg-white text-dark rounded shadow';

      // Get seat information safely
      const seats = order.seats && Array.isArray(order.seats) ? order.seats : [];
      const totalAmount = order.totalAmount || 0;

      // Format customer name
      const customerName = order.firstName && order.lastName
        ? `${order.firstName} ${order.lastName}`
        : order.name || currentUser?.name || currentUser?.email || 'Customer';

      // Populate the container with ticket information
      container.innerHTML = `
        <div class="text-center mb-4">
          <h2 class="mb-1">Movie Ticket</h2>
          <h5 class="text-muted">Booking #${order.bookingNumber}</h5>
        </div>

        <div class="row mb-4">
          <div class="col-md-6">
            <h4 class="border-bottom pb-2 mb-3">Movie Details</h4>
            <p><strong>Movie:</strong> ${order.movieName || 'N/A'}</p>
            <p><strong>Show Time:</strong> ${order.showTime || 'N/A'}</p>
            <p><strong>Room:</strong> ${order.format || 'N/A'}</p>
            <p><strong>Status:</strong> <span class="badge bg-success">${order.bookingStatus || 'On hold'}</span></p>
          </div>

          <div class="col-md-6">
            <h4 class="border-bottom pb-2 mb-3">Customer Information</h4>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${order.email || currentUser?.email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${order.phone || 'N/A'}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</p>
          </div>
        </div>

        <h4 class="border-bottom pb-2 mb-3">Ticket Details</h4>
        <table class="table table-bordered">
          <thead class="bg-light">
            <tr>
              <th>Seat</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${seats.length > 0 ? seats.map(seat => `
              <tr>
                <td>${seat.seatNumber || 'N/A'}</td>
                <td>1</td>
                <td>$${(seat.price || 0).toFixed(2)}</td>
                <td>$${(seat.price || 0).toFixed(2)}</td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="4" class="text-center">No seat information available</td>
              </tr>
            `}
            <tr>
              <td colspan="3" class="text-end"><strong>Total</strong></td>
              <td><strong>$${totalAmount.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="mt-4 text-center text-muted small">
          <p>Thank you for your purchase! Please arrive 15 minutes before showtime.</p>
          <p>This ticket serves as proof of purchase. No refunds or exchanges.</p>
        </div>
      `;

      // Append to body temporarily
      document.body.appendChild(container);

      // Generate PDF
      await generatePDF(container, `ticket-${order.bookingNumber}.pdf`, order.bookingNumber.toString());

      // Remove the temporary container
      document.body.removeChild(container);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate ticket. Please try again.');
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        You haven't placed any orders yet.
      </div>
    );
  }

  return (
    <div className="orders-tab">
      <h3 className="mb-4">Your Orders</h3>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="bg-light">
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              // Format date
              const orderDate = order.bookingDate
                ? new Date(order.bookingDate).toLocaleDateString()
                : 'N/A';

              // Calculate total items
              const totalItems = order.seats && Array.isArray(order.seats)
                ? order.seats.length
                : 0;

              // Format total amount
              const totalAmount = order.totalPrice
                ? `$${order.totalPrice.toFixed(2)}`
                : 'N/A';

              return (
                <tr key={order._id}>
                  <td>#{order.bookingNumber || 'N/A'}</td>
                  <td>{orderDate}</td>
                  <td>{order.bookingStatus || 'On hold'}</td>
                  <td>{totalAmount} for {totalItems} item{totalItems !== 1 ? 's' : ''}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary text-white"
                        onClick={() => handleDownloadTicket(order)}
                      >
                        Download Tickets
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleViewOrder(order._id)}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTab;

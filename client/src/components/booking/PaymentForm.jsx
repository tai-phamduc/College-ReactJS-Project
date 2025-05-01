import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaCreditCard, FaPaypal, FaGooglePay, FaApplePay, FaLock } from 'react-icons/fa';
import './PaymentForm.css';

const PaymentForm = ({ 
  onSubmit, 
  amount, 
  currency = 'USD', 
  isProcessing = false,
  onCancel
}) => {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Add space after every 4 digits
    let formatted = '';
    for (let i = 0; i < digits.length; i += 4) {
      formatted += digits.slice(i, i + 4) + ' ';
    }
    
    return formatted.trim();
  };

  const formatExpiryDate = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length > 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4);
    } else {
      return digits;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted.slice(0, 19)); // Limit to 16 digits + 3 spaces
  };

  const handleExpiryDateChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'credit-card') {
      if (!cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      
      if (!cardName.trim()) {
        newErrors.cardName = 'Name on card is required';
      }
      
      if (!expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = 'Expiry date must be in MM/YY format';
      }
      
      if (!cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(cvv)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const paymentData = {
      method: paymentMethod,
      amount,
      currency,
      ...(paymentMethod === 'credit-card' && {
        cardDetails: {
          number: cardNumber.replace(/\s/g, ''),
          name: cardName,
          expiry: expiryDate,
          cvv
        }
      })
    };
    
    onSubmit(paymentData);
  };

  return (
    <div className="payment-form-container">
      <h3 className="payment-form-title">Payment Details</h3>
      
      <div className="payment-amount">
        <span>Total Amount:</span>
        <span className="amount">{currency === 'USD' ? '$' : ''}{amount.toFixed(2)}</span>
      </div>
      
      <div className="payment-methods">
        <div className="payment-method-options">
          <label className={`payment-method-option ${paymentMethod === 'credit-card' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="credit-card"
              checked={paymentMethod === 'credit-card'}
              onChange={() => setPaymentMethod('credit-card')}
            />
            <div className="payment-method-icon">
              <FaCreditCard />
            </div>
            <div className="payment-method-label">Credit Card</div>
          </label>
          
          <label className={`payment-method-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={() => setPaymentMethod('paypal')}
            />
            <div className="payment-method-icon">
              <FaPaypal />
            </div>
            <div className="payment-method-label">PayPal</div>
          </label>
          
          <label className={`payment-method-option ${paymentMethod === 'google-pay' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="google-pay"
              checked={paymentMethod === 'google-pay'}
              onChange={() => setPaymentMethod('google-pay')}
            />
            <div className="payment-method-icon">
              <FaGooglePay />
            </div>
            <div className="payment-method-label">Google Pay</div>
          </label>
          
          <label className={`payment-method-option ${paymentMethod === 'apple-pay' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="apple-pay"
              checked={paymentMethod === 'apple-pay'}
              onChange={() => setPaymentMethod('apple-pay')}
            />
            <div className="payment-method-icon">
              <FaApplePay />
            </div>
            <div className="payment-method-label">Apple Pay</div>
          </label>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="payment-form">
        {paymentMethod === 'credit-card' && (
          <div className="credit-card-form">
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className={errors.cardNumber ? 'error' : ''}
                />
                <FaCreditCard className="input-icon" />
              </div>
              {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="cardName">Name on Card</label>
              <input
                type="text"
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                className={errors.cardName ? 'error' : ''}
              />
              {errors.cardName && <div className="error-message">{errors.cardName}</div>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  className={errors.expiryDate ? 'error' : ''}
                />
                {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    maxLength="4"
                    className={errors.cvv ? 'error' : ''}
                  />
                  <FaLock className="input-icon" />
                </div>
                {errors.cvv && <div className="error-message">{errors.cvv}</div>}
              </div>
            </div>
          </div>
        )}
        
        {paymentMethod === 'paypal' && (
          <div className="alternative-payment-message">
            <p>You will be redirected to PayPal to complete your payment securely.</p>
          </div>
        )}
        
        {paymentMethod === 'google-pay' && (
          <div className="alternative-payment-message">
            <p>You will be redirected to Google Pay to complete your payment securely.</p>
          </div>
        )}
        
        {paymentMethod === 'apple-pay' && (
          <div className="alternative-payment-message">
            <p>You will be redirected to Apple Pay to complete your payment securely.</p>
          </div>
        )}
        
        <div className="secure-payment-notice">
          <FaLock />
          <span>Your payment information is secure. We use encryption to protect your data.</span>
        </div>
        
        <div className="demo-notice">
          <p>This is a demo implementation. No actual payment will be processed.</p>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel" 
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-pay" 
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              <>Pay {currency === 'USD' ? '$' : ''}{amount.toFixed(2)}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

PaymentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string,
  isProcessing: PropTypes.bool,
  onCancel: PropTypes.func.isRequired
};

export default PaymentForm;

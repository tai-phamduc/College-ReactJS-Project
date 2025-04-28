import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    // Clear error when user starts typing
    if (formErrors[id]) {
      setFormErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);

        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
          });
          setSubmitSuccess(false);
        }, 3000);
      }, 1500);
    }
  };

  return (
    <div className="bg-dark">
      {/* Hero Section */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-gray-300 text-lg mb-8">
              Have questions or feedback? We'd love to hear from you. Get in touch with our team.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              {submitSuccess ? (
                <div className="bg-green-800 text-white p-6 rounded-lg text-center">
                  <FaCheckCircle className="mx-auto text-4xl mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
                  <p>Thank you for contacting us. We'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-300 mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 ${
                          formErrors.name ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                        }`}
                        placeholder="John Doe"
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-300 mb-2">
                        Your Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 ${
                          formErrors.email ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                        }`}
                        placeholder="john@example.com"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-gray-300 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 ${
                        formErrors.subject ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                      }`}
                      placeholder="How can we help you?"
                    />
                    {formErrors.subject && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.subject}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-300 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 ${
                        formErrors.message ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                      }`}
                      placeholder="Your message here..."
                    ></textarea>
                    {formErrors.message && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn btn-primary flex items-center justify-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <div className="bg-secondary p-8 rounded-lg">
                <div className="mb-6">
                  <div className="flex items-start mb-4">
                    <div className="text-primary text-xl mr-4 mt-1">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Our Location</h3>
                      <p className="text-gray-300">
                        123 Movie Street, Hollywood<br />
                        Los Angeles, CA 90001<br />
                        United States
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start mb-4">
                    <div className="text-primary text-xl mr-4 mt-1">
                      <FaPhone />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Phone Number</h3>
                      <p className="text-gray-300">
                        +1 (123) 456-7890<br />
                        +1 (987) 654-3210
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start mb-4">
                    <div className="text-primary text-xl mr-4 mt-1">
                      <FaEnvelope />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Email Address</h3>
                      <p className="text-gray-300">
                        info@moviehub.com<br />
                        support@moviehub.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-primary text-xl mr-4 mt-1">
                      <FaClock />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Working Hours</h3>
                      <p className="text-gray-300">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-300 hover:text-primary">
                      <FaFacebook size={24} />
                    </a>
                    <a href="#" className="text-gray-300 hover:text-primary">
                      <FaTwitter size={24} />
                    </a>
                    <a href="#" className="text-gray-300 hover:text-primary">
                      <FaInstagram size={24} />
                    </a>
                    <a href="#" className="text-gray-300 hover:text-primary">
                      <FaYoutube size={24} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <h2 className="text-3xl font-bold mb-6 text-center">Find Us on the Map</h2>
          <div className="h-96 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7152203584424!2d-118.32504548478758!3d34.10204628059233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bf20e4c82873%3A0x14015754d926dadb!2sParamount%20Pictures!5e0!3m2!1sen!2sus!4v1623456789012!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MovieHub Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 bg-secondary p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">How do I book a movie ticket?</h3>
              <p className="text-gray-300">
                You can book a movie ticket by selecting a movie, choosing a theater and showtime, and completing the payment process. It's that simple!
              </p>
            </div>
            <div className="mb-6 bg-secondary p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Can I cancel my booking?</h3>
              <p className="text-gray-300">
                Yes, you can cancel your booking up to 2 hours before the showtime. Please note that a cancellation fee may apply.
              </p>
            </div>
            <div className="mb-6 bg-secondary p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">How can I contact customer support?</h3>
              <p className="text-gray-300">
                You can contact our customer support team by phone, email, or through the contact form on this page. We're available to assist you during our working hours.
              </p>
            </div>
            <div className="bg-secondary p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-300">
                Yes, we offer refunds for cancelled bookings. The refund will be processed within 3-5 business days, depending on your payment method.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

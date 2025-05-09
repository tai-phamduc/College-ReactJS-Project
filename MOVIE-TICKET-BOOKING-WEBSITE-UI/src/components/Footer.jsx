import React from 'react';
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light pt-5">
      <div className="container-sm">

        <div className="d-flex justify-content-between align-items-center">
          <img
            src="https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/logo-white.png"
            alt="Aovis Logo"
            style={{ width: '108px', height: 'auto' }}
          />
          <div className="d-flex align-items-center gap-4">
            <span>Help / Privacy Policy</span>
            <div className="d-flex gap-2">
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-pinterest-p"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-secondary mt-4 mb-5" />

        <div className="row py-4">
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">
              Buy movie tickets easily with<br />Aovis system nationwide
            </h5>
            <button className="btn btn-primary text-white fw-semibold mt-3 px-4">
              Get Your Ticket
            </button>
          </div>

          <div className="col-md-2 mb-4">
            <h6 className="section-title position-relative mb-4">Movies</h6>
            <ul className="list-unstyled vstack gap-3">
              <li><a href="#" className="footer-link">Action</a></li>
              <li><a href="#" className="footer-link">Adventure</a></li>
              <li><a href="#" className="footer-link">Animation</a></li>
              <li><a href="#" className="footer-link">Comedy</a></li>
              <li><a href="#" className="footer-link">Crime</a></li>
            </ul>
          </div>

          <div className="col-md-2 mb-4">
            <h6 className="section-title position-relative mb-4">Links</h6>
            <ul className="list-unstyled vstack gap-3">
              <li><a href="#" className="footer-link">About</a></li>
              <li><a href="#" className="footer-link">My account</a></li>
              <li><a href="#" className="footer-link">News</a></li>
              <li><a href="#" className="footer-link">Latest Events</a></li>
              <li><a href="#" className="footer-link">Contact</a></li>
            </ul>
          </div>


          <div className="col-md-4 mb-4">
            <h6 className="section-title position-relative mb-4">Newsletter</h6>
            <p className="text-secondary">Subscribe to Leitmotif newsletter this very day.</p>
            <div className="input-group mb-3">
              <input type="email" className="form-control rounded-0" placeholder="Email Address" />
              <button className="btn btn-light" type="button">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="agreeCheck" />
              <label className="form-check-label text-secondary" htmlFor="agreeCheck">
                I agree to all terms and policies of the company
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-secondary py-4" style={{backgroundColor: "#131313"}}>
          © Copyright 2023 by Ovatheme.com
      </div>
    </footer>
  );
};

export default Footer;

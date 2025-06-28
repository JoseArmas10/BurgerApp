import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {
  // Scroll State
  const [isVisible, setIsVisible] = useState(false);
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const listenToScroll = () => {
    let heightToHidden = 250;
    const windowScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    windowScroll > heightToHidden ? setIsVisible(true) : setIsVisible(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
  });
  return (
    <>
      <footer>
        <Container>
          <Row>
            <Col sm={6} lg={3} className="mb-4 mb-lg-0">
              <div className="text-center">
                <h5>Location</h5>
                <p>1234 Burger Street</p>
                <p>Food District, FL 33101</p>
                <p>United States</p>
              </div>
            </Col>
            <Col sm={6} lg={3} className="mb-4 mb-lg-0">
              <div className="text-center">
                <h5>Working Hours</h5>
                <p>Mon-Thu: 10:00AM - 11:00PM</p>
                <p>Fri-Sat: 10:00AM - 12:00AM</p>
                <p>Sunday: 11:00AM - 10:00PM</p>
              </div>
            </Col>
            <Col sm={6} lg={3} className="mb-4 mb-lg-0">
              <div className="text-center">
                <h5>Order Now</h5>
                <p>Fast delivery to your door</p>
                <p>
                  <Link to="tel:+15551234567" className="calling">
                    +1 (555) 123-4567
                  </Link>
                </p>
              </div>
            </Col>
            <Col sm={6} lg={3} className="mb-4 mb-lg-0">
              <div className="text-center">
                <h5>Follow Us</h5>
                <p>Stay connected with us!</p>
                <ul className="list-unstyled text-center mt-2">
                  <li>
                    <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-facebook"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-twitter"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="https://instagram.com" target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-instagram"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="https://youtube.com" target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-youtube"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
          <Row className="copy_right">
            <Col>
              <div>
                <ul className="list-unstyled text-center mb-0">
                  <li>
                    <Link to="/">
                      © 2025 <span>BURGER & PET TREATS CO.</span> All Rights Reserved
                    </Link>
                  </li>
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/menu">Our Menu</Link>
                  </li>
                  <li>
                    <Link to="/shop">Pet Shop</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact</Link>
                  </li>
                </ul>
                <div className="text-center mt-3">
                  <small className="text-muted">
                    🍔 Delicious burgers for you • 🐕 Healthy treats for your pets • ❤️ Made with love since 2025
                  </small>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Scroll To Top */}
      {isVisible && (
        <div className="scroll_top" onClick={scrollTop}>
          <i className="bi bi-arrow-up"></i>
        </div>
      )}
    </>
  );
}

export default Footer;

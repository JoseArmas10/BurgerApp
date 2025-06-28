import React from "react";
import { Container, Row, Col } from "react-bootstrap";
// import Burger from "../../assets/hero/hero-2.png"; // IMAGE MISSING
import { Link } from "react-router-dom";
import DeliveryIndicator from "../../components/DeliveryIndicator";

const Section1 = () => {
  return (
    <section className="hero_section">
      <Container>
        <Row>
          <Col lg={7} className="mb-5 mb-lg-0">
            <div className="position-relative">
              {/* <img src={Burger} className="img-fluid" alt="Hero" /> */}
              <div style={{width: '100%', height: '300px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #dee2e6'}}>
                <span style={{color: '#6c757d'}}>Hero Image Placeholder</span>
              </div>
              <div className="price_badge">
                <div className="badge_text">
                  <h4 className="h4_xs">Only</h4>
                  <h4 className="h3_lg">$6.99</h4>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={5}>
            <div className="hero_text text-center">
              <h1 className="text-white">New Burger</h1>
              <h2 className="text-white">With Onion</h2>
              <p className="text-white pt-2 pb-3">
                Feugiat primis ligula risus auctor laoreet augue egestas mauris
                viverra tortor in iaculis pretium at magna mauris ipsum primis
                rhoncus feugiat
              </p>
              
              {/* Delivery Indicator */}
              <div className="mb-4">
                <DeliveryIndicator size="large" showAddress={true} />
              </div>
              
              <Link to="/menu" className="btn order_now">
                Order Now
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Section1;

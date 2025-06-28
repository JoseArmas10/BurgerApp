import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import Layout from "../../components/Layouts/Layout";
import "../../styles/ContactStyle.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    // Form submitted with data: formData
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="contact-hero">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h1 className="contact-title">Get in Touch</h1>
              <p className="contact-subtitle">
                We'd love to hear from you! Whether you have questions, feedback, 
                or just want to say hello, don't hesitate to reach out.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info">
        <Container>
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <Card className="contact-card h-100">
                <Card.Body className="text-center">
                  <div className="contact-icon">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <Card.Title>Visit Us</Card.Title>
                  <Card.Text>
                    123 Burger Street<br />
                    Downtown District<br />
                    City, State 12345
                  </Card.Text>
                  <Button variant="outline-primary" size="sm">
                    Get Directions
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <Card className="contact-card h-100">
                <Card.Body className="text-center">
                  <div className="contact-icon">
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <Card.Title>Call Us</Card.Title>
                  <Card.Text>
                    Main: (555) 123-4567<br />
                    Orders: (555) 123-FOOD<br />
                    Available 10 AM - 10 PM
                  </Card.Text>
                  <Button variant="outline-primary" size="sm">
                    Call Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <Card className="contact-card h-100">
                <Card.Body className="text-center">
                  <div className="contact-icon">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <Card.Title>Email Us</Card.Title>
                  <Card.Text>
                    General: info@burgerapp.com<br />
                    Support: support@burgerapp.com<br />
                    We respond within 24 hours
                  </Card.Text>
                  <Button variant="outline-primary" size="sm">
                    Send Email
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <div className="contact-form-wrapper">
                <h2 className="text-center mb-4">Send Us a Message</h2>
                <p className="text-center mb-5">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                
                {showAlert && (
                  <Alert variant="success" className="mb-4">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Thank you for your message! We'll get back to you soon.
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="contact-input"
                          placeholder="Enter your full name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="contact-input"
                          placeholder="Enter your email"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="contact-input"
                          placeholder="Enter your phone number"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Subject *</Form.Label>
                        <Form.Select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="contact-input"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="feedback">Feedback</option>
                          <option value="complaint">Complaint</option>
                          <option value="catering">Catering Services</option>
                          <option value="careers">Careers</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-4">
                    <Form.Label>Message *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="contact-input"
                      placeholder="Tell us how we can help you..."
                    />
                  </Form.Group>
                  <div className="text-center">
                    <Button type="submit" className="contact-submit-btn">
                      <i className="bi bi-send-fill me-2"></i>
                      Send Message
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Hours & Map */}
      <section className="hours-map">
        <Container>
          <Row>
            <Col lg={6} className="mb-4">
              <Card className="hours-card">
                <Card.Body>
                  <h3 className="mb-4">
                    <i className="bi bi-clock-fill me-2 text-primary"></i>
                    Opening Hours
                  </h3>
                  <div className="hours-list">
                    <div className="hours-item">
                      <span className="day">Monday - Thursday</span>
                      <span className="time">10:00 AM - 10:00 PM</span>
                    </div>
                    <div className="hours-item">
                      <span className="day">Friday - Saturday</span>
                      <span className="time">10:00 AM - 11:00 PM</span>
                    </div>
                    <div className="hours-item">
                      <span className="day">Sunday</span>
                      <span className="time">11:00 AM - 9:00 PM</span>
                    </div>
                  </div>
                  <div className="special-hours mt-4">
                    <h5>Holiday Hours</h5>
                    <p className="mb-0">
                      We may have special hours during holidays. 
                      Please call ahead to confirm our hours.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} className="mb-4">
              <Card className="map-card">
                <Card.Body>
                  <h3 className="mb-4">
                    <i className="bi bi-map-fill me-2 text-primary"></i>
                    Find Us
                  </h3>
                  <div className="map-placeholder">
                    <div className="map-content">
                      <i className="bi bi-geo-alt-fill"></i>
                      <p>Interactive Map<br />Coming Soon</p>
                      <Button variant="primary" size="sm">
                        View on Google Maps
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2 className="mb-4">Frequently Asked Questions</h2>
              <div className="faq-list">
                <div className="faq-item">
                  <h5>Do you offer delivery?</h5>
                  <p>Yes! We offer delivery through our mobile app and major delivery platforms within a 5-mile radius.</p>
                </div>
                <div className="faq-item">
                  <h5>Do you have vegetarian options?</h5>
                  <p>Absolutely! We have several vegetarian and vegan burger options, including our popular plant-based patties.</p>
                </div>
                <div className="faq-item">
                  <h5>Can I make reservations?</h5>
                  <p>We operate on a first-come, first-served basis, but we do accept reservations for parties of 8 or more.</p>
                </div>
                <div className="faq-item">
                  <h5>Do you cater events?</h5>
                  <p>Yes! We offer catering services for events of all sizes. Contact us for more information and pricing.</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};

export default Contact;

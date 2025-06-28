import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Layout from "../../components/Layouts/Layout";
import "../../styles/AboutStyle.css";

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="about-hero">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6}>
              <h1 className="about-title">About Our Story</h1>
              <p className="about-subtitle">
                We've been serving the best burgers in town since 1995, 
                crafting each meal with passion, quality ingredients, and love.
              </p>
              <div className="about-stats">
                <div className="stat-item">
                  <h3>28+</h3>
                  <p>Years of Experience</p>
                </div>
                <div className="stat-item">
                  <h3>500K+</h3>
                  <p>Happy Customers</p>
                </div>
                <div className="stat-item">
                  <h3>50+</h3>
                  <p>Menu Items</p>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="about-hero-image">
                <div className="placeholder-image-large">
                  <span>Our Restaurant Story Image</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2>Our Mission</h2>
              <p className="lead">
                To serve delicious, high-quality burgers made from the freshest ingredients, 
                while creating memorable experiences for our customers in a warm, welcoming environment.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2>Our Values</h2>
              <p>What makes us different</p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="value-card h-100">
                <Card.Body className="text-center">
                  <div className="value-icon">
                    <i className="bi bi-heart-fill"></i>
                  </div>
                  <Card.Title>Quality First</Card.Title>
                  <Card.Text>
                    We source only the finest ingredients and prepare everything fresh daily 
                    to ensure the highest quality in every bite.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="value-card h-100">
                <Card.Body className="text-center">
                  <div className="value-icon">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <Card.Title>Community Focus</Card.Title>
                  <Card.Text>
                    We're more than a restaurant - we're part of the community, 
                    supporting local suppliers and giving back whenever we can.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="value-card h-100">
                <Card.Body className="text-center">
                  <div className="value-icon">
                    <i className="bi bi-lightning-fill"></i>
                  </div>
                  <Card.Title>Innovation</Card.Title>
                  <Card.Text>
                    We constantly evolve our menu and cooking techniques to bring you 
                    exciting new flavors while respecting classic traditions.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2>Meet Our Team</h2>
              <p>The passionate people behind your favorite burgers</p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <div className="team-member">
                <div className="team-image">
                  <div className="placeholder-image-team">
                    <span>Chef</span>
                  </div>
                </div>
                <h4>Maria Rodriguez</h4>
                <p className="team-role">Head Chef</p>
                <p>With 15 years of culinary experience, Maria creates our signature flavors.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="team-member">
                <div className="team-image">
                  <div className="placeholder-image-team">
                    <span>Manager</span>
                  </div>
                </div>
                <h4>John Smith</h4>
                <p className="team-role">General Manager</p>
                <p>John ensures every customer has an amazing experience at our restaurant.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="team-member">
                <div className="team-image">
                  <div className="placeholder-image-team">
                    <span>Owner</span>
                  </div>
                </div>
                <h4>Sarah Johnson</h4>
                <p className="team-role">Owner & Founder</p>
                <p>Sarah founded our restaurant with a vision to bring people together through food.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2>Ready to Taste the Difference?</h2>
              <p>Come visit us and experience what makes our burgers special!</p>
              <a href="/menu" className="btn btn-primary btn-lg">
                View Our Menu
              </a>
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};

export default About;

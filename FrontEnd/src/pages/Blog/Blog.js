import React from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import Layout from "../../components/Layouts/Layout";
import "../../styles/BlogStyle.css";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Secret Behind Our Signature Sauce",
      excerpt: "Discover the story and ingredients that make our signature sauce so special and loved by customers.",
      author: "Chef Maria Rodriguez",
      date: "December 15, 2024",
      category: "Recipes",
      readTime: "5 min read",
      featured: true
    },
    {
      id: 2,
      title: "10 Tips for the Perfect Burger at Home",
      excerpt: "Learn professional techniques to make restaurant-quality burgers in your own kitchen.",
      author: "John Smith",
      date: "December 10, 2024",
      category: "Tips & Tricks",
      readTime: "8 min read",
      featured: false
    },
    {
      id: 3,
      title: "The History of Burgers: From Hamburg to Here",
      excerpt: "Take a journey through time to discover how burgers became America's favorite food.",
      author: "Sarah Johnson",
      date: "December 5, 2024",
      category: "History",
      readTime: "6 min read",
      featured: false
    },
    {
      id: 4,
      title: "Sustainable Sourcing: Our Commitment to Quality",
      excerpt: "Learn about our partnerships with local farms and commitment to sustainable ingredients.",
      author: "Mike Wilson",
      date: "November 28, 2024",
      category: "Sustainability",
      readTime: "7 min read",
      featured: true
    },
    {
      id: 5,
      title: "Behind the Scenes: A Day in Our Kitchen",
      excerpt: "Go behind the scenes to see how our team prepares hundreds of burgers every day.",
      author: "Chef Maria Rodriguez",
      date: "November 20, 2024",
      category: "Behind the Scenes",
      readTime: "4 min read",
      featured: false
    },
    {
      id: 6,
      title: "Customer Spotlight: Burger Love Stories",
      excerpt: "Read heartwarming stories from customers about their favorite burger memories.",
      author: "Sarah Johnson",
      date: "November 15, 2024",
      category: "Customer Stories",
      readTime: "3 min read",
      featured: false
    }
  ];

  const categories = ["All", "Recipes", "Tips & Tricks", "History", "Sustainability", "Behind the Scenes", "Customer Stories"];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="blog-hero">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h1 className="blog-title">Our Blog</h1>
              <p className="blog-subtitle">
                Stories, recipes, tips, and insights from the world of burgers.
                Discover the passion behind every bite.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Post */}
      <section className="featured-post">
        <Container>
          <Row>
            <Col lg={12} className="mb-4">
              <h2>Featured Story</h2>
            </Col>
          </Row>
          <Row>
            {blogPosts.filter(post => post.featured).slice(0, 1).map(post => (
              <Col lg={12} key={post.id}>
                <Card className="featured-post-card">
                  <Row className="g-0">
                    <Col md={6}>
                      <div className="featured-post-image">
                        <div className="placeholder-image-featured">
                          <span>Featured Article Image</span>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <Card.Body className="featured-post-content">
                        <Badge bg="primary" className="featured-badge mb-3">
                          Featured
                        </Badge>
                        <Card.Title className="featured-post-title">
                          {post.title}
                        </Card.Title>
                        <Card.Text className="featured-post-excerpt">
                          {post.excerpt}
                        </Card.Text>
                        <div className="post-meta">
                          <span className="post-author">
                            <i className="bi bi-person-fill me-2"></i>
                            {post.author}
                          </span>
                          <span className="post-date">
                            <i className="bi bi-calendar-fill me-2"></i>
                            {post.date}
                          </span>
                          <span className="post-read-time">
                            <i className="bi bi-clock-fill me-2"></i>
                            {post.readTime}
                          </span>
                        </div>
                        <button className="btn btn-primary read-more-btn">
                          Read Full Article
                        </button>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Categories Filter */}
      <section className="blog-categories">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="category-filters">
                {categories.map((category, index) => (
                  <button key={index} className="category-filter-btn">
                    {category}
                  </button>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Blog Posts Grid */}
      <section className="blog-posts">
        <Container>
          <Row>
            {blogPosts.map(post => (
              <Col lg={4} md={6} key={post.id} className="mb-4">
                <Card className="blog-post-card h-100">
                  <div className="blog-post-image">
                    <div className="placeholder-image-blog">
                      <span>Article Image</span>
                    </div>
                    <Badge bg="secondary" className="category-badge">
                      {post.category}
                    </Badge>
                  </div>
                  <Card.Body>
                    <Card.Title className="blog-post-title">
                      {post.title}
                    </Card.Title>
                    <Card.Text className="blog-post-excerpt">
                      {post.excerpt}
                    </Card.Text>
                    <div className="post-meta-small">
                      <span className="post-author-small">{post.author}</span>
                      <span className="post-date-small">{post.date}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="read-time-small">
                        <i className="bi bi-clock me-1"></i>
                        {post.readTime}
                      </span>
                      <button className="btn btn-outline-primary btn-sm">
                        Read More
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Newsletter Signup */}
      <section className="blog-newsletter">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2>Stay in the Loop</h2>
              <p>Subscribe to our blog and never miss a delicious story!</p>
              <form className="newsletter-form">
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control newsletter-input"
                    placeholder="Enter your email address"
                  />
                  <button className="btn btn-primary newsletter-submit" type="submit">
                    Subscribe
                  </button>
                </div>
              </form>
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};

export default Blog;

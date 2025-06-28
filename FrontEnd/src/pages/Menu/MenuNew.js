import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import Layout from "../../components/Layouts/Layout";
import { useCart } from "../../context/CartContext";
import { useFilters } from "../../context/FilterContext";
import FilterPanel from "../../components/FilterPanel";
import "../../styles/MenuStyle.css";

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { addToCart } = useCart();
  const { filterProducts } = useFilters();

  // Helper function to safely get rating value
  const getRatingValue = (rating) => {
    if (typeof rating === 'object' && rating !== null) {
      return rating.average || 0;
    }
    return rating || 0;
  };

  const handleAddToCart = (item) => {
    const product = {
      id: item.id.toString(),
      title: item.name,
      price: item.price,
      image: null,
      description: item.description
    };
    addToCart(product);
  };

  // Menu data with placeholders
  const menuCategories = [
    { id: "all", name: "All Items", icon: "bi-grid-fill" },
    { id: "burgers", name: "Burgers", icon: "bi-heart-fill" },
    { id: "sides", name: "Sides", icon: "bi-star-fill" },
    { id: "drinks", name: "Drinks", icon: "bi-cup-fill" },
    { id: "desserts", name: "Desserts", icon: "bi-gift-fill" }
  ];

  const menuItems = [
    // Burgers
    {
      id: 1,
      category: "burgers",
      name: "Classic Beef Burger",
      description: "Juicy beef patty with lettuce, tomato, onion, and our special sauce",
      price: 12.99,
      isPopular: true,
      isNew: false,
      rating: 4.8
    },
    {
      id: 2,
      category: "burgers",
      name: "BBQ Bacon Burger",
      description: "Beef patty with crispy bacon, BBQ sauce, and caramelized onions",
      price: 15.99,
      isPopular: false,
      isNew: true,
      rating: 4.6
    },
    {
      id: 3,
      category: "burgers",
      name: "Chicken Deluxe",
      description: "Grilled chicken breast with avocado, lettuce, and mayo",
      price: 13.99,
      isPopular: true,
      isNew: false,
      rating: 4.7
    },
    {
      id: 4,
      category: "burgers",
      name: "Veggie Supreme",
      description: "Plant-based patty with fresh vegetables and tahini sauce",
      price: 11.99,
      isPopular: false,
      isNew: true,
      rating: 4.3
    },
    // Sides
    {
      id: 5,
      category: "sides",
      name: "Crispy Fries",
      description: "Golden crispy fries seasoned with sea salt",
      price: 4.99,
      isPopular: true,
      isNew: false,
      rating: 4.5
    },
    {
      id: 6,
      category: "sides",
      name: "Sweet Potato Fries",
      description: "Crispy sweet potato fries with honey mustard dip",
      price: 5.99,
      isPopular: false,
      isNew: false,
      rating: 4.4
    },
    {
      id: 7,
      category: "sides",
      name: "Onion Rings",
      description: "Beer-battered onion rings with ranch dressing",
      price: 6.99,
      isPopular: true,
      isNew: false,
      rating: 4.6
    },
    // Drinks
    {
      id: 8,
      category: "drinks",
      name: "Fresh Lemonade",
      description: "House-made lemonade with fresh mint",
      price: 3.99,
      isPopular: true,
      isNew: false,
      rating: 4.2
    },
    {
      id: 9,
      category: "drinks",
      name: "Craft Cola",
      description: "Artisan cola made with natural ingredients",
      price: 4.99,
      isPopular: false,
      isNew: true,
      rating: 4.0
    },
    {
      id: 10,
      category: "drinks",
      name: "Milkshake",
      description: "Creamy vanilla milkshake topped with whipped cream",
      price: 5.99,
      isPopular: true,
      isNew: false,
      rating: 4.9
    },
    // Desserts
    {
      id: 11,
      category: "desserts",
      name: "Chocolate Brownie",
      description: "Warm chocolate brownie with vanilla ice cream",
      price: 6.99,
      isPopular: true,
      isNew: false,
      rating: 4.8
    },
    {
      id: 12,
      category: "desserts",
      name: "Apple Pie",
      description: "Classic apple pie with cinnamon and caramel sauce",
      price: 5.99,
      isPopular: false,
      isNew: false,
      rating: 4.1
    }
  ];

  // Use filter system instead of simple category filter
  const filteredItems = filterProducts(menuItems);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="menu-hero">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h1 className="menu-title">Our Delicious Menu</h1>
              <p className="menu-subtitle">
                Discover our mouth-watering selection of burgers, sides, drinks, and desserts
                made fresh daily with the finest ingredients.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Menu Categories & Filters */}
      <section className="menu-categories">
        <Container>
          <Row>
            <Col lg={3}>
              <FilterPanel products={menuItems} productType="food" />
            </Col>
            <Col lg={9}>
              <div className="menu-header-controls mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h3>Menu Items ({filteredItems.length})</h3>
                  <div className="category-filters-quick d-none d-md-flex">
                    {menuCategories.map(category => (
                      <Button
                        key={category.id}
                        variant={activeCategory === category.id ? "primary" : "outline-primary"}
                        className="category-btn-quick me-2"
                        onClick={() => setActiveCategory(category.id)}
                        size="sm"
                      >
                        <i className={`bi ${category.icon} me-1`}></i>
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Menu Items Grid */}
              <Row>
                {filteredItems.map(item => (
                  <Col lg={6} xl={4} key={item.id} className="mb-4">
                    <Card className="menu-item-card h-100">
                      <div className="menu-item-image">
                        <div className="placeholder-image-menu">
                          <span>{item.name}</span>
                        </div>
                        {item.isNew && (
                          <Badge bg="success" className="item-badge new-badge">
                            New
                          </Badge>
                        )}
                        {item.isPopular && (
                          <Badge bg="warning" className="item-badge popular-badge">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <Card.Body>
                        <div className="menu-item-rating mb-2">
                          {Array.from({ length: 5 }, (_, i) => (
                            <i 
                              key={i} 
                              className={`bi ${i < Math.floor(getRatingValue(item.rating)) ? 'bi-star-fill' : 'bi-star'} text-warning`}
                            ></i>
                          ))}
                          <span className="rating-text ms-2">({getRatingValue(item.rating)})</span>
                        </div>
                        <Card.Title className="menu-item-name">{item.name}</Card.Title>
                        <Card.Text className="menu-item-description">
                          {item.description}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="menu-item-price">${item.price}</span>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleAddToCart(item)}
                            className="add-to-cart-btn"
                          >
                            <i className="bi bi-cart-plus me-1"></i>
                            Add to Cart
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              
              {filteredItems.length === 0 && (
                <div className="text-center py-5">
                  <i className="bi bi-search" style={{fontSize: '4rem', color: '#ccc'}}></i>
                  <h4 className="mt-3">No items found</h4>
                  <p className="text-muted">Try adjusting your filters or search terms</p>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Special Offers */}
      <section className="special-offers">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2>Today's Special Offers</h2>
              <p>Don't miss out on these amazing deals!</p>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-4">
              <div className="offer-card offer-card-1">
                <div className="offer-content">
                  <div className="offer-text">
                    <h3>Buy 2 Burgers</h3>
                    <h4>Get 1 FREE!</h4>
                    <p>Valid on all classic burgers</p>
                    <Button variant="light" size="lg">
                      Order Now
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="offer-card offer-card-2">
                <div className="offer-content">
                  <div className="offer-text">
                    <h3>Family Combo</h3>
                    <h4>Save 25%</h4>
                    <p>4 Burgers + 4 Sides + 4 Drinks</p>
                    <Button variant="light" size="lg">
                      Order Now
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};

export default Menu;

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../components/Layouts/Layout";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useButtonLoading } from "../../hooks/useLoading";
import { productService } from "../../services/productService";
import { menuProducts } from "../../data/products"; // Fallback data
import MenuSkeleton from "../../components/MenuSkeleton";
import "../../styles/MenuStyle.css";
import "../../styles/LoadingSpinner.css";

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [useBackend, setUseBackend] = useState(false);
  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();
  const { isButtonLoading, withButtonLoading } = useButtonLoading();

  // Helper function to safely get rating value
  const getRatingValue = (rating) => {
    if (typeof rating === 'object' && rating !== null) {
      return rating.average || 0;
    }
    return rating || 0;
  };

  // Load products from backend or use fallback data
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        // Try to load from backend first
        const response = await productService.getProducts({ 
          category: activeCategory === "all" ? undefined : activeCategory 
        });
        const products = response.data || response.products || response;
        setProducts(products);
        setUseBackend(true);
      } catch (error) {
        console.warn('Backend not available, using local data:', error);
        // Use local data as fallback
        const filteredProducts = activeCategory === "all" 
          ? menuProducts 
          : menuProducts.filter(item => item.category === activeCategory);
        setProducts(filteredProducts);
        setUseBackend(false);
      } finally {
        // Add delay for better UX
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    loadProducts();
  }, [activeCategory]);

  const handleAddToCart = async (item) => {
    try {
      const itemId = item._id || item.id;
      await withButtonLoading(`add-to-cart-${itemId}`, async () => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Obtener la imagen correcta
        let imageUrl = null;
        if (item.image) {
          imageUrl = `http://localhost:5000${item.image}`;
        } else if (item.images && item.images.length > 0) {
          imageUrl = `http://localhost:5000${item.images[0].url}`;
        }
        
        const product = {
          id: itemId.toString(),
          title: item.name,
          price: item.price,
          image: imageUrl,
          description: item.description
        };
        
        addToCart(product);
        showSuccess(`${item.name} agregado al carrito exitosamente!`);
      });
    } catch (error) {
      showError('Error al agregar el producto al carrito');
    }
  };

  // Menu data with placeholders
  const menuCategories = [
    { id: "all", name: "All Items", icon: "bi-grid-fill" },
    { id: "burgers", name: "Burgers", icon: "bi-heart-fill" },
    { id: "sides", name: "Sides", icon: "bi-star-fill" },
    { id: "drinks", name: "Drinks", icon: "bi-cup-fill" },
    { id: "desserts", name: "Desserts", icon: "bi-gift-fill" }
  ];

  // Filter products by category - ensure it's always an array
  const filteredItems = useBackend ? 
    (Array.isArray(products) ? products : []) : 
    (activeCategory === "all" 
      ? menuProducts 
      : menuProducts.filter(item => item.category === activeCategory)
    );

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

      {/* Menu Categories */}
      <section className="menu-categories">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="menu-header-controls mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <h3>Menu Items ({filteredItems.length})</h3>
                  <div className="category-filters-quick d-flex flex-wrap">
                    {menuCategories.map(category => (
                      <Button
                        key={category.id}
                        variant={activeCategory === category.id ? "primary" : "outline-primary"}
                        className="category-btn-quick me-2 mb-2"
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
                {isLoading ? (
                  <MenuSkeleton count={6} />
                ) : (
                  filteredItems.map(item => {
                    return (
                    <Col lg={6} xl={4} key={item._id || item.id} className="mb-4">
                      <Card className="menu-item-card h-100 fade-in">
                        <div className="menu-item-image">
                          {/* Manejar tanto item.image (legacy) como item.images[0].url (nuevo formato) */}
                          {(item.image || (item.images && item.images.length > 0)) ? (
                            <img 
                              src={item.image ? `http://localhost:5000${item.image}` : `http://localhost:5000${item.images[0].url}`} 
                              alt={item.images && item.images[0] ? item.images[0].alt : item.name}
                              className="menu-item-img"
                              onError={(e) => {
                                // Si la imagen falla, mostrar placeholder
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="placeholder-image-menu" style={{ display: (item.image || (item.images && item.images.length > 0)) ? 'none' : 'flex' }}>
                            <span>{item.name}</span>
                          </div>
                          {item.isNew && (
                            <Badge bg="warning" className="item-badge new-badge">
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
                          <Card.Title className="menu-item-name">
                            <Link to={`/product/${item._id || item.id}`} className="product-title-link">
                              {item.name}
                            </Link>
                          </Card.Title>
                          <Card.Text className="menu-item-description">
                            {item.description}
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="menu-item-price">${item.price}</span>
                            <Link to={`/product/${item._id || item.id}`} className="btn btn-outline-secondary btn-sm">
                              <i className="bi bi-eye me-1"></i>
                              View Details
                            </Link>
                          </div>
                          <div className="d-grid">
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => handleAddToCart(item)}
                              className={`add-to-cart-btn ${isButtonLoading(`add-to-cart-${item._id || item.id}`) ? 'btn-loading' : ''}`}
                              disabled={isButtonLoading(`add-to-cart-${item._id || item.id}`)}
                            >
                              <span className="btn-text">
                                <i className="bi bi-cart-plus me-1"></i>
                                Add to Cart
                              </span>
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    );
                  })
                )}
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

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../components/Layouts/Layout";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useButtonLoading } from "../../hooks/useLoading";
import { productService } from "../../services/productService";
import { shopProducts } from "../../data/products"; // Fallback data
import MenuSkeleton from "../../components/MenuSkeleton";
import "../../styles/ShopStyle.css";
import "../../styles/LoadingSpinner.css";

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [useBackend, setUseBackend] = useState(false);
  const { addToCart, getCartItemsCount } = useCart();
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
        // Try to load from backend first - only get pet products
        const response = await productService.getProducts();
        const allProducts = response.data || response.products || response;
        
        // Filter to only show pet products (treats, toys)
        const petProducts = allProducts.filter(product => 
          product.category === 'treats' || product.category === 'toys'
        );
        
        // Then filter by active category if needed
        const filteredProducts = activeCategory === "all" 
          ? petProducts 
          : petProducts.filter(product => product.category === activeCategory);
          
        setProducts(filteredProducts);
        setUseBackend(true);
      } catch (error) {
        console.warn('Backend not available, using local data:', error);
        // Use local data as fallback - only show pet products
        const petProducts = shopProducts.filter(item => 
          item.category === 'treats' || item.category === 'toys'
        );
        const filteredProducts = activeCategory === "all" 
          ? petProducts 
          : petProducts.filter(item => item.category === activeCategory);
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

  const handleAddToCart = async (product) => {
    try {
      const productId = product._id || product.id;
      await withButtonLoading(`add-to-cart-${productId}`, async () => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const cartProduct = {
          id: productId.toString(),
          title: product.name,
          price: product.price,
          image: null,
          description: product.description
        };
        
        addToCart(cartProduct);
        showSuccess(`${product.name} agregado al carrito exitosamente!`);
      });
    } catch (error) {
      showError('Error al agregar el producto al carrito');
    }
  };

  // Shop categories for pets
  const shopCategories = [
    { id: "all", name: "All Products", icon: "bi-grid-fill" },
    { id: "treats", name: "Pet Treats", icon: "bi-award-fill" },
    { id: "toys", name: "Pet Toys", icon: "bi-heart-fill" }
  ];

  // Filter products by category - ensure it's always an array
  const filteredProducts = useBackend ? 
    (Array.isArray(products) ? products : []) : 
    (activeCategory === "all" 
      ? shopProducts 
      : shopProducts.filter(product => product.category === activeCategory)
    );

  // Remove this old function since we're using context now
  // const addToCart = (product) => {
  //   setCartItems([...cartItems, product]);
  // };

  const renderStars = (rating) => {
    const stars = [];
    const ratingValue = getRatingValue(rating);
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }

    const emptyStars = 5 - Math.ceil(ratingValue);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }

    return stars;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="shop-hero">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h1 className="shop-title">Pet Treats Shop</h1>
              <p className="shop-subtitle">
                Spoil your furry friends! Browse our collection of healthy treats, 
                supplements, and toys for dogs and cats.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Search and Cart Summary */}
      <section className="shop-controls">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="cart-summary">
                <i className="bi bi-bag-fill me-2"></i>
                <span>{getCartItemsCount()} items in cart</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Categories */}
      <section className="featured-categories">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2>Shop by Category</h2>
              <p>Find the perfect treats for your beloved pets</p>
            </Col>
          </Row>
          <Row>
            <Col md={6} lg={3} className="mb-4">
              <div className="category-card category-sauces">
                <div className="category-content">
                  <i className="bi bi-award-fill"></i>
                  <h4>Treats</h4>
                  <p>Tasty rewards</p>
                </div>
              </div>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <div className="category-card category-apparel">
                <div className="category-content">
                  <i className="bi bi-heart-fill"></i>
                  <h4>Cat Products</h4>
                  <p>Feline favorites</p>
                </div>
              </div>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <div className="category-card category-tools">
                <div className="category-content">
                  <i className="bi bi-scissors"></i>
                  <h4>Dental Care</h4>
                  <p>Healthy teeth</p>
                </div>
              </div>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <div className="category-card category-gifts">
                <div className="category-content">
                  <i className="bi bi-gift-fill"></i>
                  <h4>Supplements</h4>
                  <p>Health boosters</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Products Grid */}
      <section className="products-grid">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="shop-header-controls mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <h2>All Products ({filteredProducts.length})</h2>
                  <div className="category-filters-quick d-flex flex-wrap">
                    {shopCategories.map(category => (
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
              <Row>
                {isLoading ? (
                  <MenuSkeleton count={6} />
                ) : (
                  filteredProducts.map(product => (
                    <Col lg={4} md={6} key={product._id || product.id} className="mb-4">
                      <Card className="product-card h-100 fade-in">
                        <div className="product-image">
                          <div className="placeholder-image-product">
                            <span>{product.name}</span>
                          </div>
                          {product.badge && (
                            <Badge 
                              bg={product.badge === 'bestseller' ? 'warning' : 
                                  product.badge === 'new' ? 'success' : 'primary'} 
                              className="product-badge"
                            >
                              {product.badge}
                            </Badge>
                          )}
                          {!product.inStock && (
                            <div className="out-of-stock-overlay">
                              <span>Out of Stock</span>
                            </div>
                          )}
                        </div>
                        <Card.Body>
                          <div className="product-rating mb-2">
                            {renderStars(product.rating)}
                            <span className="rating-text ms-2">({getRatingValue(product.rating)})</span>
                          </div>
                          <Card.Title className="product-name">
                            <Link to={`/product/${product._id || product.id}`} className="product-title-link">
                              {product.name}
                            </Link>
                          </Card.Title>
                          <Card.Text className="product-description">
                            {product.description}
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="product-price">${product.price}</span>
                            <Link to={`/product/${product._id || product.id}`} className="btn btn-outline-secondary btn-sm">
                              <i className="bi bi-eye me-1"></i>
                              View Details
                            </Link>
                          </div>
                          <div className="d-grid">
                            <Button 
                              variant="primary" 
                              size="sm"
                              disabled={!product.inStock || isButtonLoading(`add-to-cart-${product._id || product.id}`)}
                              onClick={() => handleAddToCart(product)}
                              className={`add-to-cart-btn ${isButtonLoading(`add-to-cart-${product._id || product.id}`) ? 'btn-loading' : ''}`}
                            >
                              <span className="btn-text">
                                <i className="bi bi-cart-plus me-1"></i>
                                {product.inStock ? 'Add to Cart' : 'Sold Out'}
                              </span>
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                )}
              </Row>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-5">
                  <i className="bi bi-search" style={{fontSize: '4rem', color: '#ccc'}}></i>
                  <h4 className="mt-3">No products found</h4>
                  <p className="text-muted">Try selecting a different category</p>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Newsletter Signup */}
      <section className="newsletter-signup">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2>Stay Updated</h2>
              <p>Get notified about new products and exclusive offers!</p>
              <Form className="newsletter-form">
                <Row>
                  <Col md={8}>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email address"
                      className="newsletter-input"
                    />
                  </Col>
                  <Col md={4}>
                    <Button variant="primary" className="newsletter-btn">
                      Subscribe
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};

export default Shop;

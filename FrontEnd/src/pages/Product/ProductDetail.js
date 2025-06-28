import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Tabs, Tab, Alert } from "react-bootstrap";
import Layout from "../../components/Layouts/Layout";
import { useCart } from "../../context/CartContext";
import { productService } from "../../services/productService";
import { allProducts } from "../../data/products";
import "../../styles/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [selectedSize, setSelectedSize] = useState("medium");
  const [selectedExtras, setSelectedExtras] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        // Try to fetch from backend first
        const response = await productService.getProductById(id);
        
        // Handle different response structures
        let foundProduct = null;
        if (response.data && response.data.product) {
          foundProduct = response.data.product;
        } else if (response.data) {
          foundProduct = response.data;
        } else {
          foundProduct = response;
        }
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Set default size if product has sizes
          if (foundProduct.sizes && foundProduct.sizes.length > 0) {
            setSelectedSize(foundProduct.sizes[0].name);
            setSelectedOptions({
              size: foundProduct.sizes[0]
            });
          }
        } else {
          throw new Error('Product not found in backend');
        }
      } catch (error) {
        // Fallback to local data
        const foundProduct = allProducts.find(p => 
          (p.id && p.id.toString() === id) || 
          (p._id && p._id.toString() === id) ||
          p.id === parseInt(id)
        );
        
        if (foundProduct) {
          setProduct(foundProduct);
          // Set default size if product has sizes
          if (foundProduct.sizes && foundProduct.sizes.length > 0) {
            setSelectedSize(foundProduct.sizes[0].name);
            setSelectedOptions({
              size: foundProduct.sizes[0]
            });
          }
        } else {
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleSizeChange = (size) => {
    setSelectedSize(size.name);
    setSelectedOptions({
      ...selectedOptions,
      size: size
    });
  };

  const handleExtraChange = (extra, isChecked) => {
    if (isChecked) {
      setSelectedExtras([...selectedExtras, extra]);
    } else {
      setSelectedExtras(selectedExtras.filter(e => e.name !== extra.name));
    }
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    
    let total = product.price;
    
    // Add size price
    if (selectedOptions.size) {
      total += selectedOptions.size.price;
    }
    
    // Add extras price
    selectedExtras.forEach(extra => {
      total += extra.price;
    });
    
    return total * quantity;
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartProduct = {
      id: `${product.id}-${Date.now()}`,
      title: product.name,
      price: calculateTotalPrice(),
      image: null,
      description: product.description,
      quantity: quantity,
      customizations: {
        size: selectedOptions.size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : null),
        extras: selectedExtras,
        specialInstructions: selectedOptions.specialInstructions || ""
      }
    };

    addToCart(cartProduct);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  // Helper function to safely get rating value
  const getRatingValue = (rating) => {
    if (typeof rating === 'object' && rating !== null) {
      return rating.average || 0;
    }
    return rating || 0;
  };

  const renderStars = (rating) => {
    const ratingValue = getRatingValue(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i} 
        className={`bi ${i < Math.floor(ratingValue) ? 'bi-star-fill' : 'bi-star'} text-warning`}
      ></i>
    ));
  };

  if (loading) {
    return (
      <Layout>
        <Container className="py-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading product details...</p>
          </div>
        </Container>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <Container className="py-5">
          <Alert variant="warning" className="text-center">
            <h4>Product not found</h4>
            <p>The product you're looking for doesn't exist or couldn't be loaded.</p>
            <Link to="/menu" className="btn btn-primary">
              Back to Menu
            </Link>
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      {showSuccessAlert && (
        <Alert variant="success" className="alert-fixed">
          <i className="bi bi-check-circle me-2"></i>
          Product added to cart successfully!
        </Alert>
      )}

      <Container className="py-4">
        {/* Breadcrumb */}
        <Row className="mb-4">
          <Col>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/menu">Menu</Link>
                </li>
                <li className="breadcrumb-item active">{product.name}</li>
              </ol>
            </nav>
          </Col>
        </Row>

        <Row>
          {/* Product Images */}
          <Col lg={6}>
            <div className="product-gallery">
              <div className="main-image">
                {product.image ? (
                  <img 
                    src={`http://localhost:5000${product.image}`} 
                    alt={product.name}
                    className="product-main-img"
                    onError={(e) => {
                      // Si la imagen falla, mostrar placeholder
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="placeholder-image-large" style={{ display: product.image ? 'none' : 'flex' }}>
                  <span>{product.name}</span>
                  {product.isNew && (
                    <Badge bg="warning" className="product-badge-large">
                      New
                    </Badge>
                  )}
                  {product.isPopular && (
                    <Badge bg="warning" className="product-badge-large">
                      Popular
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="image-thumbnails mt-3">
                <Row>
                  {(product.images || []).map((image, index) => (
                    <Col xs={4} key={index}>
                      <div 
                        className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                        onClick={() => setActiveImage(index)}
                      >
                        <div className="placeholder-thumbnail">
                          <span>{index + 1}</span>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </Col>

          {/* Product Details */}
          <Col lg={6}>
            <div className="product-details">
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-rating mb-3">
                {renderStars(product.rating || 0)}
                <span className="rating-text ms-2">
                  {getRatingValue(product.rating)} ({product.reviews || 0} reviews)
                </span>
              </div>

              <div className="product-meta mb-3">
                {product.prepTime && (
                  <span className="prep-time">
                    <i className="bi bi-clock me-1"></i>
                    {product.prepTime}
                  </span>
                )}
                {product.calories && (
                  <span className={`calories ${product.prepTime ? 'ms-3' : ''}`}>
                    <i className="bi bi-lightning me-1"></i>
                    {product.calories} cal
                  </span>
                )}
              </div>

              <p className="product-description-full">
                {product.fullDescription || product.description || "No description available."}
              </p>

              <div className="price-section mb-4">
                <span className="current-price">${calculateTotalPrice().toFixed(2)}</span>
                {quantity > 1 && (
                  <span className="price-note">
                    (${(calculateTotalPrice() / quantity).toFixed(2)} each)
                  </span>
                )}
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="size-selection mb-4">
                  <h5>Choose Size</h5>
                  {product.sizes.map((size) => (
                    <Form.Check
                      key={size.name}
                      type="radio"
                      name="size"
                      id={`size-${size.name}`}
                      label={
                        <div className="size-option">
                          <span className="size-name">{size.name}</span>
                          <span className="size-description">{size.description}</span>
                          {size.price > 0 && (
                            <span className="size-price">+${size.price.toFixed(2)}</span>
                          )}
                        </div>
                      }
                      checked={selectedSize === size.name}
                      onChange={() => handleSizeChange(size)}
                      className="size-radio"
                    />
                  ))}
                </div>
              )}

              {/* Extras */}
              {product.extras && product.extras.length > 0 && (
                <div className="extras-selection mb-4">
                  <h5>Add Extras</h5>
                  {product.extras.map((extra) => (
                    <Form.Check
                      key={extra.name}
                      type="checkbox"
                      id={`extra-${extra.name}`}
                      label={
                        <div className="extra-option">
                          <span className="extra-name">{extra.name}</span>
                          <span className="extra-price">+${extra.price.toFixed(2)}</span>
                        </div>
                      }
                      onChange={(e) => handleExtraChange(extra, e.target.checked)}
                      className="extra-checkbox"
                    />
                  ))}
                </div>
              )}

              {/* Quantity */}
              <div className="quantity-selection mb-4">
                <h5>Quantity</h5>
                <div className="quantity-controls">
                  <Button 
                    variant="outline-secondary"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="quantity-display">{quantity}</span>
                  <Button 
                    variant="outline-secondary"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="special-instructions mb-4">
                <h5>Special Instructions</h5>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Any special requests? (e.g., no onions, extra sauce)"
                  onChange={(e) => setSelectedOptions({
                    ...selectedOptions,
                    specialInstructions: e.target.value
                  })}
                />
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="add-to-cart-btn-large me-3"
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  Add to Cart - ${calculateTotalPrice().toFixed(2)}
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="lg"
                  onClick={() => setShowCustomModal(true)}
                >
                  <i className="bi bi-gear me-2"></i>
                  Customize
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Product Information Tabs */}
        <Row className="mt-5">
          <Col>
            <Tabs defaultActiveKey="ingredients" className="product-tabs">
              <Tab eventKey="ingredients" title="Ingredients">
                <div className="tab-content-padding">
                  <h5>Ingredients</h5>
                  <div className="ingredients-list">
                    {(product.ingredients || []).map((ingredient, index) => (
                      <Badge key={index} bg="light" text="dark" className="ingredient-badge">
                        {ingredient}
                      </Badge>
                    ))}
                    {(!product.ingredients || product.ingredients.length === 0) && (
                      <p className="text-muted">No ingredients information available.</p>
                    )}
                  </div>
                  
                  {/* Benefits section for pet products */}
                  {product.benefits && product.benefits.length > 0 && (
                    <>
                      <h5 className="mt-4">Benefits</h5>
                      <div className="benefits-list">
                        {product.benefits.map((benefit, index) => (
                          <Badge key={index} bg="warning" className="benefit-badge me-2 mb-2">
                            <i className="bi bi-check-circle me-1"></i>
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {/* Pet sizes for pet products */}
                  {product.petSizes && product.petSizes.length > 0 && (
                    <>
                      <h5 className="mt-4">Suitable for</h5>
                      <div className="pet-sizes-list">
                        {product.petSizes.map((size, index) => (
                          <Badge key={index} bg="warning" className="pet-size-badge me-2 mb-2">
                            {size} pets
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {/* Allergens section */}
                  {product.allergens && product.allergens.length > 0 && (
                    <>
                      <h5 className="mt-4">Allergens</h5>
                      <div className="allergens-list">
                        {product.allergens.map((allergen, index) => (
                          <Badge key={index} bg="warning" className="allergen-badge">
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </Tab>
              
              <Tab eventKey="nutrition" title="Nutrition">
                <div className="tab-content-padding">
                  <h5>Nutritional Information</h5>
                  <div className="nutrition-grid">
                    {product.nutritionalInfo ? 
                      Object.entries(product.nutritionalInfo).map(([key, value]) => (
                        <div key={key} className="nutrition-item">
                          <span className="nutrition-label">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                          <span className="nutrition-value">{value}</span>
                        </div>
                      )) : (
                        <p className="text-muted">No nutritional information available.</p>
                      )
                    }
                  </div>
                </div>
              </Tab>
              
              <Tab eventKey="reviews" title={`Reviews (${product.reviews || 0})`}>
                <div className="tab-content-padding">
                  <h5>Customer Reviews</h5>
                  <div className="reviews-summary">
                    <div className="rating-overview">
                      <span className="rating-large">{getRatingValue(product.rating)}</span>
                      <div className="rating-stars-large">
                        {renderStars(product.rating || 0)}
                      </div>
                      <span className="reviews-count">Based on {product.reviews || 0} reviews</span>
                    </div>
                  </div>
                  
                  {/* Mock Reviews */}
                  <div className="reviews-list mt-4">
                    <div className="review-item">
                      <div className="review-header">
                        <strong>John D.</strong>
                        <span className="review-rating">
                          {renderStars(5)}
                        </span>
                      </div>
                      <p className="review-text">
                        "Amazing burger! The beef patty was cooked perfectly and the special sauce is incredible. Will definitely order again!"
                      </p>
                      <small className="review-date">2 days ago</small>
                    </div>
                    
                    <div className="review-item">
                      <div className="review-header">
                        <strong>Sarah M.</strong>
                        <span className="review-rating">
                          {renderStars(4)}
                        </span>
                      </div>
                      <p className="review-text">
                        "Great taste and quality ingredients. The only thing is I wish it came with more fries!"
                      </p>
                      <small className="review-date">1 week ago</small>
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>

        {/* Related Products */}
        <Row className="mt-5">
          <Col>
            <h3 className="mb-4">You Might Also Like</h3>
            <Row>
              {allProducts
                .filter(p => p.category === product.category && p.id !== product.id)
                .slice(0, 3)
                .map(relatedProduct => (
                  <Col md={4} key={relatedProduct.id}>
                    <Card className="related-product-card h-100">
                      <div className="related-product-image">
                        <div className="placeholder-image-related">
                          <span>{relatedProduct.name}</span>
                        </div>
                      </div>
                      <Card.Body>
                        <Card.Title className="related-product-name">
                          {relatedProduct.name}
                        </Card.Title>
                        <div className="related-product-rating mb-2">
                          {renderStars(relatedProduct.rating)}
                          <span className="ms-2">({getRatingValue(relatedProduct.rating)})</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="related-product-price">
                            ${relatedProduct.price}
                          </span>
                          <Link 
                            to={`/product/${relatedProduct.id}`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Customization Modal */}
      <Modal 
        show={showCustomModal} 
        onHide={() => setShowCustomModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Customize Your {product.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Advanced customization options coming soon!</p>
          <p>For now, use the options available on the product page.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCustomModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default ProductDetail;

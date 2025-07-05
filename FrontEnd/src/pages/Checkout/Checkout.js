import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Layout from "../../components/Layouts/Layout";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/CheckoutStyle.css";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Customer Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Delivery Address
    address: "",
    city: "",
    state: "",
    zipCode: "",
    
    // Payment Information
    paymentMethod: "credit",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    
    // Order Options
    deliveryType: "delivery",
    deliveryTime: "asap",
    specialInstructions: ""
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Calculate totals
  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = formData.deliveryType === "delivery" ? 5.99 : 0;
  const total = subtotal + tax + deliveryFee;

  // Step navigation functions
  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepNumber) => {
    // Allow going to previous steps or if current step is valid
    if (stepNumber <= currentStep || validateCurrentStep()) {
      setCurrentStep(stepNumber);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    }
    // Format expiry date
    else if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    }
    // Format phone number
    else if (name === 'phone') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      // Customer Information validation
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      // Delivery address validation (only if delivery selected)
      if (formData.deliveryType === "delivery") {
        if (!formData.address.trim()) newErrors.address = "Address is required for delivery";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
      }
    } else if (currentStep === 2) {
      // Payment validation
      if (formData.paymentMethod === "credit") {
        if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
        if (!formData.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required";
        if (!formData.cvv.trim()) newErrors.cvv = "CVV is required";
        if (!formData.cardName.trim()) newErrors.cardName = "Cardholder name is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      if (validateCurrentStep()) {
        nextStep();
      }
      return;
    } else if (currentStep === 2) {
      if (validateCurrentStep()) {
        setCurrentStep(3); // Go to confirmation step
      }
      return;
    } else if (currentStep === 3) {
      // Process the order
      processOrder();
    }
  };

  const processOrder = async () => {
    setIsProcessing(true);

    try {
      // Import orderService if not already imported
      const { orderService } = await import('../../services/apiService');
      
      // Prepare order data for backend
      const orderData = {
        items: cartItems.map(item => ({
          product: item.id, // Assuming this is the product ID
          quantity: item.quantity,
          price: item.price
        })),
        deliveryInfo: {
          type: formData.deliveryType,
          address: formData.deliveryType === 'delivery' ? {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          } : null,
          instructions: formData.specialInstructions
        },
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        payment: {
          method: formData.paymentMethod === 'credit' ? 'card' : formData.paymentMethod,
          amount: total
        }
      };

      // Call backend API to create order
      const response = await orderService.createOrder(orderData);
      
      if (response.success) {
        // Success
        setOrderSuccess(true);
        clearCart();
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Auto redirect after showing success
        setTimeout(() => {
          if (currentUser) {
            navigate("/orders"); // Redirect to orders page
          } else {
            navigate("/");
          }
        }, 4000);
      } else {
        throw new Error(response.message || 'Order creation failed');
      }
      
    } catch (error) {
      console.error("Order processing failed:", error);
      setErrors({ submit: error.message || "Order processing failed. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <Layout>
        <section className="checkout-section">
          <Container>
            <Row>
              <Col lg={12} className="text-center">
                <div className="empty-cart-checkout">
                  <i className="bi bi-cart-x"></i>
                  <h2>Your cart is empty</h2>
                  <p>Add some delicious items to proceed to checkout</p>
                  <Button href="/menu" className="btn btn_red">
                    Browse Menu
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </Layout>
    );
  }

  if (orderSuccess) {
    return (
      <Layout>
        <section className="checkout-section">
          <Container>
            <Row>
              <Col lg={12} className="text-center">
                <div className="order-success">
                  <div className="success-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <h2>Order Placed Successfully!</h2>
                  <p>Thank you for your order. You will receive a confirmation email shortly.</p>
                  <div className="order-details">
                    <p><strong>Order Total:</strong> ${total.toFixed(2)}</p>
                    <p><strong>Estimated Delivery:</strong> 25-30 minutes</p>
                  </div>
                  <p className="redirect-notice">Redirecting to home page...</p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="checkout-section">
        <Container>
          <Row>
            <Col lg={12} className="mb-4">
              <div className="checkout-header">
                <h1>Checkout</h1>
                <div className="checkout-steps">
                  <div className={`step ${currentStep === 1 ? 'active' : ''}`} onClick={() => goToStep(1)}>
                    <span className="step-number">1</span>
                    <span className="step-label">Information</span>
                  </div>
                  <div className={`step ${currentStep === 2 ? 'active' : ''}`} onClick={() => goToStep(2)}>
                    <span className="step-number">2</span>
                    <span className="step-label">Payment</span>
                  </div>
                  <div className={`step ${currentStep === 3 || isProcessing ? 'active' : ''}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Confirmation</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={8}>
                {/* Step 1: Customer Information & Delivery */}
                {currentStep === 1 && (
                  <>
                    {/* Customer Information */}
                    <Card className="checkout-card mb-4">
                      <Card.Header>
                        <h4><i className="bi bi-person-fill me-2"></i>Customer Information</h4>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>First Name *</Form.Label>
                              <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                isInvalid={!!errors.firstName}
                                placeholder="Enter your first name"
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.firstName}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Last Name *</Form.Label>
                              <Form.Control
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                isInvalid={!!errors.lastName}
                                placeholder="Enter your last name"
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.lastName}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Email Address *</Form.Label>
                              <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                isInvalid={!!errors.email}
                                placeholder="your.email@example.com"
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.email}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Phone Number *</Form.Label>
                              <Form.Control
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                isInvalid={!!errors.phone}
                                placeholder="(555) 123-4567"
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.phone}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>

                    {/* Delivery Options */}
                    <Card className="checkout-card mb-4">
                      <Card.Header>
                        <h4><i className="bi bi-truck me-2"></i>Delivery Options</h4>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Delivery Type</Form.Label>
                              <Form.Select
                                name="deliveryType"
                                value={formData.deliveryType}
                                onChange={handleInputChange}
                              >
                                <option value="delivery">Delivery (+$5.99)</option>
                                <option value="pickup">Pickup (Free)</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Delivery Time</Form.Label>
                              <Form.Select
                                name="deliveryTime"
                                value={formData.deliveryTime}
                                onChange={handleInputChange}
                              >
                                <option value="asap">As soon as possible</option>
                                <option value="30min">In 30 minutes</option>
                                <option value="1hour">In 1 hour</option>
                                <option value="2hours">In 2 hours</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        {formData.deliveryType === "delivery" && (
                          <>
                            <h6 className="mb-3">Delivery Address</h6>
                            <Row>
                              <Col md={12}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Street Address *</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.address}
                                    placeholder="123 Main Street, Apt 4B"
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.address}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={4}>
                                <Form.Group className="mb-3">
                                  <Form.Label>City *</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.city}
                                    placeholder="New York"
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.city}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group className="mb-3">
                                  <Form.Label>State</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    placeholder="NY"
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group className="mb-3">
                                  <Form.Label>ZIP Code *</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.zipCode}
                                    placeholder="10001"
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.zipCode}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                            </Row>
                          </>
                        )}
                      </Card.Body>
                    </Card>

                    {/* Step Navigation for Step 1 */}
                    <div className="step-navigation mb-4">
                      <Button
                        type="button"
                        className="btn btn_red"
                        onClick={nextStep}
                        size="lg"
                      >
                        Continue to Payment
                        <i className="bi bi-arrow-right ms-2"></i>
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <>
                    {/* Payment Information */}
                    <Card className="checkout-card mb-4">
                      <Card.Header>
                        <h4><i className="bi bi-credit-card me-2"></i>Payment Information</h4>
                      </Card.Header>
                      <Card.Body>
                        <div className="payment-methods mb-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="paymentMethod"
                              value="credit"
                              checked={formData.paymentMethod === "credit"}
                              onChange={handleInputChange}
                            />
                            <label className="form-check-label">
                              <i className="bi bi-credit-card me-2"></i>
                              Credit/Debit Card
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="paymentMethod"
                              value="cash"
                              checked={formData.paymentMethod === "cash"}
                              onChange={handleInputChange}
                            />
                            <label className="form-check-label">
                              <i className="bi bi-cash me-2"></i>
                              Cash on {formData.deliveryType === "delivery" ? "Delivery" : "Pickup"}
                            </label>
                          </div>
                        </div>

                        {formData.paymentMethod === "credit" && (
                          <Row>
                            <Col md={12}>
                              <Form.Group className="mb-3">
                                <Form.Label>Cardholder Name *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="cardName"
                                  value={formData.cardName}
                                  onChange={handleInputChange}
                                  isInvalid={!!errors.cardName}
                                  placeholder="John Doe"
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.cardName}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={12}>
                              <Form.Group className="mb-3">
                                <Form.Label>Card Number *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="cardNumber"
                                  value={formData.cardNumber}
                                  onChange={handleInputChange}
                                  isInvalid={!!errors.cardNumber}
                                  placeholder="1234 5678 9012 3456"
                                  maxLength="19"
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.cardNumber}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Expiry Date *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="expiryDate"
                                  value={formData.expiryDate}
                                  onChange={handleInputChange}
                                  isInvalid={!!errors.expiryDate}
                                  placeholder="MM/YY"
                                  maxLength="5"
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.expiryDate}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>CVV *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="cvv"
                                  value={formData.cvv}
                                  onChange={handleInputChange}
                                  isInvalid={!!errors.cvv}
                                  placeholder="123"
                                  maxLength="4"
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.cvv}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>
                        )}
                      </Card.Body>
                    </Card>

                    {/* Special Instructions */}
                    <Card className="checkout-card mb-4">
                      <Card.Header>
                        <h4><i className="bi bi-chat-dots me-2"></i>Special Instructions</h4>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="specialInstructions"
                            value={formData.specialInstructions}
                            onChange={handleInputChange}
                            placeholder="Any special requests for your order..."
                          />
                        </Form.Group>
                      </Card.Body>
                    </Card>

                    {/* Step Navigation for Step 2 */}
                    <div className="step-navigation mb-4">
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={prevStep}
                        size="lg"
                        className="me-3"
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Information
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 3 && (
                  <Card className="checkout-card mb-4">
                    <Card.Header>
                      <h4><i className="bi bi-check-circle me-2"></i>Order Confirmation</h4>
                    </Card.Header>
                    <Card.Body className="text-center">
                      <div className="confirmation-content">
                        <div className="confirmation-icon mb-4">
                          <i className="bi bi-check-circle-fill" style={{fontSize: '4rem', color: 'var(--red)'}}></i>
                        </div>
                        <h5>Please review your order details</h5>
                        <p className="text-muted mb-4">
                          Your order will be processed once you click "Place Order" below.
                        </p>
                        
                        <div className="order-review">
                          <Row className="mb-3">
                            <Col sm={6} className="text-start">
                              <strong>Customer:</strong>
                            </Col>
                            <Col sm={6} className="text-end">
                              {formData.firstName} {formData.lastName}
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col sm={6} className="text-start">
                              <strong>Email:</strong>
                            </Col>
                            <Col sm={6} className="text-end">
                              {formData.email}
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col sm={6} className="text-start">
                              <strong>Phone:</strong>
                            </Col>
                            <Col sm={6} className="text-end">
                              {formData.phone}
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col sm={6} className="text-start">
                              <strong>Order Type:</strong>
                            </Col>
                            <Col sm={6} className="text-end">
                              {formData.deliveryType === "delivery" ? "Delivery" : "Pickup"}
                            </Col>
                          </Row>
                          {formData.deliveryType === "delivery" && (
                            <Row className="mb-3">
                              <Col sm={6} className="text-start">
                                <strong>Address:</strong>
                              </Col>
                              <Col sm={6} className="text-end">
                                {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
                              </Col>
                            </Row>
                          )}
                          <Row className="mb-3">
                            <Col sm={6} className="text-start">
                              <strong>Payment:</strong>
                            </Col>
                            <Col sm={6} className="text-end">
                              {formData.paymentMethod === "credit" ? "Credit/Debit Card" : "Cash on Delivery"}
                            </Col>
                          </Row>
                        </div>

                        <div className="step-navigation mt-4">
                          <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={prevStep}
                            size="lg"
                            className="me-3"
                          >
                            <i className="bi bi-arrow-left me-2"></i>
                            Back to Payment
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </Col>

              {/* Order Summary */}
              <Col lg={4}>
                <Card className="order-summary-checkout sticky-top">
                  <Card.Header>
                    <h4>Order Summary</h4>
                  </Card.Header>
                  <Card.Body>
                    <div className="order-items">
                      {cartItems.map((item, index) => (
                        <div key={index} className="order-item">
                          <div className="item-details">
                            <h6>{item.title}</h6>
                            <span className="quantity">Qty: {item.quantity}</span>
                          </div>
                          <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <hr />

                    <div className="order-totals">
                      <div className="total-row">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="total-row">
                        <span>Tax (8%):</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="total-row">
                        <span>{formData.deliveryType === "delivery" ? "Delivery Fee:" : "Pickup:"}</span>
                        <span>{formData.deliveryType === "delivery" ? `$${deliveryFee.toFixed(2)}` : "Free"}</span>
                      </div>
                      <hr />
                      <div className="total-row final-total">
                        <strong>
                          <span>Total:</span>
                          <span>${total.toFixed(2)}</span>
                        </strong>
                      </div>
                    </div>

                    {currentStep === 1 && (
                      <Button
                        type="submit"
                        className="btn btn_red w-100 mt-3"
                        size="lg"
                      >
                        <i className="bi bi-arrow-right me-2"></i>
                        Continue to Payment
                      </Button>
                    )}

                    {currentStep === 2 && (
                      <Button
                        type="submit"
                        className="btn btn_red w-100 mt-3"
                        size="lg"
                      >
                        <i className="bi bi-arrow-right me-2"></i>
                        Review Order
                      </Button>
                    )}

                    {currentStep === 3 && (
                      <Button
                        type="submit"
                        className="btn btn_red w-100 mt-3"
                        size="lg"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-credit-card me-2"></i>
                            Place Order - ${total.toFixed(2)}
                          </>
                        )}
                      </Button>
                    )}

                    <div className="security-info mt-3">
                      <small className="text-muted">
                        <i className="bi bi-shield-check me-1"></i>
                        Your payment information is secure and encrypted
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        </Container>
      </section>
    </Layout>
  );
};

export default Checkout;

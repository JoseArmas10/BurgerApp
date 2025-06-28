import React from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import Layout from "../../components/Layouts/Layout";
import { useCart } from "../../context/CartContext";
import "../../styles/CartStyle.css";

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal 
  } = useCart();

  // Calcular subtotal
  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax
  const delivery = 5.99;
  const total = subtotal + tax + delivery;

  return (
    <Layout>
      <section className="cart_section">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="cart_header text-center mb-5">
                <h1>Shopping Cart</h1>
                <p className="lead">Review your order before checkout</p>
              </div>
            </Col>
          </Row>

          {cartItems.length === 0 ? (
            <Row>
              <Col lg={12}>
                <div className="empty_cart text-center">
                  <div className="empty_cart_icon">
                    <i className="bi bi-cart-x"></i>
                  </div>
                  <h3>Your cart is empty</h3>
                  <p>Add some delicious burgers to get started!</p>
                  <Button href="/menu" className="btn btn_red">
                    Browse Menu
                  </Button>
                </div>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col lg={8}>
                <div className="cart_items">
                  {cartItems.map((item, index) => (
                    <Card key={index} className="cart_item_card mb-4">
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col md={3}>
                            <div className="cart_item_image">
                              {item.image ? (
                                <img src={item.image} alt={item.title} className="img-fluid" />
                              ) : (
                                <div className="image_placeholder">
                                  <i className="bi bi-image"></i>
                                  <span>Image</span>
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="cart_item_info">
                              <h5>{item.title}</h5>
                              <p className="text-muted">{item.description}</p>
                            </div>
                          </Col>
                          <Col md={2}>
                            <div className="cart_item_price">
                              <span className="price">${item.price}</span>
                            </div>
                          </Col>
                          <Col md={2}>
                            <div className="quantity_controls">
                              <div className="quantity_wrapper">
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <i className="bi bi-dash"></i>
                                </Button>
                                <Form.Control 
                                  type="number" 
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                  className="quantity_input"
                                  min="1"
                                />
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <i className="bi bi-plus"></i>
                                </Button>
                              </div>
                            </div>
                          </Col>
                          <Col md={1}>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="remove_btn"
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Col>

              <Col lg={4}>
                <Card className="order_summary">
                  <Card.Header>
                    <h4>Order Summary</h4>
                  </Card.Header>
                  <Card.Body>
                    <div className="summary_row">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary_row">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="summary_row">
                      <span>Delivery</span>
                      <span>${delivery.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="summary_row total_row">
                      <strong>
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </strong>
                    </div>
                    
                    <div className="checkout_actions mt-4">
                      <Button className="btn btn_red w-100 mb-3" size="lg">
                        <i className="bi bi-credit-card me-2"></i>
                        Proceed to Checkout
                      </Button>
                      <Button href="/menu" variant="outline-secondary" className="w-100">
                        Continue Shopping
                      </Button>
                    </div>

                    <div className="promo_code mt-4">
                      <h6>Promo Code</h6>
                      <div className="d-flex">
                        <Form.Control 
                          type="text" 
                          placeholder="Enter promo code"
                          className="me-2"
                        />
                        <Button variant="outline-primary">Apply</Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="delivery_info mt-4">
                  <Card.Body>
                    <h6><i className="bi bi-truck me-2"></i>Delivery Information</h6>
                    <p className="small text-muted mb-0">
                      Estimated delivery: 25-30 minutes
                    </p>
                    <p className="small text-muted">
                      Free delivery on orders over $50
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </Layout>
  );
};

export default Cart;

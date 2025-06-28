import React from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/CartDropdown.css';

const CartDropdown = () => {
  const { 
    cartItems, 
    isCartOpen, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    closeCart 
  } = useCart();
  
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="cart-backdrop" onClick={handleBackdropClick}></div>
      
      {/* Cart Sidebar */}
      <div className={`cart-dropdown ${isCartOpen ? 'cart-open' : ''}`}>
        <div className="cart-header">
          <h4>Shopping Cart</h4>
          <button className="close-btn" onClick={closeCart}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <i className="bi bi-cart-x"></i>
              </div>
              <p>Your cart is empty</p>
              <Button 
                className="btn btn_red"
                onClick={closeCart}
                as={Link}
                to="/menu"
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.title} />
                      ) : (
                        <div className="placeholder-image">
                          <i className="bi bi-image"></i>
                        </div>
                      )}
                    </div>
                    
                    <div className="item-details">
                      <h6>{item.title}</h6>
                      <p className="item-price">${item.price}</p>
                      
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <strong>${getCartTotal().toFixed(2)}</strong>
                  </div>
                </div>
                
                <div className="cart-actions">
                  <Button 
                    variant="outline-secondary" 
                    className="view-cart-btn"
                    as={Link}
                    to="/cart"
                    onClick={closeCart}
                  >
                    View Cart
                  </Button>
                  <Button 
                    className="btn btn_red checkout-btn"
                    onClick={handleCheckout}
                  >
                    <i className="bi bi-credit-card me-2"></i>
                    Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDropdown;

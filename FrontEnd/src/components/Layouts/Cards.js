import React from "react";
import { Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Cards({ image, rating, title, paragraph, price, renderRatingIcons, id }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    const product = {
      id: id || title.toLowerCase().replace(/\s+/g, '-'), // Use provided id or generate from title
      title,
      price: parseFloat(price),
      image,
      description: paragraph
    };
    addToCart(product);
  };
  return (
    <Col sm={6} lg={4} xl={3} className="mb-4">
      <Card className="overflow-hidden">
        <div className="overflow-hidden">
          {image ? (
            <Card.Img variant="top" src={image} />
          ) : (
            <div style={{width: '100%', height: '200px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #dee2e6'}}>
              <span style={{color: '#6c757d'}}>Menu Item Image</span>
            </div>
          )}
        </div>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <div className="item_rating">{renderRatingIcons(rating)}</div>
            <div className="wishlist">
              <i className="bi bi-heart"></i>
            </div>
          </div>

          <Card.Title>{title}</Card.Title>
          <Card.Text>{paragraph}</Card.Text>

          <div className="d-flex align-items-center justify-content-between">
            <div className="menu_price">
              <h5 className="mb-0">${price}</h5>
            </div>
            <div className="add_to_card">
              <Link to="#" onClick={handleAddToCart}>
                <i className="bi bi-bag me-2"></i>
                Add To Cart
              </Link>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Cards;

import React from 'react';
import { Card, Col } from 'react-bootstrap';
import '../styles/LoadingSpinner.css';

const ProductCardSkeleton = () => {
  return (
    <Col lg={6} xl={4} className="mb-4">
      <Card className="skeleton-card h-100">
        <div className="skeleton-image"></div>
        <Card.Body>
          <div className="mb-2">
            <div className="skeleton-text short"></div>
          </div>
          <div className="skeleton-text medium mb-3"></div>
          <div className="skeleton-text long mb-3"></div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="skeleton-text short"></div>
            <div className="skeleton-button" style={{width: '100px', height: '32px'}}></div>
          </div>
          <div className="skeleton-button"></div>
        </Card.Body>
      </Card>
    </Col>
  );
};

const MenuSkeleton = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </>
  );
};

export default MenuSkeleton;

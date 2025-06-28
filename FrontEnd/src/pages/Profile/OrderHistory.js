import React, { useState } from 'react';
import { Card, Button, Badge, Row, Col, Modal, Alert } from 'react-bootstrap';
import { useOrders } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';

const OrderHistory = () => {
  const { orders } = useOrders();
  const { addToCart } = useCart();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reorderAlert, setReorderAlert] = useState(false);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'preparing': return 'warning';
      case 'on-the-way': return 'info';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Entregado';
      case 'preparing': return 'Preparando';
      case 'on-the-way': return 'En camino';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconocido';
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleReorder = (order) => {
    // Add all items to cart
    order.items.forEach(item => {
      const cartItem = {
        id: item.id.toString(),
        title: item.name,
        price: item.price,
        image: item.image,
        description: `Reordenado de ${order.orderNumber}`
      };
      
      // Add specified quantity
      for (let i = 0; i < item.quantity; i++) {
        addToCart(cartItem);
      }
    });

    setReorderAlert(true);
    setTimeout(() => setReorderAlert(false), 3000);
  };

  if (orders.length === 0) {
    return (
      <Card className="text-center p-5">
        <div className="empty-orders">
          <i className="bi bi-bag-x" style={{ fontSize: '4rem', color: '#ccc' }}></i>
          <h4 className="mt-3">No tienes pedidos aún</h4>
          <p className="text-muted">Cuando hagas tu primer pedido, aparecerá aquí</p>
          <Button variant="primary" href="/menu">
            <i className="bi bi-plus me-1"></i>
            Hacer mi primer pedido
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      {reorderAlert && (
        <Alert variant="success" className="mb-4">
          <i className="bi bi-check-circle me-2"></i>
          ¡Productos añadidos al carrito! Puedes modificar las cantidades antes de proceder al checkout.
        </Alert>
      )}

      <div className="orders-header mb-4">
        <h5>
          <i className="bi bi-bag me-2"></i>
          Historial de Pedidos ({orders.length})
        </h5>
        <p className="text-muted">Revisa tus pedidos anteriores y reordena fácilmente</p>
      </div>

      <div className="orders-list">
        {orders.map(order => (
          <Card key={order.id} className="order-card mb-3">
            <Card.Body>
              <Row className="align-items-center">
                <Col lg={3}>
                  <div className="order-info">
                    <h6 className="order-number">{order.orderNumber}</h6>
                    <small className="text-muted">{new Date(order.date).toLocaleDateString('es-ES')}</small>
                  </div>
                </Col>
                <Col lg={2}>
                  <Badge bg={getStatusVariant(order.status)} className="status-badge">
                    {getStatusText(order.status)}
                  </Badge>
                </Col>
                <Col lg={2}>
                  <div className="order-total">
                    <strong>${order.total.toFixed(2)}</strong>
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="order-items-preview">
                    <small className="text-muted">
                      {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                    </small>
                    <div className="items-preview">
                      {order.items.slice(0, 2).map((item, index) => (
                        <span key={index} className="item-preview">
                          {item.name}
                          {index < Math.min(order.items.length, 2) - 1 && ', '}
                        </span>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-muted">
                          {' '}y {order.items.length - 2} más...
                        </span>
                      )}
                    </div>
                  </div>
                </Col>
                <Col lg={2}>
                  <div className="order-actions d-flex gap-1">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                    >
                      <i className="bi bi-eye"></i>
                    </Button>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => handleReorder(order)}
                      title="Reordenar"
                    >
                      <i className="bi bi-arrow-repeat"></i>
                    </Button>
                  </div>
                </Col>
              </Row>

              {/* Mobile view */}
              <div className="d-lg-none mt-3">
                <Row>
                  <Col xs={6}>
                    <small className="text-muted">Total:</small>
                    <div><strong>${order.total.toFixed(2)}</strong></div>
                  </Col>
                  <Col xs={6}>
                    <small className="text-muted">Items:</small>
                    <div>{order.items.length} producto{order.items.length !== 1 ? 's' : ''}</div>
                  </Col>
                </Row>
                <div className="mt-2 d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                  >
                    Ver Detalles
                  </Button>
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    onClick={() => handleReorder(order)}
                  >
                    Reordenar
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Order Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Detalles del Pedido {selectedOrder?.orderNumber}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Fecha:</strong> {new Date(selectedOrder.date).toLocaleDateString('es-ES')}
                </Col>
                <Col md={6}>
                  <strong>Estado:</strong>{' '}
                  <Badge bg={getStatusVariant(selectedOrder.status)}>
                    {getStatusText(selectedOrder.status)}
                  </Badge>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Método de Pago:</strong> {selectedOrder.paymentMethod}
                </Col>
                <Col md={6}>
                  <strong>Tiempo Estimado:</strong> {selectedOrder.estimatedDelivery}
                </Col>
              </Row>

              {selectedOrder.deliveryAddress && (
                <div className="mb-3">
                  <strong>Dirección de Entrega:</strong>
                  <address className="mb-0 mt-1">
                    {selectedOrder.deliveryAddress.street}<br />
                    {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.zipCode}<br />
                    {selectedOrder.deliveryAddress.instructions && (
                      <small className="text-muted">
                        Instrucciones: {selectedOrder.deliveryAddress.instructions}
                      </small>
                    )}
                  </address>
                </div>
              )}

              <h6>Productos Ordenados:</h6>
              <div className="order-items">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="order-item d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div>
                      <strong>{item.name}</strong>
                      <div className="text-muted">Cantidad: {item.quantity}</div>
                    </div>
                    <div className="text-end">
                      <div>${(item.price * item.quantity).toFixed(2)}</div>
                      <small className="text-muted">${item.price} c/u</small>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-end mt-3">
                <h5>Total: ${selectedOrder.total.toFixed(2)}</h5>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          {selectedOrder && (
            <Button 
              variant="primary" 
              onClick={() => {
                handleReorder(selectedOrder);
                setShowModal(false);
              }}
            >
              <i className="bi bi-arrow-repeat me-1"></i>
              Reordenar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderHistory;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layouts/Layout';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import '../../styles/OrderHistoryStyle.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const { currentUser, isAuthenticated } = useAuth();
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (!isAuthenticated()) {
      setError('Debes iniciar sesión para ver tu historial de pedidos');
      setLoading(false);
      return;
    }

    const loadOrdersData = async () => {
      try {
        setLoading(true);
        const response = await orderService.getUserOrders({ 
          sort: '-createdAt',
          limit: 20 
        });
        setOrders(response.data || []);
      } catch (error) {
        console.error('Error loading orders:', error);
        const errorMessage = error.message || 'Error al cargar el historial de pedidos';
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadOrdersData();
  }, [currentUser, isAuthenticated, showError]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrders({ 
        sort: '-createdAt',
        limit: 20 
      });
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      const errorMessage = error.message || 'Error al cargar el historial de pedidos';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'preparing': return 'primary';
      case 'ready': return 'success';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Listo';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status || 'Desconocido';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Function to check if order can be cancelled
  const canCancelOrder = (order) => {
    return ['pending', 'confirmed'].includes(order.status?.toLowerCase());
  };

  // Function to initiate order cancellation
  const handleCancelOrder = (order) => {
    setCancellingOrder(order);
    setShowCancelModal(true);
    setCancelReason('');
  };

  // Function to confirm order cancellation
  const confirmCancelOrder = async () => {
    if (!cancellingOrder) return;

    try {
      setLoading(true);
      await orderService.cancelOrder(cancellingOrder._id, cancelReason);
      
      // Update the orders list
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === cancellingOrder._id 
            ? { ...order, status: 'cancelled' }
            : order
        )
      );
      
      showSuccess('Pedido cancelado exitosamente');
      setShowCancelModal(false);
      setCancellingOrder(null);
      setCancelReason('');
    } catch (error) {
      console.error('Error cancelling order:', error);
      showError(error.message || 'Error al cancelar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return (
      <Layout>
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <Alert variant="warning">
                <h4>Acceso Restringido</h4>
                <p>Debes iniciar sesión para ver tu historial de pedidos.</p>
                <Link to="/login" className="btn btn-primary">
                  Iniciar Sesión
                </Link>
              </Alert>
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="order-history-section">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="order-history-header mb-4">
                <h1>Mi Historial de Pedidos</h1>
                <p className="text-muted">
                  Aquí puedes ver todos tus pedidos anteriores
                </p>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status" size="lg">
                    <span className="visually-hidden">Cargando pedidos...</span>
                  </Spinner>
                  <p className="mt-2">Cargando tu historial de pedidos...</p>
                </div>
              ) : error ? (
                <Alert variant="danger" className="text-center">
                  <h5>Error al cargar pedidos</h5>
                  <p>{error}</p>
                  <Button variant="outline-danger" onClick={loadOrders}>
                    Intentar de nuevo
                  </Button>
                </Alert>
              ) : orders.length === 0 ? (
                <div className="text-center py-5">
                  <div className="empty-orders">
                    <i className="bi bi-bag-x" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                    <h4 className="mt-3">No tienes pedidos aún</h4>
                    <p className="text-muted">
                      ¡Explora nuestro menú y haz tu primer pedido!
                    </p>
                    <div className="mt-3">
                      <Link to="/menu" className="btn btn-primary me-2">
                        Ver Menú
                      </Link>
                      <Link to="/shop" className="btn btn-outline-primary">
                        Tienda de Mascotas
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <Card key={order._id} className="order-card mb-4">
                      <Card.Header className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">Pedido #{order.orderNumber || order._id.slice(-8)}</h5>
                          <small className="text-muted">
                            {formatDate(order.createdAt)}
                          </small>
                        </div>
                        <Badge bg={getStatusBadgeVariant(order.status)} className="order-status-badge">
                          {getStatusText(order.status)}
                        </Badge>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={8}>
                            <h6>Productos:</h6>
                            <div className="order-items">
                              {order.items?.map((item, index) => (
                                <div key={index} className="order-item d-flex justify-content-between align-items-center mb-2">
                                  <div>
                                    <span className="item-name">{item.product?.name || item.name}</span>
                                    <span className="item-quantity text-muted"> x{item.quantity}</span>
                                  </div>
                                  <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </Col>
                          <Col md={4} className="text-md-end">
                            <div className="order-summary">
                              <div className="order-total mb-2">
                                <strong>Total: {formatPrice(order.pricing?.total || 0)}</strong>
                              </div>
                              {order.deliveryInfo?.address && (
                                <div className="delivery-address mb-2">
                                  <small className="text-muted">
                                    <i className="bi bi-geo-alt"></i> {order.deliveryInfo.address.street}, {order.deliveryInfo.address.city}
                                  </small>
                                </div>
                              )}
                              {order.payment?.method && (
                                <div className="payment-method mb-2">
                                  <small className="text-muted">
                                    <i className="bi bi-credit-card"></i> {order.payment.method}
                                  </small>
                                </div>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                      <Card.Footer className="d-flex justify-content-between align-items-center">
                        <div>
                          {order.deliveryInfo?.estimatedTime && (
                            <small className="text-muted">
                              <i className="bi bi-clock"></i> Tiempo estimado: {order.deliveryInfo.estimatedTime} min
                            </small>
                          )}
                        </div>
                        <div>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            as={Link}
                            to={`/orders/${order._id}`}
                          >
                            Ver Detalles
                          </Button>
                          {canCancelOrder(order) && (
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="ms-2"
                              onClick={() => handleCancelOrder(order)}
                            >
                              Cancelar
                            </Button>
                          )}
                          {order.status === 'delivered' && (
                            <Button 
                              variant="outline-success" 
                              size="sm" 
                              className="ms-2"
                              onClick={() => {/* Handle reorder */}}
                            >
                              Pedir de nuevo
                            </Button>
                          )}
                        </div>
                      </Card.Footer>
                    </Card>
                  ))}
                </div>
              )}
            </Col>
          </Row>
        </Container>

        {/* Cancel Order Modal */}
        <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Cancelar Pedido</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>¿Estás seguro de que deseas cancelar este pedido?</p>
            <Form.Group controlId="cancelReason">
              <Form.Label>Razón de la cancelación (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Escribe aquí tu razón para cancelar el pedido"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
              Cerrar
            </Button>
            <Button variant="danger" onClick={confirmCancelOrder} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Cancelar Pedido'}
            </Button>
          </Modal.Footer>
        </Modal>
      </section>
    </Layout>
  );
};

export default OrderHistory;

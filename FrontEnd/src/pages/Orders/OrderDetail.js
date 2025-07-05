import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import Layout from '../../components/Layouts/Layout';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import '../../styles/OrderDetailStyle.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const { showError } = useToast();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const loadOrder = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(id);
        setOrder(response.data);
      } catch (error) {
        console.error('Error loading order:', error);
        const errorMessage = error.message || 'Error al cargar el pedido';
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, isAuthenticated, navigate, showError]);

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

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <Layout>
      <section className="order-detail-section bg-light py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="mb-4">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate('/orders')}
                  className="mb-3"
                >
                  <i className="bi bi-arrow-left"></i> Volver al historial
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                </div>
              ) : error ? (
                <Alert variant="danger">
                  <h5>Error</h5>
                  <p>{error}</p>
                  <Button variant="outline-danger" onClick={() => window.location.reload()}>
                    Intentar de nuevo
                  </Button>
                </Alert>
              ) : order ? (
                <>
                  {/* Order Header */}
                  <Card className="order-header-card mb-4">
                    <Card.Header className="bg-primary text-white">
                      <Row className="align-items-center">
                        <Col>
                          <h4 className="mb-1">Pedido #{order.orderNumber || order._id.slice(-8)}</h4>
                          <small>Realizado el {formatDate(order.createdAt)}</small>
                        </Col>
                        <Col xs="auto">
                          <Badge bg={getStatusBadgeVariant(order.status)} className="fs-6">
                            {getStatusText(order.status)}
                          </Badge>
                        </Col>
                      </Row>
                    </Card.Header>
                  </Card>

                  {/* Customer Info */}
                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="mb-0">Información del Cliente</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <p><strong>Nombre:</strong> {order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
                          <p><strong>Email:</strong> {order.customerInfo?.email}</p>
                          <p><strong>Teléfono:</strong> {order.customerInfo?.phone}</p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Tipo de entrega:</strong> {order.deliveryInfo?.type === 'delivery' ? 'Domicilio' : 'Recoger en tienda'}</p>
                          {order.deliveryInfo?.address && (
                            <div>
                              <strong>Dirección:</strong>
                              <div>
                                {order.deliveryInfo.address.street}<br />
                                {order.deliveryInfo.address.city}, {order.deliveryInfo.address.state} {order.deliveryInfo.address.zipCode}
                              </div>
                            </div>
                          )}
                          {order.deliveryInfo?.instructions && (
                            <p><strong>Instrucciones:</strong> {order.deliveryInfo.instructions}</p>
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  {/* Order Items */}
                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="mb-0">Productos</h5>
                    </Card.Header>
                    <Card.Body>
                      {order.items?.map((item, index) => (
                        <div key={index} className="order-item-detail d-flex justify-content-between align-items-center py-3 border-bottom">
                          <div className="item-info">
                            <h6 className="mb-1">{item.product?.name || item.name}</h6>
                            <div className="text-muted">
                              <small>Cantidad: {item.quantity}</small>
                              {item.specialInstructions && (
                                <div><small>Instrucciones: {item.specialInstructions}</small></div>
                              )}
                            </div>
                          </div>
                          <div className="item-pricing text-end">
                            <div className="item-price">{formatPrice(item.price)} c/u</div>
                            <div className="item-total"><strong>{formatPrice(item.price * item.quantity)}</strong></div>
                          </div>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>

                  {/* Order Summary */}
                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="mb-0">Resumen del Pedido</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <div className="pricing-breakdown">
                            <div className="d-flex justify-content-between mb-2">
                              <span>Subtotal:</span>
                              <span>{formatPrice(order.pricing?.subtotal || 0)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Impuestos:</span>
                              <span>{formatPrice(order.pricing?.tax || 0)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Envío:</span>
                              <span>{formatPrice(order.pricing?.deliveryFee || 0)}</span>
                            </div>
                            {order.pricing?.discount?.amount > 0 && (
                              <div className="d-flex justify-content-between mb-2 text-success">
                                <span>Descuento:</span>
                                <span>-{formatPrice(order.pricing.discount.amount)}</span>
                              </div>
                            )}
                            <hr />
                            <div className="d-flex justify-content-between">
                              <strong>Total:</strong>
                              <strong>{formatPrice(order.pricing?.total || 0)}</strong>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="payment-info">
                            <h6>Información de Pago</h6>
                            <p><strong>Método:</strong> {order.payment?.method}</p>
                            <p><strong>Estado:</strong> {order.payment?.status}</p>
                            {order.payment?.paidAt && (
                              <p><strong>Pagado:</strong> {formatDate(order.payment.paidAt)}</p>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  {/* Status History */}
                  {order.statusHistory && order.statusHistory.length > 0 && (
                    <Card className="mb-4">
                      <Card.Header>
                        <h5 className="mb-0">Historial del Pedido</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="status-timeline">
                          {order.statusHistory.reverse().map((status, index) => (
                            <div key={index} className="status-entry d-flex mb-3">
                              <div className="status-icon me-3">
                                <Badge bg={getStatusBadgeVariant(status.status)} className="rounded-circle p-2">
                                  <i className="bi bi-check"></i>
                                </Badge>
                              </div>
                              <div className="status-content">
                                <div className="status-title"><strong>{getStatusText(status.status)}</strong></div>
                                <div className="status-time text-muted">{formatDate(status.timestamp)}</div>
                                {status.note && <div className="status-note">{status.note}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  )}

                  {/* Cancel Reason if cancelled */}
                  {order.status === 'cancelled' && order.cancelReason && (
                    <Card className="mb-4 border-danger">
                      <Card.Header className="bg-danger text-white">
                        <h5 className="mb-0">Pedido Cancelado</h5>
                      </Card.Header>
                      <Card.Body>
                        <p><strong>Razón:</strong> {order.cancelReason}</p>
                        {order.cancelledAt && (
                          <p><strong>Fecha de cancelación:</strong> {formatDate(order.cancelledAt)}</p>
                        )}
                      </Card.Body>
                    </Card>
                  )}
                </>
              ) : (
                <Alert variant="warning">
                  <h5>Pedido no encontrado</h5>
                  <p>El pedido que buscas no existe o no tienes permisos para verlo.</p>
                </Alert>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};

export default OrderDetail;

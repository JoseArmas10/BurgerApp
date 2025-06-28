import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Nav } from 'react-bootstrap';
import Layout from '../../components/Layouts/Layout';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import OrderHistory from './OrderHistory';
import '../../styles/ProfileStyle.css';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { getOrderStats } = useOrders();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    zipCode: currentUser?.zipCode || ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const stats = getOrderStats();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Aquí normalmente actualizarías los datos en el backend
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
  };

  if (!currentUser) {
    return (
      <Layout>
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={6}>
              <Card className="text-center p-4">
                <h3>Acceso denegado</h3>
                <p>Debes iniciar sesión para ver esta página.</p>
                <Button variant="primary" href="/login">
                  Iniciar Sesión
                </Button>
              </Card>
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Profile Header */}
      <section className="profile-header">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <div className="profile-welcome">
                <h1>¡Hola, {currentUser.firstName}!</h1>
                <p>Gestiona tu perfil y revisa tus pedidos</p>
              </div>
            </Col>
            <Col lg={4} className="text-lg-end">
              <Button 
                variant="outline-light" 
                onClick={handleLogout}
                className="logout-btn"
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Profile Content */}
      <section className="profile-content">
        <Container>
          <Row>
            {/* Sidebar Navigation */}
            <Col lg={3} className="mb-4">
              <Card className="profile-nav-card">
                <Card.Body>
                  <Nav variant="pills" className="flex-column profile-nav">
                    <Nav.Item>
                      <Nav.Link 
                        active={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                        className="profile-nav-link"
                      >
                        <i className="bi bi-person me-2"></i>
                        Mi Perfil
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        active={activeTab === 'orders'}
                        onClick={() => setActiveTab('orders')}
                        className="profile-nav-link"
                      >
                        <i className="bi bi-bag me-2"></i>
                        Mis Pedidos
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        active={activeTab === 'settings'}
                        onClick={() => setActiveTab('settings')}
                        className="profile-nav-link"
                      >
                        <i className="bi bi-gear me-2"></i>
                        Configuración
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Body>
              </Card>

              {/* Quick Stats */}
              <Card className="profile-stats-card mt-3">
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="bi bi-graph-up me-2"></i>
                    Estadísticas
                  </h6>
                </Card.Header>
                <Card.Body>
                  <div className="stat-item">
                    <span className="stat-label">Total Pedidos</span>
                    <span className="stat-value">{stats.totalOrders}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Gastado</span>
                    <span className="stat-value">${stats.totalSpent.toFixed(2)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Promedio por Pedido</span>
                    <span className="stat-value">${stats.averageOrderValue.toFixed(2)}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Main Content */}
            <Col lg={9}>
              {showSuccess && (
                <Alert variant="success" className="mb-4">
                  <i className="bi bi-check-circle me-2"></i>
                  ¡Perfil actualizado correctamente!
                </Alert>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <Card className="profile-form-card">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="bi bi-person me-2"></i>
                      Información Personal
                    </h5>
                    {!isEditing && (
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Editar
                      </Button>
                    )}
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleSave}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                              className={!isEditing ? 'readonly-input' : ''}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                              className={!isEditing ? 'readonly-input' : ''}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                              className={!isEditing ? 'readonly-input' : ''}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                              className={!isEditing ? 'readonly-input' : ''}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                          className={!isEditing ? 'readonly-input' : ''}
                          placeholder="Calle y número"
                        />
                      </Form.Group>

                      <Row>
                        <Col md={8}>
                          <Form.Group className="mb-3">
                            <Form.Label>Ciudad</Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                              className={!isEditing ? 'readonly-input' : ''}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Código Postal</Form.Label>
                            <Form.Control
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              readOnly={!isEditing}
                              className={!isEditing ? 'readonly-input' : ''}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      {isEditing && (
                        <div className="d-flex gap-2">
                          <Button type="submit" variant="primary">
                            <i className="bi bi-check me-1"></i>
                            Guardar Cambios
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline-secondary"
                            onClick={() => {
                              setIsEditing(false);
                              setFormData({
                                firstName: currentUser?.firstName || '',
                                lastName: currentUser?.lastName || '',
                                email: currentUser?.email || '',
                                phone: currentUser?.phone || '',
                                address: currentUser?.address || '',
                                city: currentUser?.city || '',
                                zipCode: currentUser?.zipCode || ''
                              });
                            }}
                          >
                            <i className="bi bi-x me-1"></i>
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </Form>
                  </Card.Body>
                </Card>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <OrderHistory />
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <Card className="profile-settings-card">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-gear me-2"></i>
                      Configuración
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="setting-item">
                      <div className="setting-info">
                        <h6>Notificaciones por Email</h6>
                        <p className="text-muted mb-0">Recibe actualizaciones sobre tus pedidos</p>
                      </div>
                      <Form.Check type="switch" defaultChecked />
                    </div>
                    <hr />
                    <div className="setting-item">
                      <div className="setting-info">
                        <h6>Notificaciones SMS</h6>
                        <p className="text-muted mb-0">Recibe SMS cuando tu pedido esté listo</p>
                      </div>
                      <Form.Check type="switch" defaultChecked />
                    </div>
                    <hr />
                    <div className="setting-item">
                      <div className="setting-info">
                        <h6>Ofertas y Promociones</h6>
                        <p className="text-muted mb-0">Recibe ofertas especiales y descuentos</p>
                      </div>
                      <Form.Check type="switch" defaultChecked />
                    </div>
                    <hr />
                    <div className="danger-zone">
                      <h6 className="text-danger">Zona de Peligro</h6>
                      <p className="text-muted">Estas acciones no se pueden deshacer</p>
                      <Button variant="outline-danger" size="sm">
                        <i className="bi bi-trash me-1"></i>
                        Eliminar Cuenta
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};

export default Profile;

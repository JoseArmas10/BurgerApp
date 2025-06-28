import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal, Form } from 'react-bootstrap';
import Layout from '../../components/Layouts/Layout';
import InteractiveMap from '../../components/InteractiveMap';
import { useGeolocation } from '../../context/GeolocationContext';
import '../../styles/LocationsStyle.css';

const Locations = () => {
  const {
    userLocation,
    locationError,
    locationLoading,
    permissionStatus,
    nearestBranch,
    branchesWithDistance,
    requestLocation,
    setDefaultLocation,
    getAllBranches,
    isDeliveryAvailable
  } = useGeolocation();

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  // Helper function to safely get rating value
  const getRatingValue = (rating) => {
    if (typeof rating === 'object' && rating !== null) {
      return rating.average || 0;
    }
    return rating || 0;
  };

  const branches = branchesWithDistance.length > 0 ? branchesWithDistance : getAllBranches();

  useEffect(() => {
    // Si el usuario no ha dado permisos y no hay error, mostrar modal
    if (permissionStatus === 'prompt' && !locationError && !userLocation) {
      setShowLocationModal(true);
    }
  }, [permissionStatus, locationError, userLocation]);

  const handleRequestLocation = () => {
    requestLocation();
    setShowLocationModal(false);
  };

  const handleManualAddress = () => {
    // Por ahora, usar ubicación por defecto
    // En una implementación real, usarías un servicio de geocodificación
    setDefaultLocation();
    setShowLocationModal(false);
  };

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const formatDeliveryTime = (time) => {
    return `${time} min`;
  };

  const getBranchStatusColor = (branch) => {
    if (!branch.isOpen) return 'danger';
    if (branch.distance && branch.distance < 2) return 'success';
    if (branch.distance && branch.distance < 5) return 'warning';
    return 'info';
  };

  const getBranchStatusText = (branch) => {
    if (!branch.isOpen) return 'Cerrado';
    if (branch.distance && branch.distance < 2) return 'Muy cerca';
    if (branch.distance && branch.distance < 5) return 'Cerca';
    return 'Disponible';
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="locations-hero">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h1 className="locations-title">Nuestras Ubicaciones</h1>
              <p className="locations-subtitle">
                Encuentra la sucursal más cercana a ti y descubre nuestros tiempos de entrega
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Location Status */}
      <section className="location-status py-4">
        <Container>
          <Row>
            <Col lg={12}>
              {locationError && (
                <Alert variant="warning" className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <div className="flex-grow-1">
                    <strong>Ubicación no disponible:</strong> {locationError}
                    <div className="mt-2">
                      <Button 
                        variant="outline-warning" 
                        size="sm" 
                        onClick={() => setShowLocationModal(true)}
                      >
                        Configurar ubicación
                      </Button>
                    </div>
                  </div>
                </Alert>
              )}

              {!userLocation && !locationError && (
                <Alert variant="info" className="d-flex align-items-center">
                  <i className="bi bi-info-circle me-2"></i>
                  <div className="flex-grow-1">
                    <strong>Comparte tu ubicación</strong> para encontrar la sucursal más cercana y calcular tiempos de entrega precisos.
                    <div className="mt-2">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={handleRequestLocation}
                        disabled={locationLoading}
                      >
                        {locationLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Obteniendo ubicación...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-geo-alt me-1"></i>
                            Usar mi ubicación
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Alert>
              )}

              {userLocation && nearestBranch && (
                <Alert variant="success" className="d-flex align-items-center">
                  <i className="bi bi-check-circle me-2"></i>
                  <div className="flex-grow-1">
                    <strong>Sucursal más cercana:</strong> {nearestBranch.name}
                    <div className="mt-1">
                      <span className="me-3">
                        <i className="bi bi-geo"></i> {formatDistance(nearestBranch.distance)}
                      </span>
                      <span className="me-3">
                        <i className="bi bi-truck"></i> {formatDeliveryTime(nearestBranch.estimatedDeliveryTime)}
                      </span>
                      <Badge bg={getBranchStatusColor(nearestBranch)}>
                        {getBranchStatusText(nearestBranch)}
                      </Badge>
                    </div>
                  </div>
                </Alert>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* View Toggle */}
      <section className="view-controls py-3">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center">
                <h3>Todas las Sucursales ({branches.length})</h3>
                <div className="btn-group" role="group">
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                    onClick={() => setViewMode('list')}
                  >
                    <i className="bi bi-list"></i> Lista
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'primary' : 'outline-primary'}
                    onClick={() => setViewMode('map')}
                  >
                    <i className="bi bi-map"></i> Mapa
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Content */}
      <section className="locations-content">
        <Container>
          {viewMode === 'map' ? (
            /* Map View */
            <Row>
              <Col lg={12}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-0">
                    <InteractiveMap 
                      height="600px" 
                      showUserLocation={true}
                      selectedBranch={selectedBranch}
                    />
                  </Card.Body>
                </Card>
                
                {/* Branch selector below map */}
                <Row className="mt-4">
                  {branches.map(branch => (
                    <Col md={6} lg={3} key={branch.id} className="mb-3">
                      <Card 
                        className={`branch-selector-card h-100 ${selectedBranch?.id === branch.id ? 'selected' : ''}`}
                        onClick={() => setSelectedBranch(branch)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Body className="p-3">
                          <h6 className="card-title mb-2">{branch.name}</h6>
                          <p className="small text-muted mb-1">{branch.address}</p>
                          {branch.distance && (
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="small">
                                <i className="bi bi-geo"></i> {formatDistance(branch.distance)}
                              </span>
                              <Badge bg={getBranchStatusColor(branch)} className="small">
                                {getBranchStatusText(branch)}
                              </Badge>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          ) : (
            /* List View */
            <Row>
              <Col lg={8}>
                <div className="branches-list">
                  {branches.map(branch => (
                    <Card key={branch.id} className="branch-card mb-4 shadow-sm">
                      <Card.Body>
                        <Row>
                          <Col md={8}>
                            <div className="d-flex align-items-start justify-content-between mb-3">
                              <div>
                                <h5 className="branch-name mb-1">{branch.name}</h5>
                                <div className="d-flex align-items-center mb-2">
                                  <div className="rating-stars me-2">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <i 
                                        key={i} 
                                        className={`bi ${i < Math.floor(getRatingValue(branch.rating)) ? 'bi-star-fill' : 'bi-star'} text-warning`}
                                      ></i>
                                    ))}
                                  </div>
                                  <span className="rating-text">{getRatingValue(branch.rating)}</span>
                                </div>
                              </div>
                              <Badge bg={getBranchStatusColor(branch)}>
                                {getBranchStatusText(branch)}
                              </Badge>
                            </div>

                            <div className="branch-info">
                              <p className="mb-2">
                                <i className="bi bi-geo-alt text-muted me-2"></i>
                                {branch.address}
                              </p>
                              <p className="mb-2">
                                <i className="bi bi-telephone text-muted me-2"></i>
                                {branch.phone}
                              </p>
                              <p className="mb-3">
                                <i className="bi bi-clock text-muted me-2"></i>
                                {branch.hours}
                              </p>

                              <div className="branch-features mb-3">
                                {branch.features.map((feature, index) => (
                                  <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </Col>

                          <Col md={4}>
                            {branch.distance && (
                              <div className="delivery-info text-center p-3 bg-light rounded">
                                <div className="mb-2">
                                  <i className="bi bi-geo text-primary" style={{fontSize: '1.5rem'}}></i>
                                  <div className="mt-1">
                                    <strong>{formatDistance(branch.distance)}</strong>
                                    <div className="small text-muted">Distancia</div>
                                  </div>
                                </div>
                                
                                <div className="mb-3">
                                  <i className="bi bi-truck text-success" style={{fontSize: '1.5rem'}}></i>
                                  <div className="mt-1">
                                    <strong>{formatDeliveryTime(branch.estimatedDeliveryTime)}</strong>
                                    <div className="small text-muted">Tiempo estimado</div>
                                  </div>
                                </div>

                                <div className="d-grid gap-2">
                                  {isDeliveryAvailable(branch.id) ? (
                                    <Button variant="primary" size="sm">
                                      <i className="bi bi-truck me-1"></i>
                                      Pedir Delivery
                                    </Button>
                                  ) : (
                                    <Button variant="outline-secondary" size="sm" disabled>
                                      Delivery no disponible
                                    </Button>
                                  )}
                                  <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedBranch(branch);
                                      setViewMode('map');
                                    }}
                                  >
                                    <i className="bi bi-map me-1"></i>
                                    Ver en mapa
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Col>

              <Col lg={4}>
                <div className="sticky-sidebar">
                  <Card className="shadow-sm">
                    <Card.Header>
                      <h5 className="mb-0">
                        <i className="bi bi-map me-2"></i>
                        Mapa de ubicaciones
                      </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <InteractiveMap 
                        height="300px" 
                        showUserLocation={true}
                        selectedBranch={selectedBranch}
                      />
                    </Card.Body>
                  </Card>

                  {nearestBranch && (
                    <Card className="shadow-sm mt-4">
                      <Card.Header>
                        <h6 className="mb-0">
                          <i className="bi bi-star me-2"></i>
                          Sucursal recomendada
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <h6>{nearestBranch.name}</h6>
                        <p className="small text-muted mb-2">{nearestBranch.address}</p>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="small">
                            <i className="bi bi-geo"></i> {formatDistance(nearestBranch.distance)}
                          </span>
                          <span className="small">
                            <i className="bi bi-truck"></i> {formatDeliveryTime(nearestBranch.estimatedDeliveryTime)}
                          </span>
                        </div>
                        <div className="d-grid">
                          <Button variant="primary" size="sm">
                            <i className="bi bi-truck me-1"></i>
                            Pedir aquí
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* Location Modal */}
      <Modal show={showLocationModal} onHide={() => setShowLocationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-geo-alt me-2"></i>
            Configurar ubicación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Para brindarte la mejor experiencia, necesitamos conocer tu ubicación:</p>
          
          <div className="d-grid gap-3">
            <Button 
              variant="primary" 
              onClick={handleRequestLocation}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Obteniendo ubicación...
                </>
              ) : (
                <>
                  <i className="bi bi-geo-alt me-2"></i>
                  Usar mi ubicación actual
                </>
              )}
            </Button>
            
            <div className="text-center">
              <small className="text-muted">o</small>
            </div>
            
            <Form onSubmit={(e) => { e.preventDefault(); handleManualAddress(); }}>
              <Form.Group>
                <Form.Label>Ingresar dirección manualmente:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Av. Principal 123, Centro"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                />
              </Form.Group>
              <Button 
                variant="outline-primary" 
                type="submit" 
                className="w-100 mt-2"
              >
                <i className="bi bi-search me-2"></i>
                Buscar dirección
              </Button>
            </Form>
          </div>
          
          <div className="text-center mt-3">
            <Button 
              variant="link" 
              className="text-muted small"
              onClick={() => { setDefaultLocation(); setShowLocationModal(false); }}
            >
              Continuar sin ubicación
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default Locations;

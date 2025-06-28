import React from 'react';
import { Badge, Alert } from 'react-bootstrap';
import { useGeolocation } from '../context/GeolocationContext';

const DeliveryIndicator = ({ size = 'normal', showAddress = false, className = '' }) => {
  const { 
    userLocation, 
    nearestBranch, 
    locationLoading, 
    locationError,
    requestLocation 
  } = useGeolocation();

  const formatDeliveryTime = (time) => {
    if (time <= 20) return `${time} min - ¡Súper rápido!`;
    if (time <= 30) return `${time} min - Rápido`;
    if (time <= 45) return `${time} min - Normal`;
    return `${time} min - Un poco más`;
  };

  const getDeliveryBadgeVariant = (time) => {
    if (time <= 20) return 'success';
    if (time <= 30) return 'primary';
    if (time <= 45) return 'warning';
    return 'secondary';
  };

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  if (locationLoading) {
    return (
      <div className={`delivery-indicator loading ${className}`}>
        <div className="d-flex align-items-center">
          <span className="spinner-border spinner-border-sm me-2"></span>
          <span>Calculando tiempo de entrega...</span>
        </div>
      </div>
    );
  }

  if (locationError && !userLocation) {
    return (
      <Alert variant="info" className={`delivery-indicator ${className} mb-0`}>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <i className="bi bi-geo-alt me-2"></i>
            <strong>¿Dónde estás?</strong>
            <div className="small">Comparte tu ubicación para ver tiempos de entrega</div>
          </div>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={requestLocation}
          >
            <i className="bi bi-geo-alt me-1"></i>
            Ubicación
          </button>
        </div>
      </Alert>
    );
  }

  if (!nearestBranch) {
    return (
      <div className={`delivery-indicator ${className}`}>
        <Badge bg="secondary">
          <i className="bi bi-geo-alt me-1"></i>
          Tiempo de entrega no disponible
        </Badge>
      </div>
    );
  }

  const deliveryTime = nearestBranch.estimatedDeliveryTime;
  const distance = nearestBranch.distance;

  if (size === 'compact') {
    return (
      <div className={`delivery-indicator compact ${className}`}>
        <Badge bg={getDeliveryBadgeVariant(deliveryTime)}>
          <i className="bi bi-truck me-1"></i>
          {deliveryTime} min
        </Badge>
      </div>
    );
  }

  if (size === 'large') {
    return (
      <div className={`delivery-indicator large ${className}`}>
        <div className="delivery-card p-3 border rounded">
          <div className="d-flex align-items-center mb-2">
            <div className="delivery-icon me-3">
              <i className="bi bi-truck text-primary" style={{fontSize: '2rem'}}></i>
            </div>
            <div>
              <h5 className="mb-0">Entrega estimada</h5>
              <Badge bg={getDeliveryBadgeVariant(deliveryTime)} className="mt-1">
                {formatDeliveryTime(deliveryTime)}
              </Badge>
            </div>
          </div>
          
          {showAddress && (
            <div className="delivery-details">
              <hr className="my-2" />
              <div className="small text-muted">
                <div className="mb-1">
                  <i className="bi bi-shop me-1"></i>
                  Desde: {nearestBranch.name}
                </div>
                <div className="mb-1">
                  <i className="bi bi-geo me-1"></i>
                  Distancia: {formatDistance(distance)}
                </div>
                <div>
                  <i className="bi bi-geo-alt me-1"></i>
                  {nearestBranch.address}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Size normal
  return (
    <div className={`delivery-indicator normal ${className}`}>
      <div className="d-flex align-items-center">
        <i className="bi bi-truck text-primary me-2"></i>
        <div>
          <span className="fw-semibold">Entrega en </span>
          <Badge bg={getDeliveryBadgeVariant(deliveryTime)}>
            {deliveryTime} min
          </Badge>
          {showAddress && (
            <div className="small text-muted mt-1">
              Desde {nearestBranch.name} ({formatDistance(distance)})
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryIndicator;

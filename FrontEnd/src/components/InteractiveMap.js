import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useGeolocation } from '../context/GeolocationContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Iconos personalizados para diferentes tipos de marcadores
const userIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'user-marker'
});

const branchIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <circle cx="16" cy="16" r="14" fill="#ff6b35" stroke="#fff" stroke-width="3"/>
      <text x="16" y="20" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="white">B</text>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Componente para ajustar el centro del mapa
const MapUpdater = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
};

const InteractiveMap = ({ height = '400px', showUserLocation = true, selectedBranch = null }) => {
  const { userLocation, branchesWithDistance, getAllBranches } = useGeolocation();
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Nueva York por defecto
  const [mapZoom, setMapZoom] = useState(12);

  // Helper function to safely get rating value
  const getRatingValue = (rating) => {
    if (typeof rating === 'object' && rating !== null) {
      return rating.average || 0;
    }
    return rating || 0;
  };

  const branches = branchesWithDistance.length > 0 ? branchesWithDistance : getAllBranches();

  useEffect(() => {
    if (selectedBranch) {
      // Si hay una sucursal seleccionada, centrar en ella
      setMapCenter([selectedBranch.coordinates.lat, selectedBranch.coordinates.lng]);
      setMapZoom(15);
    } else if (userLocation) {
      // Si hay ubicación del usuario, centrar en ella
      setMapCenter([userLocation.lat, userLocation.lng]);
      setMapZoom(13);
    }
  }, [userLocation, selectedBranch]);

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const formatDeliveryTime = (time) => {
    return `${time} min`;
  };

  return (
    <div style={{ height: height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapUpdater center={mapCenter} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marcador del usuario */}
        {showUserLocation && userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]} 
            icon={userIcon}
          >
            <Popup>
              <div className="map-popup">
                <h6><i className="bi bi-geo-alt-fill text-primary"></i> Tu ubicación</h6>
                <p className="mb-0 small">Coordenadas: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Marcadores de sucursales */}
        {branches.map(branch => (
          <Marker 
            key={branch.id}
            position={[branch.coordinates.lat, branch.coordinates.lng]}
            icon={branchIcon}
          >
            <Popup>
              <div className="map-popup">
                <h6 className="text-primary mb-2">
                  <i className="bi bi-shop"></i> {branch.name}
                </h6>
                <p className="mb-1 small">
                  <i className="bi bi-geo-alt"></i> {branch.address}
                </p>
                <p className="mb-1 small">
                  <i className="bi bi-telephone"></i> {branch.phone}
                </p>
                <p className="mb-1 small">
                  <i className="bi bi-clock"></i> {branch.hours}
                </p>
                
                {branch.distance && (
                  <div className="mt-2 pt-2 border-top">
                    <p className="mb-1 small">
                      <i className="bi bi-geo"></i> Distancia: <strong>{formatDistance(branch.distance)}</strong>
                    </p>
                    <p className="mb-1 small">
                      <i className="bi bi-truck"></i> Entrega: <strong>{formatDeliveryTime(branch.estimatedDeliveryTime)}</strong>
                    </p>
                  </div>
                )}
                
                <div className="mt-2">
                  <div className="d-flex flex-wrap gap-1">
                    {branch.features.map((feature, index) => (
                      <span key={index} className="badge bg-light text-dark small">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-top">
                  <div className="d-flex align-items-center">
                    <div className="rating-stars me-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <i 
                          key={i} 
                          className={`bi ${i < Math.floor(getRatingValue(branch.rating)) ? 'bi-star-fill' : 'bi-star'} text-warning small`}
                        ></i>
                      ))}
                    </div>
                    <span className="small">{getRatingValue(branch.rating)}</span>
                    <span className={`ms-2 badge ${branch.isOpen ? 'bg-success' : 'bg-danger'} small`}>
                      {branch.isOpen ? 'Abierto' : 'Cerrado'}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;

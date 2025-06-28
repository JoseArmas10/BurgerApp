import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GeolocationContext = createContext();

export const useGeolocation = () => {
  const context = useContext(GeolocationContext);
  if (!context) {
    throw new Error('useGeolocation must be used within a GeolocationProvider');
  }
  return context;
};

// Datos de sucursales simuladas
const branches = [
  {
    id: 1,
    name: "BurgerApp Centro",
    address: "Av. Principal 123, Centro",
    phone: "+1 (555) 123-4567",
    coordinates: { lat: 40.7128, lng: -74.0060 }, // Nueva York (ejemplo)
    hours: "Lun-Dom: 11:00 AM - 11:00 PM",
    features: ["Delivery", "Takeout", "Dine-in", "Drive-thru"],
    rating: 4.8,
    estimatedDeliveryTime: 25,
    isOpen: true
  },
  {
    id: 2,
    name: "BurgerApp Norte",
    address: "Calle Norte 456, Zona Norte",
    phone: "+1 (555) 234-5678",
    coordinates: { lat: 40.7589, lng: -73.9851 }, // Manhattan Norte
    hours: "Lun-Dom: 10:00 AM - 12:00 AM",
    features: ["Delivery", "Takeout", "Dine-in"],
    rating: 4.6,
    estimatedDeliveryTime: 30,
    isOpen: true
  },
  {
    id: 3,
    name: "BurgerApp Sur",
    address: "Av. Sur 789, Zona Sur",
    phone: "+1 (555) 345-6789",
    coordinates: { lat: 40.6782, lng: -73.9442 }, // Brooklyn
    hours: "Lun-Dom: 11:00 AM - 10:00 PM",
    features: ["Delivery", "Takeout", "24h Weekend"],
    rating: 4.7,
    estimatedDeliveryTime: 35,
    isOpen: true
  },
  {
    id: 4,
    name: "BurgerApp Este",
    address: "Blvd. Este 321, Zona Este",
    phone: "+1 (555) 456-7890",
    coordinates: { lat: 40.7505, lng: -73.9934 }, // Times Square
    hours: "Lun-Dom: 9:00 AM - 1:00 AM",
    features: ["Delivery", "Takeout", "Dine-in", "24h"],
    rating: 4.9,
    estimatedDeliveryTime: 20,
    isOpen: true
  }
];

// Función para calcular distancia entre dos coordenadas (fórmula Haversine)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Función para estimar tiempo de entrega basado en distancia
const estimateDeliveryTime = (distance) => {
  // Tiempo base: 15 minutos + 3 minutos por cada km
  const baseTime = 15;
  const timePerKm = 3;
  return Math.round(baseTime + (distance * timePerKm));
};

export const GeolocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('prompt');
  const [nearestBranch, setNearestBranch] = useState(null);
  const [branchesWithDistance, setBranchesWithDistance] = useState([]);

  // Solicitar ubicación del usuario
  const requestLocation = () => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setUserLocation(newLocation);
        setPermissionStatus('granted');
        setLocationLoading(false);
        calculateBranchDistances(newLocation);
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            setPermissionStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred';
            break;
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
        // Si no hay ubicación, usar ubicación por defecto (Centro de la ciudad)
        setDefaultLocation();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    );
  };

  // Calcular distancias a todas las sucursales
  const calculateBranchDistances = useCallback((location) => {
    const branchesWithDist = branches.map(branch => {
      const distance = calculateDistance(
        location.lat,
        location.lng,
        branch.coordinates.lat,
        branch.coordinates.lng
      );
      const deliveryTime = estimateDeliveryTime(distance);
      
      return {
        ...branch,
        distance: distance,
        estimatedDeliveryTime: deliveryTime
      };
    });

    // Ordenar por distancia
    branchesWithDist.sort((a, b) => a.distance - b.distance);
    setBranchesWithDistance(branchesWithDist);
    setNearestBranch(branchesWithDist[0]);
  }, []);

  // Usar ubicación por defecto
  const setDefaultLocation = useCallback(() => {
    const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // Nueva York centro
    setUserLocation(defaultLocation);
    calculateBranchDistances(defaultLocation);
  }, [calculateBranchDistances]);

  // Buscar sucursal más cercana
  const findNearestBranch = () => {
    if (userLocation) {
      calculateBranchDistances(userLocation);
    }
    return nearestBranch;
  };

  // Obtener todas las sucursales
  const getAllBranches = () => {
    return branches;
  };

  // Obtener sucursales ordenadas por distancia
  const getBranchesByDistance = () => {
    return branchesWithDistance;
  };

  // Verificar si delivery está disponible
  const isDeliveryAvailable = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    if (!branch) return false;
    
    // Delivery disponible si la sucursal está abierta y tiene el servicio
    return branch.isOpen && branch.features.includes('Delivery');
  };

  // Obtener tiempo estimado de entrega para una sucursal específica
  const getDeliveryTime = (branchId) => {
    const branch = branchesWithDistance.find(b => b.id === branchId);
    return branch ? branch.estimatedDeliveryTime : null;
  };

  // Inicializar en el primer render
  useEffect(() => {
    // Usar ubicación por defecto al inicio
    setDefaultLocation();
  }, [setDefaultLocation]);

  const value = {
    // Estado
    userLocation,
    locationError,
    locationLoading,
    permissionStatus,
    nearestBranch,
    branchesWithDistance,
    
    // Funciones
    requestLocation,
    setDefaultLocation,
    findNearestBranch,
    getAllBranches,
    getBranchesByDistance,
    isDeliveryAvailable,
    getDeliveryTime,
    calculateDistance,
    estimateDeliveryTime
  };

  return (
    <GeolocationContext.Provider value={value}>
      {children}
    </GeolocationContext.Provider>
  );
};

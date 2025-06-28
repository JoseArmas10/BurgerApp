import api from '../config/api';

// Order Services
export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create order' };
    }
  },

  // Get user orders
  getUserOrders: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.sort) queryParams.append('sort', filters.sort);

      const queryString = queryParams.toString();
      const url = queryString ? `/orders?${queryString}` : '/orders';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get orders' };
    }
  },

  // Get single order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get order' };
    }
  },

  // Update order status (for admin or specific updates)
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update order status' };
    }
  },

  // Cancel order
  cancelOrder: async (orderId, reason = '') => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel order' };
    }
  },

  // Get order tracking
  trackOrder: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/tracking`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to track order' };
    }
  },

  // Rate order
  rateOrder: async (orderId, rating, review = '') => {
    try {
      const response = await api.post(`/orders/${orderId}/rating`, { rating, review });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to rate order' };
    }
  }
};

// Location Services
export const locationService = {
  // Get all locations
  getLocations: async () => {
    try {
      const response = await api.get('/locations');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get locations' };
    }
  },

  // Get location by ID
  getLocationById: async (locationId) => {
    try {
      const response = await api.get(`/locations/${locationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get location' };
    }
  },

  // Find nearest location
  findNearestLocation: async (latitude, longitude) => {
    try {
      const response = await api.get(`/locations/nearest?lat=${latitude}&lng=${longitude}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to find nearest location' };
    }
  },

  // Calculate delivery time
  calculateDeliveryTime: async (fromLocationId, toLatitude, toLongitude) => {
    try {
      const response = await api.post('/locations/delivery-time', {
        fromLocationId,
        toLatitude,
        toLongitude
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to calculate delivery time' };
    }
  }
};

// Payment Services
export const paymentService = {
  // Create payment intent
  createPaymentIntent: async (amount, currency = 'usd', metadata = {}) => {
    try {
      const response = await api.post('/payments/create-intent', {
        amount,
        currency,
        metadata
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create payment intent' };
    }
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId, paymentMethodId) => {
    try {
      const response = await api.post('/payments/confirm', {
        paymentIntentId,
        paymentMethodId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to confirm payment' };
    }
  },

  // Get payment status
  getPaymentStatus: async (paymentIntentId) => {
    try {
      const response = await api.get(`/payments/status/${paymentIntentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get payment status' };
    }
  },

  // Process refund
  processRefund: async (paymentIntentId, amount = null, reason = '') => {
    try {
      const response = await api.post('/payments/refund', {
        paymentIntentId,
        amount,
        reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to process refund' };
    }
  }
};

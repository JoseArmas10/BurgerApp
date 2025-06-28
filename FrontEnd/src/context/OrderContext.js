import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { currentUser } = useAuth();

  // Cargar pedidos del usuario desde localStorage
  useEffect(() => {
    // Datos de ejemplo de pedidos
    const sampleOrders = [
      {
        id: 1,
        userId: 1,
        orderNumber: 'ORD-2024-001',
        date: '2024-06-25',
        status: 'delivered',
        total: 45.99,
        items: [
          {
            id: 1,
            name: 'Classic Burger',
            price: 12.99,
            quantity: 2,
            image: null
          },
          {
            id: 2,
            name: 'French Fries',
            price: 8.99,
            quantity: 1,
            image: null
          },
          {
            id: 3,
            name: 'Coca Cola',
            price: 3.99,
            quantity: 3,
            image: null
          }
        ],
        deliveryAddress: {
          street: '123 Main St',
          city: 'New York',
          zipCode: '10001',
          instructions: 'Ring doorbell twice'
        },
        paymentMethod: 'Credit Card',
        estimatedDelivery: '30-45 min',
        actualDelivery: '35 min'
      },
      {
        id: 2,
        userId: 1,
        orderNumber: 'ORD-2024-002',
        date: '2024-06-22',
        status: 'delivered',
        total: 28.50,
        items: [
          {
            id: 4,
            name: 'Chicken Burger',
            price: 14.99,
            quantity: 1,
            image: null
          },
          {
            id: 5,
            name: 'Onion Rings',
            price: 6.99,
            quantity: 1,
            image: null
          },
          {
            id: 6,
            name: 'Milkshake',
            price: 6.52,
            quantity: 1,
            image: null
          }
        ],
        deliveryAddress: {
          street: '123 Main St',
          city: 'New York',
          zipCode: '10001',
          instructions: 'Leave at door'
        },
        paymentMethod: 'PayPal',
        estimatedDelivery: '25-35 min',
        actualDelivery: '28 min'
      },
      {
        id: 3,
        userId: 1,
        orderNumber: 'ORD-2024-003',
        date: '2024-06-28',
        status: 'preparing',
        total: 35.75,
        items: [
          {
            id: 7,
            name: 'BBQ Burger',
            price: 15.99,
            quantity: 1,
            image: null
          },
          {
            id: 8,
            name: 'Sweet Potato Fries',
            price: 9.99,
            quantity: 1,
            image: null
          },
          {
            id: 9,
            name: 'Iced Tea',
            price: 4.99,
            quantity: 2,
            image: null
          }
        ],
        deliveryAddress: {
          street: '123 Main St',
          city: 'New York',
          zipCode: '10001',
          instructions: 'Call when arrived'
        },
        paymentMethod: 'Credit Card',
        estimatedDelivery: '40-50 min',
        actualDelivery: null
      }
    ];

    if (currentUser) {
      const savedOrders = localStorage.getItem(`orders_${currentUser.id}`);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        // Si no hay pedidos guardados, usar los de ejemplo
        const userOrders = sampleOrders.filter(order => order.userId === currentUser.id);
        setOrders(userOrders);
        localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(userOrders));
      }
    } else {
      setOrders([]);
    }
  }, [currentUser]);

  // Guardar pedidos en localStorage cuando cambien
  useEffect(() => {
    if (currentUser && orders.length > 0) {
      localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(orders));
    }
  }, [orders, currentUser]);

  const addOrder = (orderData) => {
    if (!currentUser) return;

    const newOrder = {
      id: Date.now(),
      userId: currentUser.id,
      orderNumber: `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'preparing',
      ...orderData
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status }
          : order
      )
    );
  };

  const reorder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    const newOrder = {
      ...order,
      id: Date.now(),
      orderNumber: `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'preparing',
      actualDelivery: null
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    return {
      totalOrders,
      totalSpent,
      averageOrderValue,
      deliveredOrders: orders.filter(o => o.status === 'delivered').length,
      pendingOrders: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length
    };
  };

  const value = {
    orders,
    addOrder,
    updateOrderStatus,
    reorder,
    getOrdersByStatus,
    getOrderStats
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

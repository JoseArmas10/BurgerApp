import React, { createContext, useContext, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type, // success, error, warning, info
      duration
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message) => addToast(message, 'success');
  const showError = (message) => addToast(message, 'error');
  const showWarning = (message) => addToast(message, 'warning');
  const showInfo = (message) => addToast(message, 'info');

  const getToastVariant = (type) => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'success';
    }
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'success': return 'bi-check-circle-fill';
      case 'error': return 'bi-x-circle-fill';
      case 'warning': return 'bi-exclamation-triangle-fill';
      case 'info': return 'bi-info-circle-fill';
      default: return 'bi-check-circle-fill';
    }
  };

  return (
    <ToastContext.Provider value={{
      addToast,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
      
      {/* Toast Container */}
      <ToastContainer 
        position="top-end" 
        className="p-3"
        style={{ 
          position: 'fixed', 
          zIndex: 9999,
          top: '80px' 
        }}
      >
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            bg={getToastVariant(toast.type)}
            onClose={() => removeToast(toast.id)}
            show={true}
            delay={toast.duration}
            autohide={false}
            className="toast-notification"
          >
            <Toast.Header closeButton={true}>
              <i className={`bi ${getToastIcon(toast.type)} me-2`}></i>
              <strong className="me-auto">
                {toast.type === 'success' && 'Éxito'}
                {toast.type === 'error' && 'Error'}
                {toast.type === 'warning' && 'Advertencia'}
                {toast.type === 'info' && 'Información'}
              </strong>
            </Toast.Header>
            <Toast.Body className={toast.type === 'success' || toast.type === 'info' ? 'text-white' : ''}>
              {toast.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

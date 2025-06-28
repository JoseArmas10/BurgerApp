import React from 'react';
import { Spinner } from 'react-bootstrap';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary', 
  center = true,
  overlay = false,
  text = 'Cargando...'
}) => {
  const getSpinnerSize = () => {
    switch (size) {
      case 'sm': return { width: '1rem', height: '1rem' };
      case 'lg': return { width: '3rem', height: '3rem' };
      case 'xl': return { width: '4rem', height: '4rem' };
      default: return { width: '2rem', height: '2rem' };
    }
  };

  const spinnerElement = (
    <div className={`loading-spinner ${center ? 'loading-center' : ''}`}>
      <Spinner 
        animation="border" 
        variant={variant}
        style={getSpinnerSize()}
        className="mb-2"
      />
      {text && <div className="loading-text">{text}</div>}
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        <div className="loading-overlay-content">
          {spinnerElement}
        </div>
      </div>
    );
  }

  return spinnerElement;
};

export default LoadingSpinner;

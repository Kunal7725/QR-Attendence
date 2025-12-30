import React from 'react';
import '../css/ui/Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false,
  type = 'button',
  className = '',
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`ui-button ${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
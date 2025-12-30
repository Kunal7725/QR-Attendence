import React from 'react';
import '../css/ui/Card.css';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  actions, 
  footer, 
  variant, 
  className = '', 
  loading = false,
  ...props 
}) => {
  const cardClasses = [
    'ui-card',
    variant && variant,
    loading && 'loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {(title || subtitle || actions) && (
        <div className="ui-card-header">
          <div>
            {title && <h3 className="ui-card-title">{title}</h3>}
            {subtitle && <p className="ui-card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="ui-card-actions">{actions}</div>}
        </div>
      )}
      
      <div className="ui-card-body">
        {children}
      </div>
      
      {footer && (
        <div className="ui-card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

// Stat Card component for dashboard metrics
export const StatCard = ({ 
  icon, 
  value, 
  label, 
  change, 
  changeType, 
  variant,
  className = '' 
}) => {
  return (
    <Card variant={variant} className={`stat-card ${className}`}>
      {icon && <span className="stat-card-icon">{icon}</span>}
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
      {change && (
        <div className={`stat-card-change ${changeType || ''}`}>
          {change}
        </div>
      )}
    </Card>
  );
};

export default Card;
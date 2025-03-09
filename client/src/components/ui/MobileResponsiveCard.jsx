import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/animations.css';

/**
 * A responsive card component optimized for mobile and desktop with animations
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.animate - Whether to animate the card on mount
 * @param {boolean} props.hover - Whether to apply hover effects
 * @param {string} props.variant - Card variant (default, blood, donor)
 */
const MobileResponsiveCard = ({ 
  children, 
  className = '', 
  animate = false,
  hover = true,
  variant = 'default'
}) => {
  // Define variant-specific classes
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    blood: 'bg-white border border-red-200',
    donor: 'bg-white border border-blue-200',
    primary: 'bg-primary text-white border border-primary-dark',
    secondary: 'bg-secondary text-white border border-secondary-dark'
  };

  // Combine all classes
  const cardClasses = `
    rounded-lg 
    shadow-sm
    overflow-hidden
    transition-all duration-300
    ${animate ? 'animate-fade-in' : ''}
    ${hover ? 'hover-lift' : ''}
    ${variantClasses[variant] || variantClasses.default}
    p-4 sm:p-6
    ${className}
  `;

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
};

MobileResponsiveCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  animate: PropTypes.bool,
  hover: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'blood', 'donor', 'primary', 'secondary'])
};

export default MobileResponsiveCard; 
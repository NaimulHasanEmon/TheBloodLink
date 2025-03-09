import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/animations.css';

/**
 * A responsive button component optimized for mobile and desktop with animations
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {string} props.variant - Button variant (primary, secondary, outline, text)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.animate - Whether to animate the button
 * @param {string} props.animationType - Type of animation (pulse, heartbeat, none)
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {string} props.type - Button type (button, submit, reset)
 */
const MobileResponsiveButton = ({ 
  children, 
  className = '', 
  onClick,
  fullWidth = false,
  variant = 'primary',
  size = 'md',
  animate = false,
  animationType = 'none',
  disabled = false,
  type = 'button'
}) => {
  // Define variant-specific classes
  const variantClasses = {
    primary: 'bg-primary hover:bg-blood-dark text-white',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white',
    outline: 'bg-transparent border border-primary text-primary hover:bg-primary/5',
    text: 'bg-transparent text-primary hover:bg-primary/5',
    donate: 'bg-primary hover:bg-blood-dark text-white donate-button-pulse'
  };

  // Define size-specific classes
  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3 rounded',
    md: 'text-sm py-2 px-4 rounded-md',
    lg: 'text-base py-2.5 px-5 rounded-lg'
  };

  // Define animation classes
  const animationClasses = {
    none: '',
    pulse: 'animate-pulse-gentle',
    heartbeat: 'animate-heartbeat',
    drip: 'animate-blood-drip'
  };

  // Combine all classes
  const buttonClasses = `
    font-medium
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-primary/50
    active:scale-95
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover-pulse'}
    ${fullWidth ? 'w-full' : ''}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${animate ? animationClasses[animationType] || '' : ''}
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

MobileResponsiveButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  fullWidth: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text', 'donate']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  animate: PropTypes.bool,
  animationType: PropTypes.oneOf(['none', 'pulse', 'heartbeat', 'drip']),
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default MobileResponsiveButton; 
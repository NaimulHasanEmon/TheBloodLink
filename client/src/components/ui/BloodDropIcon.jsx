import React from 'react';
import PropTypes from 'prop-types';
import { FaTint } from 'react-icons/fa';
import '../../styles/animations.css';

/**
 * An animated blood drop icon component
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Icon size (sm, md, lg, xl)
 * @param {string} props.color - Icon color (primary, secondary, white, gray)
 * @param {boolean} props.animate - Whether to animate the icon
 * @param {string} props.animationType - Type of animation (pulse, drip, heartbeat)
 */
const BloodDropIcon = ({ 
  className = '', 
  size = 'md',
  color = 'primary',
  animate = false,
  animationType = 'drip'
}) => {
  // Define size-specific classes
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  // Define color-specific classes
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    white: 'text-white',
    gray: 'text-gray-500'
  };

  // Define animation classes
  const animationClasses = {
    pulse: 'animate-pulse-gentle',
    drip: 'animate-blood-drip',
    heartbeat: 'animate-heartbeat'
  };

  // Combine all classes
  const iconClasses = `
    ${sizeClasses[size] || sizeClasses.md}
    ${colorClasses[color] || colorClasses.primary}
    ${animate ? animationClasses[animationType] || animationClasses.drip : ''}
    ${className}
  `;

  return (
    <div className={`inline-flex ${animate ? 'transform-gpu' : ''}`}>
      <FaTint className={iconClasses} />
    </div>
  );
};

BloodDropIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'white', 'gray']),
  animate: PropTypes.bool,
  animationType: PropTypes.oneOf(['pulse', 'drip', 'heartbeat'])
};

export default BloodDropIcon; 
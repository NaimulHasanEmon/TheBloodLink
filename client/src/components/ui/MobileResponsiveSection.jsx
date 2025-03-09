import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/animations.css';

/**
 * A responsive section component optimized for mobile and desktop with animations
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Section content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.id - Section ID for navigation
 * @param {boolean} props.fullWidth - Whether the section should take full width
 * @param {string} props.background - Background style (white, light, dark, blood, gradient)
 * @param {string} props.padding - Padding size (none, sm, md, lg)
 * @param {boolean} props.animate - Whether to animate the section
 */
const MobileResponsiveSection = ({ 
  children, 
  className = '', 
  id,
  fullWidth = false,
  background = 'white',
  padding = 'md',
  animate = false
}) => {
  // Define background-specific classes
  const backgroundClasses = {
    white: 'bg-white',
    light: 'bg-gray-50',
    dark: 'bg-neutral text-white',
    blood: 'bg-primary/5',
    gradient: 'blood-wave-bg text-white'
  };

  // Define padding-specific classes
  const paddingClasses = {
    none: '',
    sm: 'py-4 sm:py-6',
    md: 'py-8 sm:py-12',
    lg: 'py-12 sm:py-16 md:py-20'
  };

  // Combine all classes
  const sectionClasses = `
    w-full
    ${backgroundClasses[background] || backgroundClasses.white}
    ${paddingClasses[padding] || paddingClasses.md}
    ${animate ? 'animate-fade-in' : ''}
    ${className}
  `;

  // Container classes
  const containerClasses = `
    px-4 sm:px-6 lg:px-8
    mx-auto
    ${fullWidth ? '' : 'max-w-7xl'}
  `;

  return (
    <section id={id} className={sectionClasses}>
      <div className={containerClasses}>
        {children}
      </div>
    </section>
  );
};

MobileResponsiveSection.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  fullWidth: PropTypes.bool,
  background: PropTypes.oneOf(['white', 'light', 'dark', 'blood', 'gradient']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  animate: PropTypes.bool
};

export default MobileResponsiveSection; 
import React from 'react';

/**
 * A responsive container component that provides consistent padding and max-width
 * across different screen sizes.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.fluid - Whether the container should be fluid (full width)
 * @param {string} props.as - HTML element to render as (default: 'div')
 */
const ResponsiveContainer = ({ 
  children, 
  className = '', 
  fluid = false, 
  as: Component = 'div' 
}) => {
  return (
    <Component
      className={`
        w-full 
        px-4 sm:px-6 lg:px-8 
        mx-auto 
        ${fluid ? '' : 'max-w-7xl'} 
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

export default ResponsiveContainer; 
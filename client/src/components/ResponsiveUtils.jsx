import React from 'react';

/**
 * A responsive container component that provides consistent padding and max-width
 * across different screen sizes.
 */
export const ResponsiveContainer = ({ children, className = '', fluid = false }) => {
  return (
    <div
      className={`
        w-full 
        px-4 sm:px-6 lg:px-8 
        mx-auto 
        ${fluid ? '' : 'max-w-7xl'} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

/**
 * A responsive grid component that adapts to different screen sizes.
 */
export const ResponsiveGrid = ({ 
  children, 
  className = '', 
  cols = 1,
  sm = 1,
  md = 2,
  lg = 3,
  xl = 4,
  gap = 4
}) => {
  return (
    <div
      className={`
        grid 
        grid-cols-${cols}
        sm:grid-cols-${sm}
        md:grid-cols-${md}
        lg:grid-cols-${lg}
        xl:grid-cols-${xl}
        gap-${gap} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

/**
 * A responsive section component with proper spacing.
 */
export const ResponsiveSection = ({ children, className = '', id }) => {
  return (
    <section
      id={id}
      className={`
        py-8 sm:py-12 md:py-16 lg:py-20
        ${className}
      `}
    >
      {children}
    </section>
  );
};

/**
 * A responsive heading component that adjusts size based on screen width.
 */
export const ResponsiveHeading = ({ 
  children, 
  className = '', 
  as: Component = 'h2',
  size = 'lg' // 'sm', 'md', 'lg', 'xl', '2xl'
}) => {
  const sizeClasses = {
    sm: 'text-lg sm:text-xl md:text-2xl',
    md: 'text-xl sm:text-2xl md:text-3xl',
    lg: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
    xl: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
    '2xl': 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'
  };

  return (
    <Component
      className={`
        font-bold
        ${sizeClasses[size] || sizeClasses.lg}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

/**
 * A responsive flex container that adjusts direction based on screen size.
 */
export const ResponsiveFlex = ({
  children,
  className = '',
  direction = 'col', // 'row', 'col', 'row-reverse', 'col-reverse'
  mdDirection,
  lgDirection,
  gap = 4,
  align = 'start', // 'start', 'center', 'end', 'stretch'
  justify = 'start' // 'start', 'center', 'end', 'between', 'around', 'evenly'
}) => {
  // Generate direction classes
  const getDirectionClass = () => {
    const baseClass = `flex-${direction}`;
    const mdClass = mdDirection ? `md:flex-${mdDirection}` : '';
    const lgClass = lgDirection ? `lg:flex-${lgDirection}` : '';
    
    return `${baseClass} ${mdClass} ${lgClass}`;
  };

  // Generate alignment classes
  const getAlignClass = () => {
    return `items-${align}`;
  };

  // Generate justify classes
  const getJustifyClass = () => {
    return `justify-${justify}`;
  };

  return (
    <div
      className={`
        flex 
        ${getDirectionClass()} 
        ${getAlignClass()} 
        ${getJustifyClass()} 
        gap-${gap} 
        ${className}
      `}
    >
      {children}
    </div>
  );
}; 
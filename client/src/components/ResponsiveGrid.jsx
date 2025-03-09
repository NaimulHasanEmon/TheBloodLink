import React from 'react';

/**
 * A responsive grid component that adapts to different screen sizes.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.cols - Default number of columns (1-12)
 * @param {number} props.smCols - Number of columns on small screens
 * @param {number} props.mdCols - Number of columns on medium screens
 * @param {number} props.lgCols - Number of columns on large screens
 * @param {number} props.xlCols - Number of columns on extra large screens
 * @param {number} props.gap - Gap size (1-12)
 */
const ResponsiveGrid = ({ 
  children, 
  className = '', 
  cols = 1, 
  smCols, 
  mdCols, 
  lgCols, 
  xlCols,
  gap = 4
}) => {
  // Generate grid columns classes
  const getColsClass = () => {
    const baseClass = `grid-cols-${cols}`;
    const smClass = smCols ? `sm:grid-cols-${smCols}` : '';
    const mdClass = mdCols ? `md:grid-cols-${mdCols}` : '';
    const lgClass = lgCols ? `lg:grid-cols-${lgCols}` : '';
    const xlClass = xlCols ? `xl:grid-cols-${xlCols}` : '';
    
    return `${baseClass} ${smClass} ${mdClass} ${lgClass} ${xlClass}`;
  };

  return (
    <div
      className={`
        grid 
        ${getColsClass()} 
        gap-${gap} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
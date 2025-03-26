import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaExpandAlt, FaTimes } from 'react-icons/fa';

const SearchCounter = () => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const counterRef = useRef(null);
  const dragHandleRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const initialPositionRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragStartTimeRef = useRef(0);
  const hasMoved = useRef(false);
  
  // Define constant for navbar height (adjust as needed)
  const NAVBAR_HEIGHT = 0; // For mobile
  const NAVBAR_HEIGHT_SM = 0; // For small screens
  const NAVBAR_HEIGHT_MD = 0; // For medium+ screens

  useEffect(() => {
    // Get initial count from localStorage
    const savedCount = localStorage.getItem('searchCount');
    if (savedCount) {
      setCount(parseInt(savedCount));
    }

    // Listen for search count updates
    const handleSearchCountUpdate = () => {
      const newCount = parseInt(localStorage.getItem('searchCount') || '0');
      setCount(newCount);
    };

    window.addEventListener('searchCountUpdated', handleSearchCountUpdate);

    // Cleanup event listener
    return () => {
      window.removeEventListener('searchCountUpdated', handleSearchCountUpdate);
    };
  }, []);

  // Helper function to constrain position within viewport
  const constrainToViewport = (x, y) => {
    if (!counterRef.current) return { x, y };
    
    const counterRect = counterRef.current.getBoundingClientRect();
    const counterWidth = counterRect.width;
    const counterHeight = counterRect.height;
    
    // Get window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Get navbar height based on screen size
    let navbarHeight = NAVBAR_HEIGHT;
    if (windowWidth >= 768) { // md breakpoint in Tailwind
      navbarHeight = NAVBAR_HEIGHT_MD;
    } else if (windowWidth >= 640) { // sm breakpoint in Tailwind
      navbarHeight = NAVBAR_HEIGHT_SM;
    }
    
    // Calculate minimum and maximum allowed positions
    // Left: Don't let left edge go beyond 5px from left edge of screen
    // Right: Don't let right edge go beyond 5px from right edge of screen
    // Top: Don't let top edge go above navbar height + 5px buffer
    // Bottom: Don't let bottom edge go beyond 5px from bottom of screen
    const minX = 5;
    const maxX = windowWidth - counterWidth - 5;
    const minY = navbarHeight + 5;
    const maxY = windowHeight - counterHeight - 5;
    
    // Constrain x and y within bounds
    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y))
    };
  };

  // Handle click on search icon (for both dragging and expanding)
  const handleSearchIconClick = (e) => {
    // Prevent default to avoid any unwanted behaviors
    if (e) e.preventDefault();
    
    if (isMinimized) {
      setIsMinimized(false);
    }
  };

  // Optimized dragging with direct DOM manipulation for better performance
  const handleMouseDown = (e) => {
    if (!counterRef.current || !dragHandleRef.current) return;
    
    // Only initiate drag if the event came from the search icon
    if (!dragHandleRef.current.contains(e.target)) return;
    
    // Store the time when dragging started
    dragStartTimeRef.current = Date.now();
    hasMoved.current = false;
    
    setIsDragging(true);
    
    // Store the initial position before this drag starts
    initialPositionRef.current = { 
      x: positionRef.current.x,
      y: positionRef.current.y
    };
    
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY
    };
    
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    if (!counterRef.current || !dragHandleRef.current) return;
    
    // Check if touch started on the search icon
    const touch = e.touches[0];
    const touchTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!dragHandleRef.current.contains(touchTarget)) return;
    
    // Store the time when dragging started
    dragStartTimeRef.current = Date.now();
    hasMoved.current = false;
    
    setIsDragging(true);
    
    // Store the initial position before this drag starts
    initialPositionRef.current = { 
      x: positionRef.current.x,
      y: positionRef.current.y
    };
    
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !counterRef.current) return;
    
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    
    // Calculate distance moved
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If moved more than 5px, consider it a drag
    if (distance > 5) {
      hasMoved.current = true;
      
      // Direct DOM manipulation for instant updates
      // Add the delta to the initial position
      const newX = initialPositionRef.current.x + dx;
      const newY = initialPositionRef.current.y + dy;
      counterRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !counterRef.current) return;
    
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    
    // Calculate distance moved
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If moved more than 5px, consider it a drag
    if (distance > 5) {
      hasMoved.current = true;
      
      // Direct DOM manipulation for instant updates
      // Add the delta to the initial position
      const newX = initialPositionRef.current.x + dx;
      const newY = initialPositionRef.current.y + dy;
      counterRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
    }
  };

  const handleMouseUp = (e) => {
    if (isDragging && counterRef.current) {
      if (hasMoved.current) {
        // After drag is complete, update the position
        const newStyle = window.getComputedStyle(counterRef.current);
        const matrix = new DOMMatrixReadOnly(newStyle.transform);
        
        positionRef.current = {
          x: matrix.m41,
          y: matrix.m42
        };
        
        // If we moved it, don't expand
      } else {
        // This was a click (not a drag) - revert to stored position
        counterRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
        
        // Only if it was a pure click (no movement) and minimized, expand it
        const dragDuration = Date.now() - dragStartTimeRef.current;
        if (dragDuration < 200 && isMinimized && !hasMoved.current) {
          handleSearchIconClick(e);
        }
      }
    }
    
    setIsDragging(false);
  };

  const handleTouchEnd = (e) => {
    if (isDragging && counterRef.current) {
      if (hasMoved.current) {
        // After drag is complete, update the position
        const newStyle = window.getComputedStyle(counterRef.current);
        const matrix = new DOMMatrixReadOnly(newStyle.transform);
        
        positionRef.current = {
          x: matrix.m41,
          y: matrix.m42
        };
        
        // If we moved it, don't expand
      } else {
        // This was a tap (not a drag) - revert to stored position
        counterRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
        
        // Only if it was a pure tap (no movement) and minimized, expand it
        const dragDuration = Date.now() - dragStartTimeRef.current;
        if (dragDuration < 200 && isMinimized && !hasMoved.current) {
          handleSearchIconClick();
        }
      }
    }
    
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isMinimized]);

  if (!isVisible) return null;

  return (
    <div 
      ref={counterRef}
      className={`fixed top-20 left-4 z-50 sm:left-8 md:left-12 transition-opacity duration-200 ${isDragging ? 'opacity-80' : 'opacity-100'}`}
      style={{ 
        transform: `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`,
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div 
        className={`bg-white shadow-lg rounded-full flex items-center transition-all duration-300 ease-in-out ${
          isMinimized 
            ? 'w-10 h-10 justify-center p-0' 
            : 'px-3 py-2 gap-2 text-sm border border-red-200'
        }`}
      >
        <div 
          ref={dragHandleRef}
          className={`bg-primary text-white rounded-full flex items-center justify-center transition-all duration-300 cursor-move ${
            isMinimized ? 'p-2.5 w-full h-full' : 'p-1.5'
          }`}
        >
          <FaSearch className={`transition-all duration-300 ${isMinimized ? 'text-sm' : 'text-xs'}`} />
        </div>
        
        {!isMinimized && (
          <>
            <span className="font-bold text-primary text-base pointer-events-none">{count}</span>
            <span className="text-gray-600 text-xs pointer-events-none">searches</span>
            <button 
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-gray-600 ml-1 p-1.5 flex items-center justify-center"
              aria-label="Minimize search counter"
            >
              <FaTimes className="text-base" />
            </button>
          </>
        )}
        
        {isMinimized && (
          <button 
            onClick={() => setIsMinimized(false)}
            className="absolute -top-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center border border-red-200 hover:bg-red-50"
            aria-label="Expand search counter"
          >
            <FaExpandAlt className="text-xs text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchCounter;

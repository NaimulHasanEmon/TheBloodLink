import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaExpandAlt, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const SearchCounter = () => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const counterRef = useRef(null);
  const dragHandleRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const initialPositionRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragStartTimeRef = useRef(0);
  const hasMoved = useRef(false);
  
  // Define constant for navbar height (adjust as needed)
  const NAVBAR_HEIGHT = 64; // For mobile
  const NAVBAR_HEIGHT_SM = 70; // For small screens
  const NAVBAR_HEIGHT_MD = 76; // For medium+ screens
  const PADDING = 4; // Gap from navbar and edges

  const fetchSearchCount = async () => {
    try {
      setError(null);
      console.log('Fetching search count from API:', `${API_URL}/search-count`);
      const response = await axios.get(`${API_URL}/search-count`);
      console.log('Search count response:', response.data);
      setCount(response.data.count);
    } catch (err) {
      console.error('Error fetching search count:', err);
      setError('Failed to load count');
      // Fallback to localStorage as a temporary measure
      const savedCount = localStorage.getItem('searchCount');
      if (savedCount) {
        setCount(parseInt(savedCount));
      }
    }
  };

  // Function to reset position to default top-left
  const resetPosition = () => {
    if (counterRef.current) {
      // Default is left side, just below navbar
      positionRef.current = { x: PADDING, y: NAVBAR_HEIGHT + PADDING };
      counterRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
      localStorage.removeItem('searchCounterPosition');
    }
  };

  useEffect(() => {
    // Get initial count from server
    fetchSearchCount();

    // Listen for search count updates
    const handleSearchCountUpdate = () => {
      fetchSearchCount();
    };

    window.addEventListener('searchCountUpdated', handleSearchCountUpdate);

    // Set up polling to refresh count every minute
    const intervalId = setInterval(fetchSearchCount, 60000);
    
    // Initial positioning check - run once after component is mounted and element is available
    const initializePosition = () => {
      if (counterRef.current) {
        // Get the saved position from localStorage, if any
        const savedPosition = localStorage.getItem('searchCounterPosition');
        
        if (savedPosition) {
          try {
            const position = JSON.parse(savedPosition);
            // Apply constraints to the saved position
            const constrained = constrainToViewport(position.x, position.y);
            positionRef.current = constrained;
            counterRef.current.style.transform = `translate(${constrained.x}px, ${constrained.y}px)`;
          } catch (e) {
            console.error('Error parsing saved position:', e);
            // If there's an error, reset to default position
            resetPosition();
          }
        } else {
          // No saved position, use default top-left position
          resetPosition();
        }
      }
    };
    
    // Add window resize handler to ensure the counter stays within bounds when window is resized
    const handleResize = () => {
      if (counterRef.current) {
        const constrained = constrainToViewport(positionRef.current.x, positionRef.current.y);
        if (constrained.x !== positionRef.current.x || constrained.y !== positionRef.current.y) {
          positionRef.current = constrained;
          counterRef.current.style.transform = `translate(${constrained.x}px, ${constrained.y}px)`;
          // Save updated position
          localStorage.setItem('searchCounterPosition', JSON.stringify(constrained));
        }
      }
    };
    
    // Run the initialization after a short delay to ensure the component is rendered
    const timerId = setTimeout(initializePosition, 100);
    
    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listeners and timers
    return () => {
      window.removeEventListener('searchCountUpdated', handleSearchCountUpdate);
      window.removeEventListener('resize', handleResize);
      clearInterval(intervalId);
      clearTimeout(timerId);
    };
  }, []);

  // Helper function to constrain position within viewport
  const constrainToViewport = (x, y) => {
    if (!counterRef.current) return { x, y };
    
    const counterRect = counterRef.current.getBoundingClientRect();
    const counterWidth = counterRect.width;
    const counterHeight = counterRect.height;
    
    // For right side constraints, use the search icon's width when minimized
    const effectiveWidth = isMinimized ? 
      dragHandleRef.current?.getBoundingClientRect().width || 40 : 
      counterWidth;
    
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
    // Left: Don't let left edge go beyond padding from left edge of screen
    // Right: Don't let right edge go beyond padding from right edge of screen (adjust for minimized state)
    // Top: Don't let top edge go above navbar height + padding buffer
    // Bottom: Don't let bottom edge go beyond padding from bottom of screen
    const minX = PADDING;
    const maxX = windowWidth - effectiveWidth - PADDING;
    const minY = navbarHeight + PADDING;
    const maxY = windowHeight - counterHeight - PADDING;
    
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
    
    // No additional checks, just direct position update for maximum speed
    counterRef.current.style.transform = `translate(${
      initialPositionRef.current.x + (e.clientX - dragStartRef.current.x)
    }px, ${
      initialPositionRef.current.y + (e.clientY - dragStartRef.current.y)
    }px)`;
    
    // Set hasMoved without conditions
    hasMoved.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !counterRef.current) return;
    
    // Prevent default to stop scrolling
    e.preventDefault();
    
    // No additional checks, just direct position update for maximum speed
    counterRef.current.style.transform = `translate(${
      initialPositionRef.current.x + (e.touches[0].clientX - dragStartRef.current.x)
    }px, ${
      initialPositionRef.current.y + (e.touches[0].clientY - dragStartRef.current.y)
    }px)`;
    
    // Set hasMoved without conditions
    hasMoved.current = true;
  };

  const handleMouseUp = (e) => {
    if (isDragging && counterRef.current) {
      if (hasMoved.current) {
        // After drag is complete, update the position
        const newStyle = window.getComputedStyle(counterRef.current);
        const matrix = new DOMMatrixReadOnly(newStyle.transform);
        
        // Apply constraints to final position
        const constrained = constrainToViewport(matrix.m41, matrix.m42);
        positionRef.current = constrained;
        
        // Update to constrained position
        counterRef.current.style.transform = `translate(${constrained.x}px, ${constrained.y}px)`;
        
        // Save position to localStorage
        localStorage.setItem('searchCounterPosition', JSON.stringify(constrained));
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
        
        // Apply constraints to final position
        const constrained = constrainToViewport(matrix.m41, matrix.m42);
        positionRef.current = constrained;
        
        // Update to constrained position
        counterRef.current.style.transform = `translate(${constrained.x}px, ${constrained.y}px)`;
        
        // Save position to localStorage
        localStorage.setItem('searchCounterPosition', JSON.stringify(constrained));
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
      document.addEventListener('mousemove', handleMouseMove, { passive: true, capture: true });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
      document.addEventListener('touchend', handleTouchEnd);
    } else {
      document.removeEventListener('mousemove', handleMouseMove, { passive: true, capture: true });
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
      document.removeEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove, { passive: true, capture: true });
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isMinimized]);

  // Handle double-click to reset position
  const handleDoubleClick = () => {
    resetPosition();
  };

  // Add effect to disable transitions during drag
  useEffect(() => {
    if (counterRef.current) {
      if (isDragging) {
        // Disable all transitions during drag for maximum performance
        counterRef.current.style.transition = 'none';
      } else {
        // Re-enable transitions when not dragging
        counterRef.current.style.transition = '';
      }
    }
  }, [isDragging]);

  if (!isVisible) return null;

  return (
    <div 
      ref={counterRef}
      className={`fixed z-50 transition-all duration-200 ${isDragging ? 'opacity-80' : 'opacity-100'}`}
      style={{ 
        transform: `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`,
        touchAction: 'none',
        backgroundColor: 'white',
        borderRadius: '9999px'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDoubleClick={handleDoubleClick}
      title="Double-click to reset position"
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
            {error && <span className="text-red-500 text-xs ml-1">!</span>}
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

import { useState, useEffect } from 'react';

interface AnimatedUnderlineProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

export const AnimatedUnderline = ({ children, className = "", isActive = false }: AnimatedUnderlineProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative inline-block cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {/* Sketched underline using SVG path */}
      <div
        className={`absolute -bottom-1 left-0 w-full h-2 transition-all duration-300 ${
          isHovered || isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`}
        style={{
          transformOrigin: 'left center',
          transitionProperty: 'opacity, transform',
        }}
      >
        <svg 
          width="100%" 
          height="8" 
          viewBox="0 0 100 8" 
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          <path
            d="M 0,4 Q 10,2 20,4 T 40,4 T 60,4 T 80,4 T 100,4"
            stroke="#3b82f6"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
            style={{
              filter: 'drop-shadow(0 1px 2px rgba(59, 130, 246, 0.2))',
            }}
          />
          {/* Add slight roughness with a second path */}
          <path
            d="M 2,5 Q 12,3 22,5 T 42,5 T 62,5 T 82,5 T 98,5"
            stroke="#3b82f6"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
        </svg>
      </div>
    </div>
  );
};

interface CustomArrowProps {
  direction?: 'right' | 'down' | 'left' | 'up';
  className?: string;
  animated?: boolean;
}

export const CustomArrow = ({ 
  direction = 'right', 
  className = "", 
  animated = true 
}: CustomArrowProps) => {
  const getRotation = () => {
    switch (direction) {
      case 'down': return 'rotate-90';
      case 'left': return 'rotate-180';
      case 'up': return 'rotate-270';
      default: return 'rotate-0';
    }
  };

  return (
    <div className={`inline-block ${className}`}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={`${getRotation()} text-blue-600 ${animated ? 'hover:translate-x-1 transition-transform' : ''}`}
      >
        <path
          d="M5 12h14m-7-7l7 7-7 7"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const FloatingElement = ({ 
  children, 
  delay = 0, 
  className = "" 
}: FloatingElementProps) => {
  // Remove floating animation, just return children with optional delay
  return (
    <div 
      className={className}
      style={{
        opacity: 1,
        transform: 'none',
      }}
    >
      {children}
    </div>
  );
};
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
      
      {/* Simple underline that respects reduced motion */}
      <div
        className={`absolute -bottom-1 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${
          isHovered || isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
        }`}
        style={{
          transitionProperty: 'width, opacity',
        }}
      />
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
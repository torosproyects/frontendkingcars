import React from 'react';

interface ValidationLabelProps {
  show: boolean;
  message: string;
  className?: string;
}

export const ValidationLabel: React.FC<ValidationLabelProps> = ({ 
  show, 
  message, 
  className = '' 
}) => {
  if (!show) return null;

  return (
    <div 
      className={`text-xs text-white bg-red-500 px-2 py-1 rounded-md mb-1 transition-all duration-200 ${className}`}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(-5px)'
      }}
    >
      {message}
    </div>
  );
};

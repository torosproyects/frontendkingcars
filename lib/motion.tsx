// Simple motion library shim to avoid installing framer-motion
// In a production app, you would replace this with:
// import { motion } from "framer-motion";

import { ReactNode, HTMLAttributes, ButtonHTMLAttributes, forwardRef } from "react";

export interface MotionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  initial?: any;
  animate?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
}

export interface MotionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  initial?: any;
  animate?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
}

// Create a simple motion div component
const MotionDiv = forwardRef<HTMLDivElement, MotionProps>(
  ({ children, className, style, initial, animate, transition, ...props }, ref) => {
    // Only apply transition if animation props are provided
    const shouldAnimate = initial || animate || transition;
    
    return (
      <div 
        ref={ref} 
        className={className} 
        style={{ 
          ...style,
          ...(shouldAnimate && {
            transition: transition?.duration ? `opacity ${transition.duration}s ease-out, transform ${transition.duration}s ease-out` : "opacity 0.3s ease-out, transform 0.3s ease-out",
          }),
        }}
      >
        {children}
      </div>
    );
  }
);
MotionDiv.displayName = "MotionDiv";

// Create a simple motion button component
const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ children, className, style, initial, animate, transition, ...props }, ref) => {
    // Only apply transition if animation props are provided
    const shouldAnimate = initial || animate || transition;
    
    return (
      <button 
        ref={ref} 
        className={className} 
        style={{ 
          ...style,
          ...(shouldAnimate && {
            transition: transition?.duration ? `opacity ${transition.duration}s ease-out, transform ${transition.duration}s ease-out` : "opacity 0.3s ease-out, transform 0.3s ease-out",
          }),
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
MotionButton.displayName = "MotionButton";

export const motion = {
  div: MotionDiv,
  button: MotionButton,
};
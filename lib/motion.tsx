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
  ({ children, className, style, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={className} 
        style={{ 
          ...style,
          transition: "all 0.5s ease-out",
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
  ({ children, className, style, ...props }, ref) => {
    return (
      <button 
        ref={ref} 
        className={className} 
        style={{ 
          ...style,
          transition: "all 0.5s ease-out",
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
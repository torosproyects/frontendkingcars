"use client";

import React, { createContext, useContext } from 'react';

interface CarDetailsProviderProps {
  children: React.ReactNode;
  carId: string;
}

const CarDetailsContext = createContext<{ carId: string } | null>(null);

export function CarDetailsProvider({ children, carId }: CarDetailsProviderProps) {
  return (
    <CarDetailsContext.Provider value={{ carId }}>
      {children}
    </CarDetailsContext.Provider>
  );
}

export const useCarDetailsContext = () => {
  const context = useContext(CarDetailsContext);
  if (!context) {
    throw new Error('useCarDetailsContext must be used within a CarDetailsProvider');
  }
  return context;
};
"use client";

import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
 
 const { initializeAuth, isInitializing } = useAuthStore();

  useEffect(() => {
    // Auth en paralelo, no bloquea la UI
    initializeAuth();
 }, [initializeAuth]);

  // NO mostrar loading - dejar que la app funcione mientras auth se procesa en background
  return (
    <AuthContext.Provider value={null}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto (aunque no es necesario en este caso)
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};
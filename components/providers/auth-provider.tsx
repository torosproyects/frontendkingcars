"use client";

import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const { initializeAuth, isLoading } = useAuthStore();

  useEffect(() => {
    // Inicializar autenticación al cargar la aplicación
    initializeAuth();
  }, [initializeAuth]);

  // Mostrar loading mientras se inicializa la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Inicializando...</p>
        </div>
      </div>
    );
  }

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
'use client';

import { useCarsStore } from '@/lib/store/cars-store';
import { useEffect, useRef } from 'react';

export default function CarsProvider({ children }: { children: React.ReactNode }) {
  const { fetchCars, allCars, loading } = useCarsStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Solo cargar una vez al inicializar si no hay carros
    if (!hasInitialized.current && allCars.length === 0 && !loading) {
      console.log("CarsProvider: Inicializando carga de carros");
      hasInitialized.current = true;
      fetchCars(true); // Forzar carga
    }
  }, [fetchCars, allCars.length, loading]);

  return <>{children}</>;
}
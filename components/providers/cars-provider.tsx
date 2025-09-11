'use client';

import { useCarsStore } from '@/lib/store/cars-store';
import { useEffect, useRef } from 'react';

export default function CarsProvider({ children }: { children: React.ReactNode }) {
  const { fetchCars, allCars, loading } = useCarsStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Cargar carros INMEDIATAMENTE, sin esperar auth
    if (!hasInitialized.current && allCars.length === 0 && !loading) {
      hasInitialized.current = true;
      fetchCars(true); // Forzar carga
    }
  }, [fetchCars, allCars.length, loading]);

  return <>{children}</>;
}
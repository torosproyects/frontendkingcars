import { create } from 'zustand';
import { Carro } from '@/types/carro';
import { getAllCars } from '@/lib/cars-api';
import { transformBackendToFrontend } from '@/lib/transformaciones/transforCars';

interface FilterState {
  make?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  categoria?: string;
  color?: string;
  nuevo?: boolean;
  searchTerm?: string;
}

interface CarsStore {
  allCars: Carro[];
  filteredCars: Carro[];
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
  error: string | null;
  filters: FilterState;
  lastFetch: number | null;
  
  // Acciones
  fetchCars: (force?: boolean) => Promise<void>;
  applyFilters: (newFilters: Partial<FilterState>) => void;
  resetFilters: () => void;
  setCurrentPage: (page: number) => void;
  getVisibleCars: () => Carro[];
  getPaginatedCars: () => Carro[];
  getTotalPages: () => number;
  getFeaturedCars: () => Carro[];
  addCar: (newCar: Carro) => void; 
  getCarById: (id: string) => Carro | undefined;
}

// Tiempo de cache en milisegundos (5 minutos)
const CACHE_TIME = 5 * 60 * 1000;

export const useCarsStore = create<CarsStore>((set, get) => ({
  allCars: [],
  filteredCars: [],
  currentPage: 1,
  itemsPerPage: 5,
  loading: false,
  error: null,
  filters: {},
  lastFetch: null,

  // Cargar todos los carros con cache
  fetchCars: async (force = false) => {
    const { allCars, lastFetch } = get();
    
    console.log('fetchCars llamado:', { force, allCarsLength: allCars.length, lastFetch });
    
    if (!force && allCars.length > 0 && lastFetch && Date.now() - lastFetch < CACHE_TIME) {
      console.log('Usando cache, no cargando carros');
      return;
    }

    console.log('Iniciando carga de carros...');
    set({ loading: true, error: null });
    
    try {
      const backendCars = await getAllCars();
      console.log('Carros obtenidos del backend:', backendCars.length);
      
      const transformedCars = transformBackendToFrontend(backendCars);
      console.log('Carros transformados:', transformedCars.length);
      
      set({ 
        allCars: transformedCars,
        filteredCars: transformedCars,
        currentPage: 1 ,
        loading: false,
        lastFetch: Date.now()
      });
      
      console.log('Carros guardados en el store');
      
    } catch (error) {
      console.error('Error al cargar carros:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        loading: false 
      });
    }
  },
  getVisibleCars: () => {
    const { filteredCars, currentPage, itemsPerPage } = get();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCars.slice(startIndex, startIndex + itemsPerPage);
  },

  getFeaturedCars: () => {
    const { allCars } = get();
    // Retornar los primeros 6 carros como destacados
    return allCars.slice(0, 6);
  },

  getPaginatedCars: () => {
    const { filteredCars, currentPage, itemsPerPage } = get();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCars.slice(startIndex, startIndex + itemsPerPage);
  },

  getTotalPages: () => {
    const { filteredCars, itemsPerPage } = get();
    return Math.ceil(filteredCars.length / itemsPerPage);
  },

  getCarById: (id: string) => { 
    const { allCars } = get();
    return allCars.find(car => car.id === id); 
  },

  // Aplicar filtros optimizado
  applyFilters: (newFilters) => {
    const { allCars, filters: currentFilters } = get();
    
    const updatedFilters = { ...currentFilters, ...newFilters };
    
    const filtered = allCars.filter(car => {
      if (updatedFilters.searchTerm) {
        const searchTerm = updatedFilters.searchTerm.toLowerCase();
        const searchable = `${car.marca} ${car.modelo} ${car.categoria}`.toLowerCase();
        if (!searchable.includes(searchTerm)) return false;
      }

      if (updatedFilters.make && 
          updatedFilters.make !== "Todas las Marcas" &&
          car.marca.toLowerCase() !== updatedFilters.make.toLowerCase()) {
        return false;
      }

      if (updatedFilters.model && 
          !car.modelo.toLowerCase().includes(updatedFilters.model.toLowerCase())) {
        return false;
      }

      if (updatedFilters.minYear && car.year < updatedFilters.minYear) return false;
      if (updatedFilters.maxYear && car.year > updatedFilters.maxYear) return false;
      if (updatedFilters.minPrice && car.precio < updatedFilters.minPrice) return false;
      if (updatedFilters.maxPrice && car.precio > updatedFilters.maxPrice) return false;

      if (updatedFilters.categoria && 
          updatedFilters.categoria !== "Todos las categorias" &&
          car.categoria !== updatedFilters.categoria) {
        return false;
      }

      if (updatedFilters.color && 
          updatedFilters.color !== "Todos los Colores" &&
          car.colorExterior?.toLowerCase() !== updatedFilters.color.toLowerCase()) {
        return false;
      }

      return true;
    });

    set({
      filters: updatedFilters,
      filteredCars: filtered,
      currentPage: 1
    });
  },

  // Resetear filtros
  resetFilters: () => {
    const { allCars, itemsPerPage } = get();
    set({
      filters: {},
      filteredCars: allCars,
      currentPage: 1
    });
  },

  // Cambiar página
  setCurrentPage: (page) => set((state) => ({
    currentPage: page,
    visibleCars: state.filteredCars.slice(
      (page - 1) * state.itemsPerPage,
      page * state.itemsPerPage
    )
  })),
  
  addCar: (newCar: Carro) => set((state) => {
  const exists = state.allCars.some(car => car.id === newCar.id);
  if (exists) return state; // No agregar duplicados

  return {
    allCars: [newCar, ...state.allCars],
    filteredCars: [newCar, ...state.filteredCars],
    currentPage: 1
  };
})
}));
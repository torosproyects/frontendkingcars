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
  visibleCars: Carro[];
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
  error: string | null;
  filters: FilterState;
  
  // Acciones
  fetchCars: () => Promise<void>;
  applyFilters: (newFilters: Partial<FilterState>) => void;
  resetFilters: () => void;
  setCurrentPage: (page: number) => void;
  getPaginatedCars: () => Carro[];
  getTotalPages: () => number;
  getFeaturedCars: () => Carro[];
  addCar: (newCar: Carro) => void; 
  getCarById: (id: string) => Carro | undefined;
}

export const useCarsStore = create<CarsStore>((set, get) => ({
  allCars: [],
  filteredCars: [],
  visibleCars: [],
  currentPage: 1,
  itemsPerPage: 5,
  loading: false,
  error: null,
  filters: {},

  // Cargar todos los carros
  fetchCars: async () => {
    const { allCars } = get();
    if (allCars.length > 0) return;

    set({ loading: true, error: null });
    
    try {
      const backendCars = await getAllCars();
      const transformedCars = transformBackendToFrontend(backendCars);
      
      set({ 
        allCars: transformedCars,
        filteredCars: transformedCars,
        visibleCars: transformedCars.slice(0, 5),
        loading: false
      });
      
    } catch (error) {
      console.error('Error al cargar carros:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        loading: false 
      });
    }
  },
  getFeaturedCars: () => {
  const { allCars } = get();
  return allCars
    
},
  getPaginatedCars: () => {
    const { filteredCars, currentPage, itemsPerPage } = get();
    return filteredCars.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  },

  getTotalPages: () => {
    const { filteredCars, itemsPerPage } = get();
    return Math.ceil(filteredCars.length / itemsPerPage);
  },
  getCarById: (id: string) => { 
    const { allCars } = get();
      return allCars.find(car => car.id === id); 
  },

  // Aplicar filtros
 applyFilters: (newFilters) => {
  const { allCars, itemsPerPage } = get();
    
  const updatedFilters = { ...get().filters, ...newFilters };
  const filtered = allCars.filter(car => {
    const matchesSearch = !updatedFilters.searchTerm || 
      `${car.marca} ${car.modelo} ${car.categoria}`.toLowerCase()
        .includes(updatedFilters.searchTerm.toLowerCase());

    const matchesMake = !updatedFilters.make || 
      updatedFilters.make === "Todas las Marcas" ||
      car.marca.toLowerCase().includes(updatedFilters.make.toLowerCase());

    const matchesModel = !updatedFilters.model || 
      car.modelo.toLowerCase().includes(updatedFilters.model.toLowerCase());

    const matchesYear = (!updatedFilters.minYear || car.year >= updatedFilters.minYear) &&
      (!updatedFilters.maxYear || car.year <= updatedFilters.maxYear);

    const matchesPrice = (!updatedFilters.minPrice || car.precio >= updatedFilters.minPrice) &&
      (!updatedFilters.maxPrice || car.precio <= updatedFilters.maxPrice);

    const matchesBodyType = !updatedFilters.categoria|| 
      updatedFilters.categoria === "Todos las categorias" ||
      car.categoria === updatedFilters.categoria;

    const matchesFuelType = !updatedFilters.color|| 
      updatedFilters.color === "Todos los Combustibles" ||
      car.colorExterior === updatedFilters.color;

    const matchesColor = !updatedFilters.color || 
      updatedFilters.color === "Todos los Colores" ||
      car.colorExterior?.toLowerCase() === updatedFilters.color.toLowerCase();

    return matchesSearch && matchesMake && matchesModel && 
           matchesYear && matchesPrice && matchesBodyType && 
           matchesFuelType && matchesColor;
  });
  set({
    filters: updatedFilters,
    filteredCars: filtered,
    visibleCars: filtered.slice(0, itemsPerPage),
    currentPage: 1
  });
},

  // Resetear filtros
  resetFilters: () => {
    const { allCars, itemsPerPage } = get();
    set({
      filters: {},
      filteredCars: allCars,
      visibleCars: allCars.slice(0, itemsPerPage),
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
   addCar: (newCar: Carro) => set((state) => ({
    allCars: [...state.allCars, newCar],
    filteredCars: [...state.filteredCars, newCar],
    visibleCars: [...state.visibleCars, newCar].slice(0, state.itemsPerPage)
  }))
}));
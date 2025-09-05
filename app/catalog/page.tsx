// app/catalog/page.tsx
'use client'; 

import { useState, useEffect } from 'react';
import { useCarsStore } from '@/lib/store/cars-store';
import { CarCard } from '@/components/catalog/CarCard';
import { PaginationControls } from '@/components/catalog/PaginationControls';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { FilterDrawer } from '@/components/catalog/FilterDrawer'; // O FilterModal

export default function CatalogPage() {
  const { loading, error, getVisibleCars, currentPage, getTotalPages, setCurrentPage, applyFilters, filters, resetFilters, fetchCars } = useCarsStore();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const totalPages = getTotalPages();
  const visibleCars = getVisibleCars();
   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyFilters({ searchTerm: e.target.value });
  };
   useEffect(() => {
    fetchCars(true);
  }, [fetchCars]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll hacia arriba al cambiar página
  };

  if (loading) return <div className="container py-8">Cargando carros...</div>;
  if (error) return <div className="container py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Catálogo de Vehículos</h1>

      {/* Barra de Búsqueda y Filtros */}
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Buscar por marca, modelo o categoría..."
            value={filters.searchTerm || ''}
            onChange={handleSearchChange}
            className="flex-grow"
          />
          <Button onClick={() => setIsFilterDrawerOpen(true)} variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
        
        {/* Resumen de filtros aplicados (opcional) */}
        {Object.keys(filters).length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Filtros:</span>
            {filters.make && filters.make !== "Todas las Marcas" && <span className="bg-muted px-2 py-1 rounded">{filters.make}</span>}
            {filters.model && <span className="bg-muted px-2 py-1 rounded">{filters.model}</span>}
            {filters.categoria && filters.categoria !== "Todos las categorias" && <span className="bg-muted px-2 py-1 rounded">{filters.categoria}</span>}
            {filters.minPrice !== undefined && <span className="bg-muted px-2 py-1 rounded">Min: ${filters.minPrice.toLocaleString()}</span>}
            {filters.maxPrice !== undefined && <span className="bg-muted px-2 py-1 rounded">Max: ${filters.maxPrice.toLocaleString()}</span>}
            <Button variant="link" size="sm" onClick={resetFilters} className="text-primary p-0 h-auto">Limpiar Filtros</Button>
          </div>
        )}
      </div>

      {/* Lista de Carros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {visibleCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {/* Paginación */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Drawer de Filtros */}
      <FilterDrawer isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} />
    </div>
  );
}

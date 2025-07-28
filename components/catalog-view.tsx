"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchFilters } from "@/components/search-filters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fuel, Gauge, Calendar, Heart, Grid3X3, List, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useCarsStore } from "@/lib/store/cars-store";

export function CatalogView() {
  const {
    loading,
    error,
    filteredCars,
    currentPage,
    visibleCars,
    getPaginatedCars,
    getTotalPages,
    setCurrentPage,
    itemsPerPage,
   } = useCarsStore();
   

  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = React.useState("all");

  // Obtener carros paginados
  const paginatedCars = getPaginatedCars();
  const totalPages = getTotalPages();

  // Filtrar por tab activo
  const displayCars = React.useMemo(() => {
    if (activeTab === "new") {
      return paginatedCars.filter(car => car.isNew);
    } else if (activeTab === "used") {
      return paginatedCars.filter(car => !car.isNew);
    }
    return paginatedCars;
  }, [paginatedCars, activeTab]);

  // Función para cambiar de página
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-card p-4 rounded-lg shadow-sm">
          <SearchFilters />
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Cargando vehículos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-card p-4 rounded-lg shadow-sm">
          <SearchFilters />
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Recargar Página
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filtros de Búsqueda */}
      <div className="bg-card p-4 rounded-lg shadow-sm">
        <SearchFilters />
      </div>

      {/* Encabezado de Resultados */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            {filteredCars.length} vehículos encontrados
          </h2>
          <p className="text-sm text-muted-foreground">
            Mostrando página {currentPage} de {totalPages}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Button 
              variant={viewMode === "grid" ? "default" : "outline"} 
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="sr-only">Vista de cuadrícula</span>
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "outline"} 
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
              <span className="sr-only">Vista de lista</span>
            </Button>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="new">Nuevos</TabsTrigger>
              <TabsTrigger value="used">Usados</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Cuadrícula de Carros */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayCars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src={car.imagen}
                    alt={`${car.marca} ${car.modelo}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  {car.isNew && (
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                      Nueva Llegada
                    </Badge>
                  )}
                  
                </div>
                <CardContent className="flex-grow pt-6">
                  <h3 className="text-lg font-bold mb-1">
                    {car.marca} {car.modelo}
                  </h3>
                  <p className="text-xl font-semibold mb-3">
                    ${car.precio.toLocaleString()}
                  </p>
                  <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{car.year}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Gauge className="h-4 w-4" />
                      <span>{car.kilometraje.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground col-span-2">
                      <Fuel className="h-4 w-4" />
                      <span>{car.categoria}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/catalog/${car.id}`}>Ver Detalles</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {displayCars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-60 md:h-auto md:w-1/3 xl:w-1/4">
                    <Image
                      src={car.imagen}
                      alt={`${car.marca} ${car.modelo}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {car.isNew && (
                      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                        Nueva Llegada
                      </Badge>
                    )}
                  </div>
                  <div className="flex-grow p-6 flex flex-col md:flex-row">
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold mb-1">
                            {car.marca} {car.modelo}
                          </h3>
                          <p className="text-2xl font-semibold">
                            ${car.precio.toLocaleString()}
                          </p>
                        </div>
                       
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-sm mt-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>{car.year}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Gauge className="h-4 w-4 flex-shrink-0" />
                          <span>{car.kilometraje.toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Fuel className="h-4 w-4 flex-shrink-0" />
                          <span>{car.categoria}</span>
                        </div>
                      </div>
                      
                      
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-6 flex md:flex-col items-center md:justify-between gap-4">
                      <Button asChild className="md:w-auto w-full">
                        <Link href={`/catalog/${car.id}`}>Ver Detalles</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Mensaje si no hay resultados */}
      {displayCars.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No se encontraron vehículos que coincidan con los filtros seleccionados.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              // Limpiar filtros se manejará desde el componente SearchFilters
              setActiveTab("all");
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && displayCars.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page:number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(page)}
                  className="w-10 h-10"
                >
                  {page}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Página siguiente</span>
          </Button>
        </div>
      )}
    </div>
  );
}
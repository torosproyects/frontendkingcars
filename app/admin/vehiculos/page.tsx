"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCarsStore } from "@/lib/store/cars-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Carro } from "@/types/carro";
import { Car, Search, Grid, List } from "lucide-react";

const ITEMS_PER_PAGE = 6;

// Componente personalizado para los badges de estado
const EstadoBadge = ({ estado }: { estado: string }) => {
  // Función para formatear el texto del estado
  const formatEstado = (estado: string) => {
    const estadoMap: Record<string, string> = {
      "revisionTaller": "Revisión Taller",
      "venta": "En Venta",
      "subasta": "En Subasta",
      "entregado": "Entregado",
      "rechazado": "Rechazado",
      "reparacion": "En Reparación",
      "revisionAdmin": "Revisión Admin",
      "porEntregar": "Por Entregar"
    };
    
    return estadoMap[estado] || estado;
  };

  // Determinar colores según el estado
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let borderColor = "border-gray-300";
  
  switch(estado) {
    case "revisionTaller":
    case "revisionAdmin":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      borderColor = "border-blue-300";
      break;
    case "venta":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      borderColor = "border-green-300";
      break;
    case "subasta":
      bgColor = "bg-purple-100";
      textColor = "text-purple-800";
      borderColor = "border-purple-300";
      break;
    case "entregado":
      bgColor = "bg-teal-100";
      textColor = "text-teal-800";
      borderColor = "border-teal-300";
      break;
    case "rechazado":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      borderColor = "border-red-300";
      break;
    case "reparacion":
      bgColor = "bg-amber-100";
      textColor = "text-amber-800";
      borderColor = "border-amber-300";
      break;
    case "porEntregar":
      bgColor = "bg-indigo-100";
      textColor = "text-indigo-800";
      borderColor = "border-indigo-300";
      break;
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${bgColor} ${textColor} ${borderColor}`}>
      {formatEstado(estado)}
    </span>
  );
};

export default function AdminVehiculosPage() {
  const { loading, error, allCars, fetchCars } = useCarsStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCars, setFilteredCars] = useState<Carro[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchCars(true);
  }, [fetchCars]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = allCars.filter(
      (car) =>
        car.marca.toLowerCase().includes(term) ||
        car.modelo.toLowerCase().includes(term) ||
        car.placa.toLowerCase().includes(term) ||
        (car.estado && car.estado.toLowerCase().includes(term))
    );
    setFilteredCars(results);
    setCurrentPage(1);
  }, [searchTerm, allCars]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCars = filteredCars.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="p-6">Cargando autos...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" /> Gestión de Vehículos
        </h1>
        
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md">
            <Button 
              variant={viewMode === "grid" ? "default" : "ghost"} 
              size="sm" 
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"} 
              size="sm" 
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por marca, modelo, placa o estado..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        <Button variant="outline" onClick={() => setSearchTerm("")}>
          Limpiar
        </Button>
      </div>

      {/* Vista de cuadrícula para móviles */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCars.length === 0 ? (
            <div className="col-span-full px-4 py-6 text-center text-muted-foreground">
              No se encontraron vehículos
            </div>
          ) : (
            paginatedCars.map((car: Carro) => (
              <div key={car.id} className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src={car.imagen || "/placeholder-car.jpg"}
                    alt={`${car.marca} ${car.modelo}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{car.marca} {car.modelo}</h3>
                      <p className="text-sm text-muted-foreground">{car.year}</p>
                    </div>
                    <EstadoBadge estado={car.estado} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Placa</p>
                      <p className="font-medium">{car.placa}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Precio</p>
                      <p className="font-semibold">${car.precio?.toLocaleString() || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Editar
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1">
                      Estado
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Vista de tabla para pantallas grandes */}
      {viewMode === "list" && (
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted text-left">
                <th className="px-4 py-2">Imagen</th>
                <th className="px-4 py-2">Marca / Modelo</th>
                <th className="px-4 py-2">Año</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Placa</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCars.map((car: Carro) => (
                <tr key={car.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-2">
                    <div className="relative h-12 w-16">
                      <Image
                        src={car.imagen || "/placeholder-car.jpg"}
                        alt={`${car.marca} ${car.modelo}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 font-medium">
                    {car.marca} {car.modelo}
                  </td>
                  <td className="px-4 py-2">{car.year}</td>
                  <td className="px-4 py-2 font-semibold">
                    ${car.precio?.toLocaleString() || "N/A"}
                  </td>
                  <td className="px-4 py-2">{car.placa}</td>
                  <td className="px-4 py-2">
                    <EstadoBadge estado={car.estado} />
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                    <Button size="sm" variant="secondary">
                      Cambiar estado
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          
          {pageNumbers.map((page) => (
            <Button
              key={page}
              onClick={() => handlePageChange(page)}
              variant={currentPage === page ? "default" : "outline"}
              className="w-10 h-10"
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
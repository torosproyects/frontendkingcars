"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VerificationService } from "@/lib/api/verification";
import { Verification, VerificationFilters, VerificationFiltersUI } from "@/types/verification";
import { Users, Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ITEMS_PER_PAGE = 20;

// Componente para el badge de estado
const EstadoBadge = ({ estado }: { estado: string }) => {
  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return {
          label: "Pendiente",
          className: "bg-yellow-100 text-yellow-800 border-yellow-300"
        };
      case "en_revision":
        return {
          label: "En Revisión",
          className: "bg-blue-100 text-blue-800 border-blue-300"
        };
      case "aprobada":
        return {
          label: "Aprobada",
          className: "bg-green-100 text-green-800 border-green-300"
        };
      case "rechazada":
        return {
          label: "Rechazada",
          className: "bg-red-100 text-red-800 border-red-300"
        };
      default:
        return {
          label: estado,
          className: "bg-gray-100 text-gray-800 border-gray-300"
        };
    }
  };

  const config = getEstadoConfig(estado);
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
};

// Componente para el badge de tipo de cuenta
const TipoCuentaBadge = ({ account_type_id }: { account_type_id: number }) => {
  const getTipoConfig = (id: number) => {
    switch (id) {
      case 7:
        return {
          label: "Particular",
          className: "bg-purple-100 text-purple-800 border-purple-300"
        };
      case 5:
        return {
          label: "Autónomo",
          className: "bg-orange-100 text-orange-800 border-orange-300"
        };
      case 6:
        return {
          label: "Empresa",
          className: "bg-indigo-100 text-indigo-800 border-indigo-300"
        };
      default:
        return {
          label: "Desconocido",
          className: "bg-gray-100 text-gray-800 border-gray-300"
        };
    }
  };

  const config = getTipoConfig(account_type_id);
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
};

export default function VerificacionesPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState<any>(null);

  // Filtros
  const [filters, setFilters] = useState<VerificationFilters>({
    limit: ITEMS_PER_PAGE,
    offset: 0,
    sort_by: 'fecha_solicitud',
    sort_order: 'DESC'
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Opciones de filtros
  const filterOptions: VerificationFiltersUI = {
    estado: [
      { value: 'all', label: 'Todos los estados' },
      { value: 'pendiente', label: 'Pendientes' },
      { value: 'en_revision', label: 'En Revisión' },
      { value: 'aprobada', label: 'Aprobadas' },
      { value: 'rechazada', label: 'Rechazadas' }
    ],
    account_type: [
      { value: 'all', label: 'Todos los tipos' },
      { value: '7', label: 'Particular' },
      { value: '5', label: 'Autónomo' },
      { value: '6', label: 'Empresa' }
    ],
    sort_by: [
      { value: 'fecha_solicitud', label: 'Fecha de Solicitud' },
      { value: 'first_name', label: 'Nombre' },
      { value: 'last_name', label: 'Apellido' },
      { value: 'estado', label: 'Estado' }
    ]
  };

  // Cargar verificaciones
  const fetchVerifications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await VerificationService.getPendingVerifications(filters);
      
      if (response.success) {
        setVerifications(response.data.verificaciones);
        setTotalPages(Math.ceil(response.data.pagination.total / ITEMS_PER_PAGE));
        setTotalItems(response.data.pagination.total);
        setStats(response.data.stats);
      } else {
        setError('Error al cargar las verificaciones');
      }
    } catch (err) {
      console.error('Error fetching verifications:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos
  useEffect(() => {
    fetchVerifications();
  }, [filters]);

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilters(prev => ({
      ...prev,
      offset: (page - 1) * ITEMS_PER_PAGE
    }));
  };

  // Manejar filtros
  const handleFilterChange = (key: keyof VerificationFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
      offset: 0 // Resetear a la primera página
    }));
    setCurrentPage(1);
  };

  // Filtrar verificaciones por término de búsqueda
  const filteredVerifications = verifications.filter(verification =>
    verification.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verification.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verification.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verification.documento_numero.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-muted-foreground">Cargando verificaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 text-xl md:text-2xl font-bold text-gray-800">
        <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
        <h1>Verificaciones de Usuarios</h1>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <div className="h-4 w-4 rounded-full bg-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendientes}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">En Revisión</CardTitle>
              <div className="h-4 w-4 rounded-full bg-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.en_revision}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.aprobadas}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold">Filtros</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre, email o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Estado */}
          <Select
            value={filters.estado || 'all'}
            onValueChange={(value) => handleFilterChange('estado', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.estado.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tipo de cuenta */}
          <Select
            value={filters.account_type_id?.toString() || 'all'}
            onValueChange={(value) => handleFilterChange('account_type_id', value === 'all' ? 'all' : parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de cuenta" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.account_type.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Ordenamiento */}
          <Select
            value={filters.sort_by || 'fecha_solicitud'}
            onValueChange={(value) => handleFilterChange('sort_by', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.sort_by.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla de verificaciones */}
      {filteredVerifications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">
            {searchTerm ? 'No se encontraron verificaciones con ese criterio de búsqueda' : 'No hay verificaciones disponibles'}
          </p>
        </div>
      ) : (
        <>
          {/* Vista de tabla para pantallas grandes */}
          <div className="hidden md:block bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo de Cuenta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Solicitud
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVerifications.map((verification) => (
                    <tr key={verification.id} className="hover:bg-gray-100 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {verification.first_name} {verification.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {verification.documento_tipo}: {verification.documento_numero}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {verification.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <TipoCuentaBadge account_type_id={verification.account_type_id} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <EstadoBadge estado={verification.estado} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(verification.fecha_solicitud).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/admin/verificaciones/${verification.id}`} passHref>
                          <Button variant="outline" size="sm">
                            Ver Detalle
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vista de tarjetas para pantallas pequeñas */}
          <div className="md:hidden grid gap-4">
            {filteredVerifications.map((verification) => (
              <div key={verification.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {verification.first_name} {verification.last_name}
                      </h3>
                      <p className="text-gray-500 text-sm">{verification.email}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <EstadoBadge estado={verification.estado} />
                      <TipoCuentaBadge account_type_id={verification.account_type_id} />
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p><strong>Documento:</strong> {verification.documento_tipo} {verification.documento_numero}</p>
                    <p><strong>Fecha:</strong> {new Date(verification.fecha_solicitud).toLocaleDateString('es-ES')}</p>
                  </div>
                  
                  <div className="pt-2">
                    <Link href={`/admin/verificaciones/${verification.id}`} passHref>
                      <Button size="sm" className="w-full">
                        Ver Detalle
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                variant={currentPage === page ? "default" : "outline"}
                className="w-10 h-10"
              >
                {page}
              </Button>
            );
          })}
          
          <Button
            variant="outline"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Información de paginación */}
      <div className="text-center text-sm text-gray-500">
        Mostrando {filteredVerifications.length} de {totalItems} verificaciones
      </div>
    </div>
  );
}

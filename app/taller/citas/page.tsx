"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { useEvaluacionTallerStore } from '@/lib/store/evaluacion-taller-store';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { CitasHoy } from '@/components/taller/citas/CitasHoy';
import { CitaCard } from '@/components/taller/citas/CitaCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft,
  Calendar,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CitaTaller } from '@/types/evaluaciontaller';

function CitasContent() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    citas, 
    citasHoy,
    isLoading, 
    error,
    fetchCitas,
    fetchCitasHoy,
    updateEstadoCita
  } = useEvaluacionTallerStore();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('todos');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchCitas(user.id);
      fetchCitasHoy(user.id);
    }
  }, [user?.id, fetchCitas, fetchCitasHoy]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const filteredCitas = citas.filter(cita => {
    const matchesSearch = 
      cita.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.vehiculoId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.clienteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = estadoFiltro === 'todos' || cita.estado === estadoFiltro;
    
    return matchesSearch && matchesEstado;
  });

  const handleUpdateEstado = async (id: string, nuevoEstado: string) => {
    setIsUpdating(id);
    try {
      const success = await updateEstadoCita(id, nuevoEstado);
      if (success) {
        toast({
          title: "Éxito",
          description: "Estado de cita actualizado correctamente",
        });
        // Refrescar las citas
        if (user?.id) {
          fetchCitas(user.id);
          fetchCitasHoy(user.id);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar el estado de la cita",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleVerDetalle = (id: string) => {
    // Por ahora solo mostramos un toast, después implementaremos la página de detalle
    toast({
      title: "Detalle de Cita",
      description: `Ver detalles de la cita ${id}`,
    });
  };

  const handleVerTodas = () => {
    // Scroll hacia la sección de todas las citas
    document.getElementById('todas-las-citas')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRefresh = () => {
    if (user?.id) {
      fetchCitas(user.id);
      fetchCitasHoy(user.id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/taller')}
          >
            <ArrowLeft size={16} className="mr-2" />
            Volver al Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestión de Citas
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Administra las citas programadas
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Citas de Hoy */}
      <CitasHoy
        citas={citasHoy}
        onUpdateEstado={handleUpdateEstado}
        onVerDetalle={handleVerDetalle}
        onVerTodas={handleVerTodas}
        isLoading={isLoading}
      />

      {/* Filtros y Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por ID, vehículo, cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="confirmada">Confirmada</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Todas las Citas */}
      <div id="todas-las-citas">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Todas las Citas
            </CardTitle>
            <CardDescription>
              {filteredCitas.length} citas encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCitas.length === 0 ? (
              <div className="text-center py-8">
                <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No se encontraron citas
                </h3>
                <p className="text-gray-500">
                  {searchTerm || estadoFiltro !== 'todos' 
                    ? 'No hay citas que coincidan con los filtros aplicados'
                    : 'No tienes citas programadas'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredCitas.map((cita) => (
                  <CitaCard
                    key={cita.id}
                    cita={cita}
                    onUpdateEstado={handleUpdateEstado}
                    onVerDetalle={handleVerDetalle}
                    isLoading={isUpdating === cita.id}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CitasPage() {
  return (
    <ProtectedRoute requiredRoles={['Taller']}>
      <CitasContent />
    </ProtectedRoute>
  );
}
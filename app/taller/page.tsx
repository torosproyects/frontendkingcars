"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { useEvaluacionTallerStore } from '@/lib/store/evaluacion-taller-store';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EstadisticasTaller } from '@/components/taller/dashboard/EstadisticasTaller';
import { CitasHoy } from '@/components/taller/dashboard/CitasHoy';

import { 
  Calendar, 
  Clock, 
  Car, 
  Wrench, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Eye,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

function TallerDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    evaluaciones, 
    citasHoy, 
    citas,
    isLoading, 
    error,
    fetchEvaluaciones,
    fetchCitasHoy,
    fetchCitas,
    updateEstadoCita,
    getEvaluacionesPorEstado,
    getCitasPorEstado
  } = useEvaluacionTallerStore();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      fetchEvaluaciones(user.id);
      fetchCitasHoy(user.id);
      fetchCitas(user.id);
    }
  }, [user?.id, fetchEvaluaciones, fetchCitasHoy, fetchCitas]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const evaluacionesEnProceso = getEvaluacionesPorEstado('en_evaluacion');
  const evaluacionesCompletadas = getEvaluacionesPorEstado('evaluado');
  const citasPendientes = getCitasPorEstado('pendiente');
  const citasConfirmadas = getCitasPorEstado('confirmada');

  // Funciones para manejar citas
  const handleUpdateEstadoCita = async (id: string, nuevoEstado: string) => {
    try {
      const success = await updateEstadoCita(id, nuevoEstado);
      if (success) {
        toast({
          title: "Éxito",
          description: "Estado de cita actualizado correctamente",
        });
        // Refrescar las citas
        if (user?.id) {
          fetchCitasHoy(user.id);
          fetchCitas(user.id);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar el estado de la cita",
        variant: "destructive",
      });
    }
  };

  const handleVerDetalleCita = (id: string) => {
    // Por ahora solo mostramos un toast, después implementaremos la página de detalle
    toast({
      title: "Detalle de Cita",
      description: `Ver detalles de la cita ${id}`,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard del Taller
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bienvenido, {user?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/taller/evaluacion/entrada">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Nueva Evaluación
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citasHoy.length}</div>
            <p className="text-xs text-muted-foreground">
              {citasHoy.length > 0 ? `${citasPendientes.length} pendientes` : 'Sin citas programadas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Evaluación</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluacionesEnProceso.length}</div>
            <p className="text-xs text-muted-foreground">
              {evaluacionesEnProceso.length > 0 ? 'Vehículos en proceso' : 'Sin evaluaciones en proceso'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluacionesCompletadas.length}</div>
            <p className="text-xs text-muted-foreground">
              {evaluacionesCompletadas.length > 0 ? 'Evaluaciones completadas' : 'Sin evaluaciones completadas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Evaluaciones</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluaciones.length}</div>
            <p className="text-xs text-muted-foreground">
              {evaluaciones.length > 0 ? 'Este mes' : 'Sin evaluaciones registradas'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Gestión de Horarios
            </CardTitle>
            <CardDescription>
              Configura tus horarios de disponibilidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/taller/horarios">
              <Button variant="outline" className="w-full">
                <Clock size={16} className="mr-2" />
                Ver Horarios
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car size={20} />
              Citas del Día
            </CardTitle>
            <CardDescription>
              Revisa las citas programadas para hoy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/taller/citas">
              <Button variant="outline" className="w-full">
                <Eye size={16} className="mr-2" />
                Ver Citas
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench size={20} />
              Evaluaciones
            </CardTitle>
            <CardDescription>
              Gestiona las evaluaciones de vehículos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/taller/evaluacion/entrada">
              <Button variant="outline" className="w-full">
                <Plus size={16} className="mr-2" />
                Nueva Evaluación
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/taller/evaluacion/pruebas">
                <Button variant="outline" size="sm" className="w-full">
                  <Wrench size={14} className="mr-1" />
                  Pruebas
                </Button>
              </Link>
              <Link href="/taller/evaluacion/final">
                <Button variant="outline" size="sm" className="w-full">
                  <CheckCircle size={14} className="mr-1" />
                  Final
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas Detalladas */}
      <EstadisticasTaller
        evaluaciones={evaluaciones}
        citas={citas}
        isLoading={isLoading}
      />

      {/* Citas de Hoy */}
      <CitasHoy
        citas={citasHoy}
        onUpdateEstado={handleUpdateEstadoCita}
        onVerDetalle={handleVerDetalleCita}
        onVerTodas={() => router.push('/taller/citas')}
        isLoading={isLoading}
      />

      {/* Evaluaciones Recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluaciones Recientes</CardTitle>
          <CardDescription>
            Últimas evaluaciones realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {evaluaciones.length > 0 ? (
            <div className="space-y-3">
              {evaluaciones.slice(0, 5).map((evaluacion) => (
                <div key={evaluacion.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Car size={20} className="text-gray-500" />
                    <div>
                      <p className="font-medium">
                        {evaluacion.carro.marca} {evaluacion.carro.modelo}
                      </p>
                      <p className="text-sm text-gray-500">
                        Placa: {evaluacion.carro.placa}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        evaluacion.estadoTaller === 'evaluado' ? 'default' :
                        evaluacion.estadoTaller === 'en_evaluacion' ? 'secondary' :
                        evaluacion.estadoTaller === 'en_reparacion' ? 'destructive' : 'outline'
                      }
                    >
                      {evaluacion.estadoTaller.replace('_', ' ')}
                    </Badge>
                    <Link href={`/taller/evaluacion/${evaluacion.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Car size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay evaluaciones
              </h3>
              <p className="text-gray-500 mb-4">
                Aún no has realizado ninguna evaluación de vehículos
              </p>
              <Link href="/taller/evaluacion/entrada">
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Crear Primera Evaluación
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function TallerPage() {
  return (
    <ProtectedRoute requiredRoles={['Taller']}>
      <TallerDashboard />
    </ProtectedRoute>
  );
}
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { useEvaluacionTallerStore } from '@/lib/store/evaluacion-taller-store';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Car,
  Wrench,
  CheckCircle,
  AlertCircle,
  Clock,
  Camera,
  DollarSign,
  FileText,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EvaluacionTaller } from '@/types/evaluaciontaller';

function EvaluacionDetalleContent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    currentEvaluacion, 
    fetchEvaluacion, 
    isLoading,
    error 
  } = useEvaluacionTallerStore();
  const { toast } = useToast();

  const evaluacionId = params.id;

  useEffect(() => {
    if (evaluacionId) {
      fetchEvaluacion(evaluacionId);
    }
  }, [evaluacionId, fetchEvaluacion]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const getEstadoConfig = (estado: string) => {
    const configs = {
      'en_evaluacion': { label: 'En Evaluación', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'evaluado': { label: 'Evaluado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'en_reparacion': { label: 'En Reparación', color: 'bg-orange-100 text-orange-800', icon: Wrench },
      'reparado': { label: 'Reparado', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    };
    return configs[estado as keyof typeof configs] || { label: estado, color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
  };

  const getProgresoEvaluacion = () => {
    if (!currentEvaluacion) return 0;
    
    let progreso = 0;
    if (currentEvaluacion.evaluacionEntrada) progreso += 33;
    if (currentEvaluacion.pruebasTecnicas) progreso += 33;
    if (currentEvaluacion.evaluacionFinal) progreso += 34;
    
    return progreso;
  };

  const canContinueToPruebas = () => {
    return currentEvaluacion?.evaluacionEntrada && !currentEvaluacion.pruebasTecnicas;
  };

  const canContinueToFinal = () => {
    return currentEvaluacion?.pruebasTecnicas && !currentEvaluacion.evaluacionFinal;
  };

  const canViewFinal = () => {
    return currentEvaluacion?.evaluacionFinal;
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

  if (!currentEvaluacion) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle size={48} className="text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Evaluación no encontrada
            </h3>
            <p className="text-gray-500 text-center mb-4">
              No se pudo cargar la evaluación solicitada
            </p>
            <Button onClick={() => router.push('/taller')}>
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const estadoConfig = getEstadoConfig(currentEvaluacion.estadoTaller);
  const EstadoIcon = estadoConfig.icon;
  const progreso = getProgresoEvaluacion();

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
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
            Detalle de Evaluación
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Evaluación #{evaluacionId.slice(-6)}
          </p>
        </div>
      </div>

      {/* Información del Vehículo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car size={20} />
            Información del Vehículo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Vehículo</p>
              <p className="font-semibold">
                {currentEvaluacion.carro.marca} {currentEvaluacion.carro.modelo}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Año</p>
              <p className="font-semibold">{currentEvaluacion.carro.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Placa</p>
              <p className="font-semibold">{currentEvaluacion.carro.placa}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Kilometraje</p>
              <p className="font-semibold">
                {currentEvaluacion.carro.kilometraje.toLocaleString()} km
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado y Progreso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EstadoIcon size={20} />
            Estado de la Evaluación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className={estadoConfig.color}>
              <EstadoIcon size={14} className="mr-1" />
              {estadoConfig.label}
            </Badge>
            <span className="text-sm text-gray-500">
              {progreso}% completado
            </span>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>

          {/* Pasos de la evaluación */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg border-2 ${
              currentEvaluacion.evaluacionEntrada 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  currentEvaluacion.evaluacionEntrada ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <span className="font-medium">Evaluación de Entrada</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {currentEvaluacion.evaluacionEntrada ? 'Completada' : 'Pendiente'}
              </p>
            </div>

            <div className={`p-3 rounded-lg border-2 ${
              currentEvaluacion.pruebasTecnicas 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  currentEvaluacion.pruebasTecnicas ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <span className="font-medium">Pruebas Técnicas</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {currentEvaluacion.pruebasTecnicas ? 'Completadas' : 'Pendientes'}
              </p>
            </div>

            <div className={`p-3 rounded-lg border-2 ${
              currentEvaluacion.evaluacionFinal 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  currentEvaluacion.evaluacionFinal ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <span className="font-medium">Evaluación Final</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {currentEvaluacion.evaluacionFinal ? 'Completada' : 'Pendiente'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Disponibles</CardTitle>
          <CardDescription>
            Continúa con el siguiente paso de la evaluación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Evaluación de Entrada */}
            <div className="space-y-3">
              <h4 className="font-medium">Evaluación de Entrada</h4>
              {currentEvaluacion.evaluacionEntrada ? (
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle size={16} className="mr-2" />
                    Completada
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => router.push(`/taller/evaluacion/${evaluacionId}/entrada`)}
                  >
                    <Eye size={14} className="mr-2" />
                    Ver Detalle
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full"
                  onClick={() => router.push(`/taller/evaluacion/${evaluacionId}/entrada`)}
                >
                  <Wrench size={16} className="mr-2" />
                  Realizar Evaluación
                </Button>
              )}
            </div>

            {/* Pruebas Técnicas */}
            <div className="space-y-3">
              <h4 className="font-medium">Pruebas Técnicas</h4>
              {currentEvaluacion.pruebasTecnicas ? (
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle size={16} className="mr-2" />
                    Completadas
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => router.push(`/taller/evaluacion/${evaluacionId}/pruebas`)}
                  >
                    <Eye size={14} className="mr-2" />
                    Ver Detalle
                  </Button>
                </div>
              ) : canContinueToPruebas() ? (
                <Button 
                  className="w-full"
                  onClick={() => router.push(`/taller/evaluacion/${evaluacionId}/pruebas`)}
                >
                  <Wrench size={16} className="mr-2" />
                  Realizar Pruebas
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  <Clock size={16} className="mr-2" />
                  Pendiente
                </Button>
              )}
            </div>

            {/* Evaluación Final */}
            <div className="space-y-3">
              <h4 className="font-medium">Evaluación Final</h4>
              {currentEvaluacion.evaluacionFinal ? (
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle size={16} className="mr-2" />
                    Completada
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => router.push(`/taller/evaluacion/${evaluacionId}/final`)}
                  >
                    <Eye size={14} className="mr-2" />
                    Ver Detalle
                  </Button>
                </div>
              ) : canContinueToFinal() ? (
                <Button 
                  className="w-full"
                  onClick={() => router.push(`/taller/evaluacion/${evaluacionId}/final`)}
                >
                  <FileText size={16} className="mr-2" />
                  Finalizar Evaluación
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  <Clock size={16} className="mr-2" />
                  Pendiente
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Reparaciones */}
      {currentEvaluacion.reparacionesRecomendadas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign size={20} />
              Reparaciones Recomendadas
            </CardTitle>
            <CardDescription>
              {currentEvaluacion.reparacionesRecomendadas.length} reparaciones sugeridas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentEvaluacion.reparacionesRecomendadas.map((reparacion, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium">{reparacion.nombre}</h5>
                      <p className="text-sm text-gray-600">{reparacion.descripcion}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <DollarSign size={14} />
                          ${reparacion.montoEstimado.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {reparacion.tiempoEstimado}h
                        </span>
                        <Badge 
                          variant={
                            reparacion.prioridad === 'critico' ? 'destructive' :
                            reparacion.prioridad === 'importante' ? 'default' : 'secondary'
                          }
                        >
                          {reparacion.prioridad}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function EvaluacionDetallePage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute requiredRoles={['Taller']}>
      <EvaluacionDetalleContent params={params} />
    </ProtectedRoute>
  );
}
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { useEvaluacionTallerStore } from '@/lib/store/evaluacion-taller-store';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { PruebasTecnicas } from '@/components/taller/evaluacion/PruebasTecnicas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Car,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CreatePruebasTecnicasData } from '@/types/evaluaciontaller';

function PruebasTecnicasDetalleContent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    currentEvaluacion, 
    fetchEvaluacion, 
    updatePruebasTecnicas,
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

  const handleSave = async (data: CreatePruebasTecnicasData) => {
    if (!evaluacionId) return false;
    
    try {
      const success = await updatePruebasTecnicas(data);
      if (success) {
        toast({
          title: "Éxito",
          description: "Pruebas técnicas guardadas correctamente",
        });
        router.push(`/taller/evaluacion/${evaluacionId}`);
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar las pruebas técnicas",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleCancel = () => {
    router.push(`/taller/evaluacion/${evaluacionId}`);
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

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push(`/taller/evaluacion/${evaluacionId}`)}
        >
          <ArrowLeft size={16} className="mr-2" />
          Volver al Detalle
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pruebas Técnicas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Realiza las pruebas técnicas del vehículo
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

      {/* Formulario de Pruebas Técnicas */}
      <PruebasTecnicas
        evaluacionId={evaluacionId}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default function PruebasTecnicasDetallePage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute requiredRoles={['Taller']}>
      <PruebasTecnicasDetalleContent params={params} />
    </ProtectedRoute>
  );
}
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { CitaTaller } from '@/types/evaluaciontaller';
import { CitaCard } from './CitaCard';

interface CitasHoyProps {
  citas: CitaTaller[];
  onUpdateEstado: (id: string, nuevoEstado: string) => Promise<void>;
  onVerDetalle: (id: string) => void;
  onVerTodas: () => void;
  isLoading?: boolean;
}

export function CitasHoy({ 
  citas, 
  onUpdateEstado, 
  onVerDetalle, 
  onVerTodas, 
  isLoading = false 
}: CitasHoyProps) {
  const citasPendientes = citas.filter(cita => cita.estado === 'pendiente');
  const citasConfirmadas = citas.filter(cita => cita.estado === 'confirmada');
  const citasEnProceso = citas.filter(cita => cita.estado === 'en_proceso');
  const citasCompletadas = citas.filter(cita => cita.estado === 'completada');

  const totalCitas = citas.length;
  const citasActivas = citasPendientes.length + citasConfirmadas.length + citasEnProceso.length;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={20} />
            Citas de Hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Citas de Hoy
            </CardTitle>
            <CardDescription>
              {totalCitas} citas programadas para hoy
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onVerTodas}>
            Ver Todas
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{citasPendientes.length}</div>
            <div className="text-sm text-gray-500">Pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{citasConfirmadas.length}</div>
            <div className="text-sm text-gray-500">Confirmadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{citasEnProceso.length}</div>
            <div className="text-sm text-gray-500">En Proceso</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{citasCompletadas.length}</div>
            <div className="text-sm text-gray-500">Completadas</div>
          </div>
        </div>

        {/* Lista de citas */}
        {totalCitas === 0 ? (
          <div className="text-center py-8">
            <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay citas para hoy
            </h3>
            <p className="text-gray-500">
              No tienes citas programadas para hoy
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Citas pendientes */}
            {citasPendientes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={16} className="text-yellow-600" />
                  <h4 className="font-medium text-yellow-800">Pendientes de Confirmación</h4>
                  <Badge variant="secondary">{citasPendientes.length}</Badge>
                </div>
                <div className="space-y-2">
                  {citasPendientes.slice(0, 2).map((cita) => (
                    <CitaCard
                      key={cita.id}
                      cita={cita}
                      onUpdateEstado={onUpdateEstado}
                      onVerDetalle={onVerDetalle}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Citas confirmadas */}
            {citasConfirmadas.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={16} className="text-blue-600" />
                  <h4 className="font-medium text-blue-800">Confirmadas</h4>
                  <Badge variant="secondary">{citasConfirmadas.length}</Badge>
                </div>
                <div className="space-y-2">
                  {citasConfirmadas.slice(0, 2).map((cita) => (
                    <CitaCard
                      key={cita.id}
                      cita={cita}
                      onUpdateEstado={onUpdateEstado}
                      onVerDetalle={onVerDetalle}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Citas en proceso */}
            {citasEnProceso.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-orange-600" />
                  <h4 className="font-medium text-orange-800">En Proceso</h4>
                  <Badge variant="secondary">{citasEnProceso.length}</Badge>
                </div>
                <div className="space-y-2">
                  {citasEnProceso.map((cita) => (
                    <CitaCard
                      key={cita.id}
                      cita={cita}
                      onUpdateEstado={onUpdateEstado}
                      onVerDetalle={onVerDetalle}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Mostrar más si hay muchas citas */}
            {totalCitas > 4 && (
              <div className="text-center pt-2">
                <Button variant="outline" size="sm" onClick={onVerTodas}>
                  Ver {totalCitas - 4} citas más
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
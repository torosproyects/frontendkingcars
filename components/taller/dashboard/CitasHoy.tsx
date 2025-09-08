"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Eye
} from 'lucide-react';
import { CitaTaller } from '@/types/evaluaciontaller';
import { EstadoCita } from '../citas/EstadoCita';

interface CitasHoyProps {
  citas: CitaTaller[];
  onUpdateEstado: (id: string, nuevoEstado: string) => Promise<void>;
  onVerDetalle: (id: string) => void;
  onVerTodas: () => void;
  isLoading?: boolean;
}

interface CitaItemProps {
  cita: CitaTaller;
  onVerDetalle: (id: string) => void;
  onUpdateEstado: (id: string, nuevoEstado: string) => Promise<void>;
  isLoading: boolean;
}

interface SeccionCitasProps {
  titulo: string;
  icono: React.ReactNode;
  color: string;
  citas: CitaTaller[];
  maxItems?: number;
  onVerDetalle: (id: string) => void;
  onUpdateEstado: (id: string, nuevoEstado: string) => Promise<void>;
  isLoading: boolean;
}

// Componente reutilizable para cada item de cita
const CitaItem: React.FC<CitaItemProps> = ({ cita, onVerDetalle, onUpdateEstado, isLoading }) => {
  const formatHora = (hora: string) => {
    return new Date(`2000-01-01T${hora}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <div>
              <p className="font-medium text-sm">
                Cita #{cita.id.slice(-6)}
              </p>
              <p className="text-xs text-gray-500">
                {formatHora(cita.hora)} • Vehículo: {cita.vehiculoId.slice(-6)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onVerDetalle(cita.id)}
            aria-label={`Ver detalles de la cita ${cita.id.slice(-6)}`}
          >
            <Eye size={12} />
          </Button>
          <EstadoCita
            cita={cita}
            onUpdateEstado={onUpdateEstado}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

// Componente reutilizable para cada sección de citas
const SeccionCitas: React.FC<SeccionCitasProps> = ({ 
  titulo, 
  icono, 
  color, 
  citas, 
  maxItems = 2, 
  onVerDetalle, 
  onUpdateEstado, 
  isLoading 
}) => {
  if (citas.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icono}
        <h4 className={`font-medium ${color}`}>{titulo}</h4>
        <Badge variant="secondary">{citas.length}</Badge>
      </div>
      <div className="space-y-2">
        {citas.slice(0, maxItems).map((cita) => (
          <CitaItem
            key={cita.id}
            cita={cita}
            onVerDetalle={onVerDetalle}
            onUpdateEstado={onUpdateEstado}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export function CitasHoy({ 
  citas, 
  onUpdateEstado, 
  onVerDetalle, 
  onVerTodas, 
  isLoading = false 
}: CitasHoyProps) {
  // Optimizar filtrado con useMemo
  const citasPorEstado = useMemo(() => ({
    pendientes: citas.filter(cita => cita.estado === 'pendiente'),
    confirmadas: citas.filter(cita => cita.estado === 'confirmada'),
    enProceso: citas.filter(cita => cita.estado === 'en_proceso'),
    completadas: citas.filter(cita => cita.estado === 'completada')
  }), [citas]);

  const estadisticas = useMemo(() => ({
    total: citas.length,
    activas: citasPorEstado.pendientes.length + citasPorEstado.confirmadas.length + citasPorEstado.enProceso.length,
    pendientes: citasPorEstado.pendientes.length,
    confirmadas: citasPorEstado.confirmadas.length,
    enProceso: citasPorEstado.enProceso.length,
    completadas: citasPorEstado.completadas.length
  }), [citas.length, citasPorEstado]);

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
              {estadisticas.total} citas programadas para hoy
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
            <div className="text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</div>
            <div className="text-sm text-gray-500">Pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{estadisticas.confirmadas}</div>
            <div className="text-sm text-gray-500">Confirmadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{estadisticas.enProceso}</div>
            <div className="text-sm text-gray-500">En Proceso</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{estadisticas.completadas}</div>
            <div className="text-sm text-gray-500">Completadas</div>
          </div>
        </div>

        {/* Lista de citas */}
        {estadisticas.total === 0 ? (
          <div className="text-center py-8">
            <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay citas para hoy
            </h3>
            <p className="text-gray-500 mb-4">
              No tienes citas programadas para hoy
            </p>
            <p className="text-sm text-gray-400">
              Las citas aparecerán aquí cuando estén programadas
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Citas pendientes */}
            <SeccionCitas
              titulo="Pendientes de Confirmación"
              icono={<AlertCircle size={16} className="text-yellow-600" />}
              color="text-yellow-800"
              citas={citasPorEstado.pendientes}
              maxItems={2}
              onVerDetalle={onVerDetalle}
              onUpdateEstado={onUpdateEstado}
              isLoading={isLoading}
            />

            {/* Citas confirmadas */}
            <SeccionCitas
              titulo="Confirmadas"
              icono={<CheckCircle size={16} className="text-blue-600" />}
              color="text-blue-800"
              citas={citasPorEstado.confirmadas}
              maxItems={2}
              onVerDetalle={onVerDetalle}
              onUpdateEstado={onUpdateEstado}
              isLoading={isLoading}
            />

            {/* Citas en proceso */}
            <SeccionCitas
              titulo="En Proceso"
              icono={<Clock size={16} className="text-orange-600" />}
              color="text-orange-800"
              citas={citasPorEstado.enProceso}
              maxItems={undefined} // Mostrar todas las citas en proceso
              onVerDetalle={onVerDetalle}
              onUpdateEstado={onUpdateEstado}
              isLoading={isLoading}
            />

            {/* Mostrar más si hay muchas citas */}
            {estadisticas.total > 4 && (
              <div className="text-center pt-2">
                <Button variant="outline" size="sm" onClick={onVerTodas}>
                  Ver {estadisticas.total - 4} citas más
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


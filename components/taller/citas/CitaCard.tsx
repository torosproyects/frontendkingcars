"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Car, 
  User, 
  Phone, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { CitaTaller } from '@/types/evaluaciontaller';

interface CitaCardProps {
  cita: CitaTaller;
  onUpdateEstado: (id: string, nuevoEstado: string) => Promise<void>;
  onVerDetalle: (id: string) => void;
  isLoading?: boolean;
}

const ESTADOS_CONFIG = {
  pendiente: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    icon: AlertCircle,
  },
  confirmada: {
    label: 'Confirmada',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: CheckCircle,
  },
  en_proceso: {
    label: 'En Proceso',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    icon: Clock,
  },
  completada: {
    label: 'Completada',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: CheckCircle,
  },
  cancelada: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: XCircle,
  },
} as const;

export function CitaCard({ cita, onUpdateEstado, onVerDetalle, isLoading = false }: CitaCardProps) {
  const estadoConfig = ESTADOS_CONFIG[cita.estado as keyof typeof ESTADOS_CONFIG];
  const EstadoIcon = estadoConfig?.icon || AlertCircle;

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatHora = (hora: string) => {
    return new Date(`2000-01-01T${hora}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAccionesDisponibles = () => {
    switch (cita.estado) {
      case 'pendiente':
        return [
          { label: 'Confirmar', estado: 'confirmada', variant: 'default' as const },
          { label: 'Cancelar', estado: 'cancelada', variant: 'destructive' as const },
        ];
      case 'confirmada':
        return [
          { label: 'Iniciar', estado: 'en_proceso', variant: 'default' as const },
          { label: 'Cancelar', estado: 'cancelada', variant: 'destructive' as const },
        ];
      case 'en_proceso':
        return [
          { label: 'Completar', estado: 'completada', variant: 'default' as const },
        ];
      default:
        return [];
    }
  };

  const acciones = getAccionesDisponibles();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar size={20} />
            Cita #{cita.id.slice(-6)}
          </CardTitle>
          <Badge className={estadoConfig?.color || 'bg-gray-100 text-gray-800'}>
            <EstadoIcon size={14} className="mr-1" />
            {estadoConfig?.label || cita.estado}
          </Badge>
        </div>
        <CardDescription>
          {formatFecha(cita.fecha)} a las {formatHora(cita.hora)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Información del Vehículo */}
        <div className="flex items-center gap-3">
          <Car size={20} className="text-gray-500" />
          <div>
            <p className="font-medium">Vehículo</p>
            <p className="text-sm text-gray-600">ID: {cita.vehiculoId}</p>
          </div>
        </div>

        {/* Información del Cliente */}
        <div className="flex items-center gap-3">
          <User size={20} className="text-gray-500" />
          <div>
            <p className="font-medium">Cliente</p>
            <p className="text-sm text-gray-600">ID: {cita.clienteId}</p>
          </div>
        </div>

        {/* Descripción */}
        {cita.descripcion && (
          <div>
            <p className="font-medium text-sm mb-1">Descripción</p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {cita.descripcion}
            </p>
          </div>
        )}

        {/* Observaciones */}
        {cita.observaciones && (
          <div>
            <p className="font-medium text-sm mb-1">Observaciones</p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {cita.observaciones}
            </p>
          </div>
        )}

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-500">Creada</p>
            <p className="text-gray-900">
              {new Date(cita.fechaCreacion).toLocaleDateString('es-ES')}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-500">Actualizada</p>
            <p className="text-gray-900">
              {new Date(cita.fechaActualizacion).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVerDetalle(cita.id)}
            className="flex-1"
          >
            <Eye size={14} className="mr-1" />
            Ver Detalle
          </Button>
          
          {acciones.map((accion, index) => (
            <Button
              key={index}
              variant={accion.variant}
              size="sm"
              onClick={() => onUpdateEstado(cita.id, accion.estado)}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                accion.label
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Save,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CitaTaller } from '@/types/evaluaciontaller';

interface EstadoCitaProps {
  cita: CitaTaller;
  onUpdateEstado: (id: string, nuevoEstado: string) => Promise<void>;
  isLoading?: boolean;
}

const ESTADOS_CONFIG = {
  pendiente: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    icon: AlertCircle,
    nextStates: ['confirmada', 'cancelada'],
    description: 'Cita pendiente de confirmación'
  },
  confirmada: {
    label: 'Confirmada',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: CheckCircle,
    nextStates: ['en_proceso', 'cancelada'],
    description: 'Cita confirmada y lista para procesar'
  },
  en_proceso: {
    label: 'En Proceso',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    icon: Clock,
    nextStates: ['completada'],
    description: 'Cita en proceso de atención'
  },
  completada: {
    label: 'Completada',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: CheckCircle,
    nextStates: [],
    description: 'Cita completada exitosamente'
  },
  cancelada: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: XCircle,
    nextStates: ['pendiente'],
    description: 'Cita cancelada'
  },
} as const;

export function EstadoCita({ cita, onUpdateEstado, isLoading = false }: EstadoCitaProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const estadoActual = ESTADOS_CONFIG[cita.estado as keyof typeof ESTADOS_CONFIG];
  const EstadoIcon = estadoActual?.icon || AlertCircle;

  const handleUpdateEstado = async () => {
    if (!nuevoEstado) return;
    
    setIsUpdating(true);
    try {
      await onUpdateEstado(cita.id, nuevoEstado);
      toast({
        title: "Éxito",
        description: `Estado de cita actualizado a ${ESTADOS_CONFIG[nuevoEstado as keyof typeof ESTADOS_CONFIG]?.label}`,
      });
      setIsOpen(false);
      setNuevoEstado('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar el estado de la cita",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const canChangeState = estadoActual?.nextStates && estadoActual.nextStates.length > 0;

  return (
    <div className="flex items-center gap-3">
      {/* Estado Actual */}
      <div className="flex items-center gap-2">
        <EstadoIcon size={16} />
        <Badge className={estadoActual?.color || 'bg-gray-100 text-gray-800'}>
          {estadoActual?.label || cita.estado}
        </Badge>
      </div>

      {/* Botón para cambiar estado */}
      {canChangeState && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              disabled={isLoading}
            >
              <RotateCcw size={14} className="mr-1" />
              Cambiar Estado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cambiar Estado de Cita</DialogTitle>
              <DialogDescription>
                Selecciona el nuevo estado para la cita #{cita.id.slice(-6)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Estado actual */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Estado Actual</p>
                <div className="flex items-center gap-2 mt-1">
                  <EstadoIcon size={16} />
                  <span className="font-medium">{estadoActual?.label}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {estadoActual?.description}
                </p>
              </div>

              {/* Nuevo estado */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nuevo Estado</label>
                <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadoActual?.nextStates?.map((estado) => {
                      const config = ESTADOS_CONFIG[estado as keyof typeof ESTADOS_CONFIG];
                      const Icon = config?.icon || AlertCircle;
                      return (
                        <SelectItem key={estado} value={estado}>
                          <div className="flex items-center gap-2">
                            <Icon size={14} />
                            <span>{config?.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Información del nuevo estado */}
              {nuevoEstado && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {ESTADOS_CONFIG[nuevoEstado as keyof typeof ESTADOS_CONFIG]?.label}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    {ESTADOS_CONFIG[nuevoEstado as keyof typeof ESTADOS_CONFIG]?.description}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleUpdateEstado}
                disabled={!nuevoEstado || isUpdating}
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Save size={14} className="mr-2" />
                    Actualizar Estado
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Indicador de estado final */}
      {!canChangeState && (
        <div className="text-xs text-gray-500">
          Estado final
        </div>
      )}
    </div>
  );
}
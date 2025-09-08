"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Users, 
  Copy, 
  Trash2, 
  Plus,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { HorarioDia, HorarioHora, HORARIOS_DISPONIBLES, PLANTILLAS_HORARIO } from '@/types/evaluacion-taller';
import { useToast } from '@/hooks/use-toast';

interface ModalHorarioDiaProps {
  abierto: boolean;
  onCerrar: () => void;
  fecha: string;
  horarioDia: HorarioDia | null;
  tallerId: string;
  onGuardar: (data: any) => Promise<boolean>;
  onEliminar: () => Promise<boolean>;
  onCopiar: (fechaDestino: string) => Promise<boolean>;
}

export function ModalHorarioDia({
  abierto,
  onCerrar,
  fecha,
  horarioDia,
  tallerId,
  onGuardar,
  onEliminar,
  onCopiar
}: ModalHorarioDiaProps) {
  const { toast } = useToast();
  const [horarios, setHorarios] = useState<HorarioHora[]>([]);
  const [bloqueado, setBloqueado] = useState(false);
  const [motivoBloqueo, setMotivoBloqueo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [fechaCopiar, setFechaCopiar] = useState('');
  
  // Estados para funcionalidades avanzadas
  const [horaInicioRango, setHoraInicioRango] = useState('08:00');
  const [horaFinRango, setHoraFinRango] = useState('18:00');
  const [capacidadRango, setCapacidadRango] = useState(1);

  // Inicializar horarios
  useEffect(() => {
    if (horarioDia) {
      setHorarios(horarioDia.horarios);
      setBloqueado(horarioDia.bloqueado);
      setMotivoBloqueo(horarioDia.motivoBloqueo || '');
    } else {
      // Crear horarios por defecto (8:00-18:00)
      const horariosDefault = HORARIOS_DISPONIBLES.map(hora => ({
        hora,
        activo: false,
        capacidad: 1,
        citasAgendadas: 0
      }));
      setHorarios(horariosDefault);
      setBloqueado(false);
      setMotivoBloqueo('');
    }
  }, [horarioDia]);

  // Formatear fecha para mostrar
  const formatearFechaMostrar = (fecha: string) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Manejar cambio de estado de horario
  const manejarCambioHorario = (hora: string, activo: boolean) => {
    setHorarios(prev => 
      prev.map(h => h.hora === hora ? { ...h, activo } : h)
    );
  };

  // Manejar cambio de capacidad
  const manejarCambioCapacidad = (hora: string, capacidad: number) => {
    setHorarios(prev => 
      prev.map(h => h.hora === hora ? { ...h, capacidad } : h)
    );
  };

  // Activar todos los horarios (optimizado con useCallback)
  const activarTodos = useCallback(() => {
    setHorarios(prev => prev.map(h => ({ ...h, activo: true })));
  }, []);

  // Desactivar todos los horarios (optimizado con useCallback)
  const desactivarTodos = useCallback(() => {
    setHorarios(prev => prev.map(h => ({ ...h, activo: false })));
  }, []);

  // Aplicar plantilla predefinida (optimizado con useCallback)
  const aplicarPlantilla = useCallback((plantilla: any) => {
    setHorarios(prev => prev.map(horario => {
      const estaEnRango = plantilla.horarios.some((rango: any) => 
        horario.hora >= rango.horaInicio && horario.hora <= rango.horaFin
      );
      
      if (estaEnRango) {
        return {
          ...horario,
          activo: true,
          capacidad: plantilla.horarios[0].capacidad
        };
      }
      return horario;
    }));
  }, []);

  // Aplicar configuración por rango (optimizado con useCallback)
  const aplicarRango = useCallback(() => {
    if (!horaInicioRango || !horaFinRango) return;
    
    setHorarios(prev => prev.map(horario => {
      if (horario.hora >= horaInicioRango && horario.hora <= horaFinRango) {
        return {
          ...horario,
          activo: true,
          capacidad: capacidadRango
        };
      }
      return horario;
    }));
  }, [horaInicioRango, horaFinRango, capacidadRango]);

  // Verificar si la fecha es pasada
  const esFechaPasada = (fecha: string) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaComparar = new Date(fecha);
    fechaComparar.setHours(0, 0, 0, 0);
    return fechaComparar < hoy;
  };

  // Guardar cambios
  const manejarGuardar = async () => {
    // Validar que no sea fecha pasada
    if (esFechaPasada(fecha)) {
      toast({
        title: "Fecha no disponible",
        description: "No puedes configurar horarios para días pasados",
        variant: "destructive",
      });
      return;
    }

    setCargando(true);
    try {
      const data = {
        horarios: horarios.map(h => ({
          hora: h.hora,
          activo: h.activo,
          capacidad: h.capacidad
        })),
        bloqueado,
        motivoBloqueo: bloqueado ? motivoBloqueo : undefined
      };

      const exito = await onGuardar(data);
      
      if (exito) {
        toast({
          title: "Éxito",
          description: "Horarios guardados correctamente",
        });
        onCerrar();
      } else {
        toast({
          title: "Error",
          description: "No se pudieron guardar los horarios",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error inesperado al guardar",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  };

  // Eliminar horario del día
  const manejarEliminar = async () => {
    if (!horarioDia) return;
    
    setCargando(true);
    try {
      const exito = await onEliminar();
      
      if (exito) {
        toast({
          title: "Éxito",
          description: "Horario eliminado correctamente",
        });
        onCerrar();
      } else {
        toast({
          title: "Error",
          description: "No se pudo eliminar el horario",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error inesperado al eliminar",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  };

  // Copiar horarios a otra fecha
  const manejarCopiar = async () => {
    if (!fechaCopiar) {
      toast({
        title: "Error",
        description: "Selecciona una fecha de destino",
        variant: "destructive",
      });
      return;
    }

    setCargando(true);
    try {
      const exito = await onCopiar(fechaCopiar);
      
      if (exito) {
        toast({
          title: "Éxito",
          description: `Horarios copiados a ${formatearFechaMostrar(fechaCopiar)}`,
        });
        setFechaCopiar('');
      } else {
        toast({
          title: "Error",
          description: "No se pudieron copiar los horarios",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error inesperado al copiar",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  };

  const horariosActivos = horarios.filter(h => h.activo).length;
  const totalCapacidad = horarios.reduce((sum, h) => sum + (h.activo ? h.capacidad : 0), 0);

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300 w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Horarios - {formatearFechaMostrar(fecha)}
            {esFechaPasada(fecha) && (
              <Badge variant="destructive" className="ml-2">
                <AlertCircle className="h-3 w-3 mr-1" />
                Fecha Pasada
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {esFechaPasada(fecha) 
              ? "Esta fecha ya pasó, no puedes configurar horarios"
              : "Configura los horarios disponibles para este día"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado del día */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="bloqueado"
                  checked={bloqueado}
                  onCheckedChange={setBloqueado}
                />
                <Label htmlFor="bloqueado">Día bloqueado</Label>
              </div>
              
              {bloqueado && (
                <div className="flex-1 max-w-md">
                  <Input
                    placeholder="Motivo del bloqueo"
                    value={motivoBloqueo}
                    onChange={(e) => setMotivoBloqueo(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {horariosActivos} horarios activos
              <Users className="h-4 w-4 ml-2" />
              {totalCapacidad} capacidad total
            </div>
          </div>

          {/* Controles rápidos */}
          <div className="space-y-4">
            {/* Botones básicos */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={activarTodos}
                disabled={cargando || esFechaPasada(fecha)}
                className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-1" />
                Activar Todos
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={desactivarTodos}
                disabled={cargando || esFechaPasada(fecha)}
                className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
              >
                Desactivar Todos
              </Button>
            </div>

            {/* Plantillas predefinidas */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Plantillas rápidas:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PLANTILLAS_HORARIO.map((plantilla) => (
                  <Button
                    key={plantilla.id}
                    variant="outline"
                    size="sm"
                    onClick={() => aplicarPlantilla(plantilla)}
                    disabled={cargando || esFechaPasada(fecha)}
                    className="text-xs transition-all duration-200 hover:scale-105"
                  >
                    {plantilla.nombre}
                  </Button>
                ))}
              </div>
            </div>

            {/* Controles por rango */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Configurar por rango:</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={horaInicioRango}
                    onChange={(e) => setHoraInicioRango(e.target.value)}
                    className="w-24"
                    disabled={cargando || esFechaPasada(fecha)}
                  />
                  <span className="flex items-center text-sm text-gray-500">a</span>
                  <Input
                    type="time"
                    value={horaFinRango}
                    onChange={(e) => setHoraFinRango(e.target.value)}
                    className="w-24"
                    disabled={cargando || esFechaPasada(fecha)}
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={capacidadRango}
                    onChange={(e) => setCapacidadRango(parseInt(e.target.value) || 1)}
                    className="w-16"
                    disabled={cargando || esFechaPasada(fecha)}
                    placeholder="Cap."
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={aplicarRango}
                    disabled={cargando || esFechaPasada(fecha) || !horaInicioRango || !horaFinRango}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de horarios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {horarios.map((horario, index) => (
              <div
                key={horario.hora}
                className={`p-3 border rounded-lg transition-all duration-300 hover:shadow-md ${
                  horario.activo 
                    ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeInUp 0.3s ease-out forwards'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{horario.hora}</span>
                  </div>
                  
                  <Switch
                    checked={horario.activo}
                    onCheckedChange={(activo) => manejarCambioHorario(horario.hora, activo)}
                    disabled={cargando || esFechaPasada(fecha)}
                  />
                </div>

                {horario.activo && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <Label htmlFor={`capacidad-${horario.hora}`} className="text-sm">
                        Capacidad:
                      </Label>
                    </div>
                    <Input
                      id={`capacidad-${horario.hora}`}
                      type="number"
                      min="1"
                      max="10"
                      value={horario.capacidad}
                      onChange={(e) => manejarCambioCapacidad(horario.hora, parseInt(e.target.value) || 1)}
                      disabled={cargando || esFechaPasada(fecha)}
                      className="w-full"
                    />
                    
                    {horario.citasAgendadas > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {horario.citasAgendadas} citas agendadas
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Copiar horarios */}
          {horarioDia && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Copiar horarios a otra fecha
              </h3>
              
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={fechaCopiar}
                  onChange={(e) => setFechaCopiar(e.target.value)}
                  disabled={cargando}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={manejarCopiar}
                  disabled={cargando || !fechaCopiar}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {horarioDia && (
            <Button
              variant="destructive"
              onClick={manejarEliminar}
              disabled={cargando}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          )}
          
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              onClick={onCerrar}
              disabled={cargando}
            >
              Cancelar
            </Button>
            <Button
              onClick={manejarGuardar}
              disabled={cargando || esFechaPasada(fecha)}
            >
              {cargando ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
      
      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Dialog>
  );
}

"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { HorarioDia } from '@/types/evaluacion-taller';
import dynamic from 'next/dynamic';

// Lazy loading del modal para mejor performance
const ModalHorarioDia = dynamic(() => import('./ModalHorarioDia').then(mod => ({ default: mod.ModalHorarioDia })), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-96 w-full" />,
  ssr: false
});

interface CalendarioHorariosProps {
  tallerId: string;
  horariosDia: HorarioDia[];
  isLoading: boolean;
  onUpdateHorarioDia: (tallerId: string, fecha: string, data: any) => Promise<boolean>;
  onCreateHorarioDia: (tallerId: string, data: any) => Promise<boolean>;
  onDeleteHorarioDia: (tallerId: string, fecha: string) => Promise<boolean>;
  onCopiarHorariosDia: (tallerId: string, fechaOrigen: string, fechaDestino: string) => Promise<boolean>;
}

interface DiaCalendario {
  fecha: string;
  numero: number;
  esHoy: boolean;
  esPasado: boolean;
  esOtroMes: boolean;
  horarioDia?: HorarioDia;
}

export function CalendarioHorarios({
  tallerId,
  horariosDia,
  isLoading,
  onUpdateHorarioDia,
  onCreateHorarioDia,
  onDeleteHorarioDia,
  onCopiarHorariosDia
}: CalendarioHorariosProps) {
  const [añoActual, setAñoActual] = useState(new Date().getFullYear());
  const [mesActual, setMesActual] = useState(new Date().getMonth() + 1);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Nombres de los meses
  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Nombres de los días de la semana
  const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Generar días del calendario
  const diasCalendario = useMemo(() => {
    const primerDiaMes = new Date(añoActual, mesActual - 1, 1);
    const ultimoDiaMes = new Date(añoActual, mesActual, 0);
    const primerDiaSemana = primerDiaMes.getDay();
    const diasEnMes = ultimoDiaMes.getDate();
    
    const hoy = new Date();
    const esHoy = (fecha: string) => {
      const fechaObj = new Date(fecha);
      return fechaObj.toDateString() === hoy.toDateString();
    };
    
    const esPasado = (fecha: string) => {
      const fechaObj = new Date(fecha);
      fechaObj.setHours(23, 59, 59, 999);
      return fechaObj < hoy;
    };

    const dias: DiaCalendario[] = [];
    
    // Días del mes anterior
    const mesAnterior = new Date(añoActual, mesActual - 2, 0);
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      const dia = mesAnterior.getDate() - i;
      const fecha = `${añoActual}-${String(mesActual - 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      dias.push({
        fecha,
        numero: dia,
        esHoy: esHoy(fecha),
        esPasado: esPasado(fecha),
        esOtroMes: true
      });
    }
    
    // Días del mes actual
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = `${añoActual}-${String(mesActual).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      const horarioDia = Array.isArray(horariosDia) ? horariosDia.find(h => h.fecha === fecha) : undefined;
      
      dias.push({
        fecha,
        numero: dia,
        esHoy: esHoy(fecha),
        esPasado: esPasado(fecha),
        esOtroMes: false,
        horarioDia
      });
    }
    
    // Días del mes siguiente
    const diasRestantes = 42 - dias.length; // 6 semanas * 7 días
    for (let dia = 1; dia <= diasRestantes; dia++) {
      const fecha = `${añoActual}-${String(mesActual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      dias.push({
        fecha,
        numero: dia,
        esHoy: esHoy(fecha),
        esPasado: esPasado(fecha),
        esOtroMes: true
      });
    }
    
    return dias;
  }, [añoActual, mesActual, horariosDia]);

  // Navegación del calendario (optimizado con useCallback)
  const cambiarMes = useCallback((direccion: 'anterior' | 'siguiente') => {
    if (direccion === 'anterior') {
      if (mesActual === 1) {
        setMesActual(12);
        setAñoActual(prev => prev - 1);
      } else {
        setMesActual(prev => prev - 1);
      }
    } else {
      if (mesActual === 12) {
        setMesActual(1);
        setAñoActual(prev => prev + 1);
      } else {
        setMesActual(prev => prev + 1);
      }
    }
  }, [mesActual]);

  // Manejar selección de día (optimizado con useCallback)
  const manejarSeleccionDia = useCallback((dia: DiaCalendario) => {
    if (dia.esPasado) return; // No permitir seleccionar días pasados
    
    setDiaSeleccionado(dia.fecha);
    setModalAbierto(true);
  }, []);

  // Obtener estado visual del día
  const obtenerEstadoDia = (dia: DiaCalendario) => {
    if (dia.esPasado) return 'pasado';
    if (dia.horarioDia?.bloqueado) return 'bloqueado';
    if (dia.horarioDia?.horarios.some(h => h.activo)) return 'disponible';
    return 'sin_configurar';
  };

  // Obtener estadísticas del mes
  const estadisticasMes = useMemo(() => {
    const diasDelMes = diasCalendario.filter(d => !d.esOtroMes);
    const diasDisponibles = diasDelMes.filter(d => obtenerEstadoDia(d) === 'disponible').length;
    const diasBloqueados = diasDelMes.filter(d => obtenerEstadoDia(d) === 'bloqueado').length;
    const diasSinConfigurar = diasDelMes.filter(d => obtenerEstadoDia(d) === 'sin_configurar').length;
    
    return { diasDisponibles, diasBloqueados, diasSinConfigurar };
  }, [diasCalendario]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendario de Horarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendario de Horarios
            </CardTitle>
            
            {/* Navegación del calendario */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => cambiarMes('anterior')}
                disabled={isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <h3 className="text-lg font-semibold min-w-[200px] text-center">
                {nombresMeses[mesActual - 1]} {añoActual}
              </h3>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => cambiarMes('siguiente')}
                disabled={isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Estadísticas del mes */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {estadisticasMes.diasDisponibles} disponibles
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="h-4 w-4 text-red-500" />
              {estadisticasMes.diasBloqueados} bloqueados
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-gray-500" />
              {estadisticasMes.diasSinConfigurar} sin configurar
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Header de días de la semana */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {nombresDias.map((dia) => (
              <div key={dia} className="text-center text-sm font-medium text-muted-foreground py-2">
                {dia}
              </div>
            ))}
          </div>
          
          {/* Grid del calendario */}
          <div className="grid grid-cols-7 gap-2">
            {diasCalendario.map((dia) => {
              const estado = obtenerEstadoDia(dia);
              const esSeleccionado = diaSeleccionado === dia.fecha;
              
              return (
                <button
                  key={dia.fecha}
                  onClick={() => manejarSeleccionDia(dia)}
                  disabled={dia.esPasado}
                  className={`
                    relative p-2 h-16 rounded-lg border transition-all duration-200
                    ${dia.esOtroMes ? 'text-muted-foreground bg-muted/30' : ''}
                    ${dia.esPasado ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'}
                    ${dia.esHoy ? 'ring-2 ring-blue-500' : ''}
                    ${esSeleccionado ? 'ring-2 ring-primary' : ''}
                    ${estado === 'disponible' ? 'bg-green-50 border-green-200 hover:bg-green-100' : ''}
                    ${estado === 'bloqueado' ? 'bg-red-50 border-red-200 hover:bg-red-100' : ''}
                    ${estado === 'sin_configurar' ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' : ''}
                    ${estado === 'pasado' ? 'bg-gray-100 border-gray-300' : ''}
                  `}
                >
                  <div className="text-sm font-medium">
                    {dia.numero}
                  </div>
                  
                  {/* Indicadores de estado */}
                  <div className="absolute bottom-1 right-1 flex gap-1">
                    {estado === 'disponible' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" title="Disponible" />
                    )}
                    {estado === 'bloqueado' && (
                      <div className="w-2 h-2 bg-red-500 rounded-full" title="Bloqueado" />
                    )}
                    {estado === 'sin_configurar' && !dia.esPasado && (
                      <div className="w-2 h-2 bg-gray-400 rounded-full" title="Sin configurar" />
                    )}
                  </div>
                  
                  {/* Indicador de hoy */}
                  {dia.esHoy && (
                    <div className="absolute top-1 left-1 w-2 h-2 bg-blue-500 rounded-full" title="Hoy" />
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Leyenda */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Disponible
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              Bloqueado
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              Sin configurar
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Hoy
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de configuración de horarios */}
      {modalAbierto && diaSeleccionado && (
        <ModalHorarioDia
          abierto={modalAbierto}
          onCerrar={() => {
            setModalAbierto(false);
            setDiaSeleccionado(null);
          }}
          fecha={diaSeleccionado}
          horarioDia={Array.isArray(horariosDia) ? horariosDia.find(h => h.fecha === diaSeleccionado) || null : null}
          tallerId={tallerId}
          onGuardar={async (data) => {
            const horarioExistente = Array.isArray(horariosDia) ? horariosDia.find(h => h.fecha === diaSeleccionado) : undefined;
            if (horarioExistente) {
              return await onUpdateHorarioDia(tallerId, diaSeleccionado, data);
            } else {
              return await onCreateHorarioDia(tallerId, data);
            }
          }}
          onEliminar={async () => {
            return await onDeleteHorarioDia(tallerId, diaSeleccionado);
          }}
          onCopiar={async (fechaDestino) => {
            return await onCopiarHorariosDia(tallerId, diaSeleccionado, fechaDestino);
          }}
        />
      )}
    </>
  );
}

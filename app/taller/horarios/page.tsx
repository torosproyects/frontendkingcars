"use client";

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useEvaluacionTallerStore } from '@/lib/store/evaluacion-taller-store';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Settings,
  ArrowLeft
} from 'lucide-react';
import { CalendarioHorarios } from '@/components/taller/horarios/CalendarioHorarios';
import { useRouter } from 'next/navigation';

function HorariosContent() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    horariosDia,
    isLoading, 
    error,
    fetchHorariosPorMes,
    createHorarioDia,
    updateHorarioDia,
    deleteHorarioDia,
    copiarHorariosDia
  } = useEvaluacionTallerStore();

  const [añoActual, setAñoActual] = useState(new Date().getFullYear());
  const [mesActual, setMesActual] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    if (user?.id) {
      fetchHorariosPorMes(user.id, añoActual, mesActual);
    }
  }, [user?.id, añoActual, mesActual, fetchHorariosPorMes]);

  const handleUpdateHorarioDia = async (tallerId: string, fecha: string, data: any) => {
    return await updateHorarioDia(tallerId, fecha, data);
  };

  const handleCreateHorarioDia = async (tallerId: string, data: any) => {
    return await createHorarioDia(tallerId, data);
  };

  const handleDeleteHorarioDia = async (tallerId: string, fecha: string) => {
    return await deleteHorarioDia(tallerId, fecha);
  };

  const handleCopiarHorariosDia = async (tallerId: string, fechaOrigen: string, fechaDestino: string) => {
    return await copiarHorariosDia(tallerId, fechaOrigen, fechaDestino);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
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
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestión de Horarios
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Configura tus horarios de disponibilidad por día
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Vista Calendario
          </Badge>
        </div>
      </div>

      {/* Información de ayuda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cómo usar el calendario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h3 className="font-medium">📅 Seleccionar día</h3>
              <p className="text-muted-foreground">
                Haz clic en cualquier día del mes para configurar sus horarios
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">⏰ Configurar horarios</h3>
              <p className="text-muted-foreground">
                Activa/desactiva horarios de 8:00 a 18:00 y define la capacidad
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">📋 Copiar horarios</h3>
              <p className="text-muted-foreground">
                Copia horarios de un día a otro para ahorrar tiempo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendario de horarios */}
      <CalendarioHorarios
        tallerId={user?.id || ''}
        horariosDia={horariosDia}
        isLoading={isLoading}
        onUpdateHorarioDia={handleUpdateHorarioDia}
        onCreateHorarioDia={handleCreateHorarioDia}
        onDeleteHorarioDia={handleDeleteHorarioDia}
        onCopiarHorariosDia={handleCopiarHorariosDia}
      />

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Días con horarios</p>
                <p className="text-2xl font-bold">
                  {Array.isArray(horariosDia) ? horariosDia.filter(h => h.horarios.some(horario => horario.activo)).length : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Horarios activos</p>
                <p className="text-2xl font-bold">
                  {Array.isArray(horariosDia) ? horariosDia.reduce((sum, h) => 
                    sum + h.horarios.filter(horario => horario.activo).length, 0
                  ) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Capacidad total</p>
                <p className="text-2xl font-bold">
                  {Array.isArray(horariosDia) ? horariosDia.reduce((sum, h) => 
                    sum + h.horarios.reduce((hSum, horario) => 
                      hSum + (horario.activo ? horario.capacidad : 0), 0
                    ), 0
                  ) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function HorariosPage() {
  return (
    <ProtectedRoute requiredRoles={['Taller']}>
      <HorariosContent />
    </ProtectedRoute>
  );
}
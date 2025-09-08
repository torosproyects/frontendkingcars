"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Car, 
  Wrench, 
  CheckCircle, 
  Clock,
  DollarSign,
  Users
} from 'lucide-react';
import { EvaluacionTaller, CitaTaller } from '@/types/evaluaciontaller';

interface EstadisticasTallerProps {
  evaluaciones: EvaluacionTaller[];
  citas: CitaTaller[];
  isLoading?: boolean;
}

export function EstadisticasTaller({ evaluaciones, citas, isLoading = false }: EstadisticasTallerProps) {
  // Calcular estadísticas de evaluaciones
  const evaluacionesCompletadas = evaluaciones.filter(e => e.estadoTaller === 'evaluado').length;
  const evaluacionesEnProceso = evaluaciones.filter(e => e.estadoTaller === 'en_evaluacion').length;
  const evaluacionesEnReparacion = evaluaciones.filter(e => e.estadoTaller === 'en_reparacion').length;
  const evaluacionesReparadas = evaluaciones.filter(e => e.estadoTaller === 'reparado').length;

  // Calcular estadísticas de citas
  const citasCompletadas = citas.filter(c => c.estado === 'completada').length;
  const citasPendientes = citas.filter(c => c.estado === 'pendiente').length;
  const citasConfirmadas = citas.filter(c => c.estado === 'confirmada').length;
  const citasEnProceso = citas.filter(c => c.estado === 'en_proceso').length;

  // Calcular ingresos estimados
  const ingresosEstimados = evaluaciones.length > 0 
    ? evaluaciones.reduce((total, evaluacion) => {
        return total + (evaluacion.reparacionesRecomendadas?.reduce((sum, rep) => sum + rep.montoEstimado, 0) || 0);
      }, 0)
    : 0;

  // Calcular tiempo promedio de evaluación
  const tiempoPromedioEvaluacion = evaluaciones.length > 0 
    ? evaluaciones.reduce((sum, evaluacion) => {
        if (evaluacion.evaluacionFinal) {
          const inicio = new Date(evaluacion.fechaCreacion);
          const fin = new Date(evaluacion.evaluacionFinal.fechaEvaluacion);
          return sum + (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60); // en horas
        }
        return sum;
      }, 0) / evaluaciones.length
    : 0;

  // Calcular eficiencia (evaluaciones completadas / total evaluaciones)
  const eficiencia = evaluaciones.length > 0 ? (evaluacionesCompletadas / evaluaciones.length) * 100 : 0;

  // Estadísticas del mes actual
  const mesActual = new Date().getMonth();
  const añoActual = new Date().getFullYear();
  
  const evaluacionesEsteMes = evaluaciones.filter(evaluacion => {
    const fecha = new Date(evaluacion.fechaCreacion);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
  }).length;

  const citasEsteMes = citas.filter(cita => {
    const fecha = new Date(cita.fechaCreacion);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
  }).length;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Si no hay datos, mostrar mensaje informativo
  if (evaluaciones.length === 0 && citas.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TrendingUp size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Sin datos disponibles
          </h3>
          <p className="text-gray-500 text-center mb-4">
            Aún no tienes evaluaciones o citas registradas para mostrar estadísticas
          </p>
          <p className="text-sm text-gray-400">
            Las estadísticas aparecerán aquí una vez que comiences a trabajar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluaciones Totales</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluaciones.length}</div>
            <p className="text-xs text-muted-foreground">
              {evaluacionesEsteMes} este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citas.length}</div>
            <p className="text-xs text-muted-foreground">
              {citasEsteMes} este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eficiencia.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Evaluaciones completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Estimados</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${ingresosEstimados.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              En reparaciones recomendadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas detalladas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estado de Evaluaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench size={20} />
              Estado de Evaluaciones
            </CardTitle>
            <CardDescription>
              Distribución por estado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">En Evaluación</span>
                </div>
                <span className="font-medium">{evaluacionesEnProceso}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Evaluadas</span>
                </div>
                <span className="font-medium">{evaluacionesCompletadas}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">En Reparación</span>
                </div>
                <span className="font-medium">{evaluacionesEnReparacion}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Reparadas</span>
                </div>
                <span className="font-medium">{evaluacionesReparadas}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado de Citas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} />
              Estado de Citas
            </CardTitle>
            <CardDescription>
              Distribución por estado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Pendientes</span>
                </div>
                <span className="font-medium">{citasPendientes}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Confirmadas</span>
                </div>
                <span className="font-medium">{citasConfirmadas}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">En Proceso</span>
                </div>
                <span className="font-medium">{citasEnProceso}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Completadas</span>
                </div>
                <span className="font-medium">{citasCompletadas}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tiempo Promedio de Evaluación</span>
                <span className="font-medium">{tiempoPromedioEvaluacion.toFixed(1)}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Evaluaciones Completadas</span>
                <span className="font-medium">{evaluacionesCompletadas}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tasa de Finalización</span>
                <span className="font-medium">{eficiencia.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign size={20} />
              Financiero
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ingresos Estimados</span>
                <span className="font-medium">${ingresosEstimados.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Promedio por Evaluación</span>
                <span className="font-medium">
                  ${evaluaciones.length > 0 ? (ingresosEstimados / evaluaciones.length).toFixed(0) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Evaluaciones con Reparaciones</span>
                <span className="font-medium">
                  {evaluaciones.length > 0 
                    ? evaluaciones.filter(e => e.reparacionesRecomendadas?.length > 0).length 
                    : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
    
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EvaluationSummary as EvaluationSummaryType } from '@/types/car-evaluation-json';
import { Download, CheckCircle, AlertTriangle, Clock, DollarSign } from 'lucide-react';

interface EvaluationSummaryProps {
  summary: EvaluationSummaryType;
  onExport: () => void;
  onComplete: () => void;
  isComplete: boolean;
}

export function EvaluationSummary({ 
  summary, 
  onExport, 
  onComplete,
  isComplete 
}: EvaluationSummaryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle size={20} className="text-green-600" />;
      case 'good': return <CheckCircle size={20} className="text-blue-600" />;
      case 'fair': return <AlertTriangle size={20} className="text-yellow-600" />;
      case 'poor': return <AlertTriangle size={20} className="text-orange-600" />;
      case 'critical': return <AlertTriangle size={20} className="text-red-600" />;
      default: return <Clock size={20} className="text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bueno';
      case 'fair': return 'Regular';
      case 'poor': return 'Malo';
      case 'critical': return 'Crítico';
      default: return 'Sin evaluar';
    }
  };

  const progressPercentage = summary.totalParts > 0 
    ? Math.round((summary.evaluatedParts / summary.totalParts) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Resumen de Evaluación
        </CardTitle>
        <CardDescription>
          Progreso y estado general de la evaluación del vehículo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Barra de progreso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progreso de Evaluación</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500">
            {summary.evaluatedParts} de {summary.totalParts} partes evaluadas
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {summary.totalParts}
            </div>
            <div className="text-sm text-gray-500">Total Partes</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {summary.evaluatedParts}
            </div>
            <div className="text-sm text-gray-500">Evaluadas</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {summary.needsAttention}
            </div>
            <div className="text-sm text-gray-500">Atención</div>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {summary.criticalIssues}
            </div>
            <div className="text-sm text-gray-500">Críticas</div>
          </div>
        </div>

        {/* Estado general */}
        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(summary.overallStatus)}
            <div>
              <div className="font-semibold">Estado General</div>
              <div className={`text-sm px-2 py-1 rounded-full ${getStatusColor(summary.overallStatus)}`}>
                {getStatusText(summary.overallStatus)}
              </div>
            </div>
          </div>
        </div>

        {/* Estimaciones */}
        {(summary.estimatedRepairCost || summary.estimatedRepairTime) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summary.estimatedRepairTime && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Clock size={20} className="text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-900">Tiempo Estimado</div>
                  <div className="text-sm text-blue-700">
                    {summary.estimatedRepairTime} horas
                  </div>
                </div>
              </div>
            )}
            
            {summary.estimatedRepairCost && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <DollarSign size={20} className="text-green-600" />
                <div>
                  <div className="font-semibold text-green-900">Costo Estimado</div>
                  <div className="text-sm text-green-700">
                    ${summary.estimatedRepairCost.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recomendaciones */}
        {summary.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Recomendaciones</h4>
            <ul className="space-y-1">
              {summary.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onExport}
            className="flex-1"
          >
            <Download size={16} className="mr-2" />
            Exportar JSON
          </Button>
          
          <Button
            onClick={onComplete}
            disabled={!isComplete}
            className="flex-1"
          >
            <CheckCircle size={16} className="mr-2" />
            Completar Evaluación
          </Button>
        </div>

        {/* Mensaje de estado */}
        {!isComplete && (
          <div className="text-center text-sm text-gray-500">
            Evalúa al menos una parte del vehículo para completar la evaluación
          </div>
        )}
      </CardContent>
    </Card>
  );
}

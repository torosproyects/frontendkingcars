"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CarEvaluationJSON, CarPartEvaluation, ExternalData, CarPart } from '@/types/car-evaluation-json';
import { Carro } from '@/types/carro';
import { ExternalDataPanel } from './ExternalDataPanel';
import { InteractiveCarSVG } from './InteractiveCarSVG';
import { EvaluationSummary } from './EvaluationSummary';
import { Download, Save, AlertTriangle } from 'lucide-react';

interface InteractiveCarEvaluationProps {
  evaluationType: 'entrada' | 'pruebas' | 'final';
  onEvaluationComplete: (data: CarEvaluationJSON) => void;
  carro: Carro;
}

export function InteractiveCarEvaluation({ 
  evaluationType, 
  onEvaluationComplete,
  carro 
}: InteractiveCarEvaluationProps) {
  const [evaluationData, setEvaluationData] = useState<CarEvaluationJSON>({
    metadata: {
      evaluationId: `eval_${Date.now()}`,
      carroId: carro.id,
      evaluationType,
      technicianId: '', // Se llenará con datos del usuario
      technicianName: '',
      timestamp: new Date().toISOString(),
      version: '1.0'
    },
    externalData: {
      kilometraje: {
        value: carro.kilometraje,
        unit: 'km',
        source: 'manual',
        timestamp: new Date().toISOString()
      },
      fuel: {
        level: 0, // Se llenará externamente
        type: 'gasolina',
        source: 'manual',
        timestamp: new Date().toISOString()
      }
    },
    carParts: [],
    summary: {
      totalParts: 0,
      evaluatedParts: 0,
      criticalIssues: 0,
      needsAttention: 0,
      overallStatus: 'good',
      recommendations: []
    }
  });

  const handlePartEvaluation = (partData: CarPartEvaluation) => {
    setEvaluationData(prev => {
      const existingIndex = prev.carParts.findIndex(p => p.partId === partData.partId);
      let updatedParts;
      
      if (existingIndex >= 0) {
        // Actualizar evaluación existente
        updatedParts = [...prev.carParts];
        updatedParts[existingIndex] = partData;
      } else {
        // Agregar nueva evaluación
        updatedParts = [...prev.carParts, partData];
      }

      // Calcular estadísticas
      const evaluatedParts = updatedParts.length;
      const criticalIssues = updatedParts.filter(p => p.status === 'critical').length;
      const needsAttention = updatedParts.filter(p => p.status === 'needs_attention').length;
      
      let overallStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' = 'good';
      if (criticalIssues > 0) overallStatus = 'critical';
      else if (needsAttention > 2) overallStatus = 'poor';
      else if (needsAttention > 0) overallStatus = 'fair';
      else if (evaluatedParts > 0) overallStatus = 'excellent';

      return {
        ...prev,
        carParts: updatedParts,
        summary: {
          ...prev.summary,
          evaluatedParts,
          criticalIssues,
          needsAttention,
          overallStatus,
          totalParts: Math.max(prev.summary.totalParts, evaluatedParts)
        }
      };
    });
  };

  const handleExternalDataUpdate = (data: Partial<ExternalData>) => {
    setEvaluationData(prev => ({
      ...prev,
      externalData: { ...prev.externalData, ...data }
    }));
  };

  const exportToJSON = () => {
    const jsonString = JSON.stringify(evaluationData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluacion_${carro.placa}_${evaluationType}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleComplete = () => {
    // Actualizar metadatos finales
    const finalData = {
      ...evaluationData,
      metadata: {
        ...evaluationData.metadata,
        timestamp: new Date().toISOString()
      }
    };
    onEvaluationComplete(finalData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🚗 Evaluación Interactiva del Vehículo
          </CardTitle>
          <CardDescription>
            Haz clic en las partes del carro para evaluarlas. Tipo de evaluación: {evaluationType}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Vehículo</p>
              <p className="font-semibold">
                {carro.marca} {carro.modelo} ({carro.year})
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Placa</p>
              <p className="font-semibold">{carro.placa}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Kilometraje</p>
              <p className="font-semibold">{carro.kilometraje.toLocaleString()} km</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información importante */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900 mb-2">Información Importante</p>
            <p className="text-blue-700 text-sm">
              Si no evalúas una parte específica, se asumirá que está en <strong>buen estado</strong> sin fallas. 
              Solo marca como "Necesita Atención" o "Crítico" si encuentras problemas reales.
            </p>
          </div>
        </div>
      </div>

      {/* Panel de datos externos */}
      <ExternalDataPanel 
        data={evaluationData.externalData}
        onUpdate={handleExternalDataUpdate}
      />

      {/* Componente interactivo del carro */}
      <InteractiveCarSVG 
        evaluationType={evaluationType}
        onPartClick={handlePartEvaluation}
        evaluatedParts={evaluationData.carParts}
      />

      {/* Resumen y acciones */}
      <EvaluationSummary 
        summary={evaluationData.summary}
        onExport={exportToJSON}
        onComplete={handleComplete}
        isComplete={evaluationData.summary.evaluatedParts > 0}
      />
    </div>
  );
}

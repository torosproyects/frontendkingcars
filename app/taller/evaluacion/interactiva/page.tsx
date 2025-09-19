"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { InteractiveCarEvaluation } from '@/components/taller/evaluacion/InteractiveCarEvaluation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CarEvaluationJSON } from '@/types/car-evaluation-json';
import { Carro } from '@/types/carro';

// Datos de ejemplo para el carro
const exampleCar: Carro = {
  id: 'car_example_001',
  marca: 'Toyota',
  modelo: 'Corolla',
  year: 2020,
  placa: 'ABC-123',
  kilometraje: 45000,
  colorExterior: 'Blanco',
  colorInterior: 'Negro',
  tipoCombustible: 'gasolina',
  transmision: 'automatica',
  estado: 'disponible',
  precio: 25000,
  descripcion: 'Vehículo en excelente estado',
  fechaCreacion: new Date().toISOString(),
  fechaActualizacion: new Date().toISOString()
};

function InteractiveEvaluationContent() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [evaluationType, setEvaluationType] = useState<'entrada' | 'pruebas' | 'final'>('entrada');
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluationComplete = (data: CarEvaluationJSON) => {
    setIsEvaluating(false);
    
    // Aquí puedes guardar los datos en tu store o API
    console.log('Evaluación completada:', data);
    
    toast({
      title: "✅ Evaluación Completada",
      description: `Se ha completado la evaluación de ${evaluationType} del vehículo ${exampleCar.placa}`,
    });

    // Opcional: redirigir al dashboard
    setTimeout(() => {
      router.push('/taller');
    }, 2000);
  };

  const startEvaluation = () => {
    setIsEvaluating(true);
  };

  const stopEvaluation = () => {
    setIsEvaluating(false);
  };

  if (isEvaluating) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={stopEvaluation}
          >
            <ArrowLeft size={16} className="mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Evaluación Interactiva
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Evaluación de {evaluationType} - {exampleCar.placa}
            </p>
          </div>
        </div>

        {/* Componente principal */}
        <InteractiveCarEvaluation
          evaluationType={evaluationType}
          onEvaluationComplete={handleEvaluationComplete}
          carro={exampleCar}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/taller')}
        >
          <ArrowLeft size={16} className="mr-2" />
          Volver al Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Evaluación Interactiva de Vehículos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sistema de evaluación visual con partes interactivas
          </p>
        </div>
      </div>

      {/* Información del vehículo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car size={20} />
            Vehículo de Prueba
          </CardTitle>
          <CardDescription>
            Este es un vehículo de ejemplo para probar el sistema de evaluación interactiva
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Vehículo</p>
              <p className="font-semibold">
                {exampleCar.marca} {exampleCar.modelo} ({exampleCar.year})
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Placa</p>
              <p className="font-semibold">{exampleCar.placa}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Kilometraje</p>
              <p className="font-semibold">{exampleCar.kilometraje.toLocaleString()} km</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de evaluación */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Evaluación</CardTitle>
          <CardDescription>
            Selecciona el tipo de evaluación que deseas realizar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Tipo de Evaluación
            </label>
            <Select value={evaluationType} onValueChange={(value: any) => setEvaluationType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">
                  <div>
                    <div className="font-medium">Evaluación de Entrada</div>
                    <div className="text-sm text-gray-500">Inspección visual inicial del vehículo</div>
                  </div>
                </SelectItem>
                <SelectItem value="pruebas">
                  <div>
                    <div className="font-medium">Pruebas Técnicas</div>
                    <div className="text-sm text-gray-500">Mediciones y pruebas específicas por parte</div>
                  </div>
                </SelectItem>
                <SelectItem value="final">
                  <div>
                    <div className="font-medium">Evaluación Final</div>
                    <div className="text-sm text-gray-500">Resumen y recomendaciones finales</div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              {evaluationType === 'entrada' && 'Evaluación de Entrada'}
              {evaluationType === 'pruebas' && 'Pruebas Técnicas'}
              {evaluationType === 'final' && 'Evaluación Final'}
            </h4>
            <p className="text-sm text-blue-700">
              {evaluationType === 'entrada' && 'Inspección visual inicial del vehículo. Evalúa el estado general de cada parte (Excelente, Bueno, Regular, Malo).'}
              {evaluationType === 'pruebas' && 'Pruebas técnicas detalladas. Incluye mediciones específicas como presión de neumáticos, temperatura del motor, etc.'}
              {evaluationType === 'final' && 'Evaluación final con recomendaciones de reparación y estimaciones de costo y tiempo.'}
            </p>
          </div>

          <Button onClick={startEvaluation} className="w-full">
            Iniciar Evaluación Interactiva
          </Button>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Características del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">🎯 Interactivo</h4>
              <p className="text-sm text-gray-600">
                Haz clic en cualquier parte del carro para evaluarla
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">📊 Dinámico</h4>
              <p className="text-sm text-gray-600">
                Campos de evaluación específicos según el tipo y la parte
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">📸 Fotos</h4>
              <p className="text-sm text-gray-600">
                Captura hasta 2 fotos por parte evaluada
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">📄 JSON</h4>
              <p className="text-sm text-gray-600">
                Exporta toda la evaluación en formato JSON estructurado
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function InteractiveEvaluationPage() {
  return (
    <ProtectedRoute requiredRoles={['Taller']}>
      <InteractiveEvaluationContent />
    </ProtectedRoute>
  );
}

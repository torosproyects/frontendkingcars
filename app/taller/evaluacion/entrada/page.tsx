"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { useEvaluacionTallerStore } from '@/lib/store/evaluacion-taller-store';
import { useCarsStore } from '@/lib/store/cars-store';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { EvaluacionEntrada } from '@/components/taller/evaluacion/EvaluacionEntrada';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Car, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Carro } from '@/types/carro';
import { CreateEvaluacionEntradaData } from '@/types/evaluaciontaller';

function EvaluacionEntradaContent() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { createEvaluacionEntrada } = useEvaluacionTallerStore();
  const { allCars } = useCarsStore(); // Solo obtenemos cars, sin fetchCars
  const { toast } = useToast();

  const [selectedCarro, setSelectedCarro] = useState<Carro | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filtramos los carros disponibles (sin fetchCars)
  const filteredCars = allCars.filter((carro: Carro) => 
    carro.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carro.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carro.modelo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCarroSelect = (carro: Carro) => {
    setSelectedCarro(carro);
  };

  const handleSave = async (data: CreateEvaluacionEntradaData) => {
    if (!user?.id) return false;
    
    setIsLoading(true);
    try {
      const success = await createEvaluacionEntrada(data);
      if (success) {
        toast({
          title: "Éxito",
          description: "Evaluación de entrada creada correctamente",
        });
        router.push('/taller');
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear la evaluación",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/taller');
  };

  if (selectedCarro) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedCarro(null)}
          >
            <ArrowLeft size={16} className="mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Evaluación de Entrada
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Registra el estado inicial del vehículo
            </p>
          </div>
        </div>

        <EvaluacionEntrada
          carro={selectedCarro}
          onSave={handleSave}
          onCancel={handleCancel}
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
            Seleccionar Vehículo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Elige el vehículo para realizar la evaluación de entrada
          </p>
        </div>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search size={20} />
            Buscar Vehículo
          </CardTitle>
          <CardDescription>
            Busca por placa, marca o modelo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Término de búsqueda</Label>
              <Input
                id="search"
                placeholder="Ingresa placa, marca o modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Vehículos */}
      <div className="space-y-4">
        {filteredCars.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Car size={48} className="text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron vehículos
              </h3>
              <p className="text-gray-500 text-center">
                {searchTerm 
                  ? 'No hay vehículos que coincidan con tu búsqueda'
                  : 'No hay vehículos disponibles en el sistema'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCars.map((carro: Carro) => (
            <Card key={carro.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Car size={20} className="text-gray-500" />
                      <div>
                        <h3 className="font-medium">
                          {carro.marca} {carro.modelo} ({carro.year})
                        </h3>
                        <p className="text-sm text-gray-500">
                          Placa: {carro.placa} • {carro.kilometraje.toLocaleString()} km
                        </p>
                        <p className="text-sm text-gray-500">
                          Color: {carro.colorExterior}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleCarroSelect(carro)}
                      className="flex items-center gap-2"
                    >
                      Seleccionar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default function EvaluacionEntradaPage() {
  return (
    <ProtectedRoute requiredRoles={['Taller']}>
      <EvaluacionEntradaContent />
    </ProtectedRoute>
  );
}
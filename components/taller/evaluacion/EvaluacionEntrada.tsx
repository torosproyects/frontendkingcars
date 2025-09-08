"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Camera, 
  Upload, 
  Car, 
  Save,
  X,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EstadoExterior, EstadoInterior, CreateEvaluacionEntradaData } from '@/types/evaluaciontaller';
import { Carro } from '@/types/carro';

interface EvaluacionEntradaProps {
  carro: Carro;
  onSave: (data: CreateEvaluacionEntradaData) => Promise<boolean>;
  onCancel: () => void;
}

const ESTADOS = [
  { value: 'excelente', label: 'Excelente' },
  { value: 'bueno', label: 'Bueno' },
  { value: 'regular', label: 'Regular' },
  { value: 'malo', label: 'Malo' },
] as const;

export function EvaluacionEntrada({ carro, onSave, onCancel }: EvaluacionEntradaProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fotos, setFotos] = useState<File[]>([]);
  
  const [formData, setFormData] = useState<CreateEvaluacionEntradaData>({
    carroId: carro.id,
    kilometrajeEntrada: carro.kilometraje,
    estadoExterior: {
      carroceria: 'bueno',
      pintura: 'bueno',
      neumaticos: 'bueno',
      luces: 'bueno',
      observaciones: '',
    },
    estadoInterior: {
      asientos: 'bueno',
      tablero: 'bueno',
      aireAcondicionado: 'bueno',
      radio: 'bueno',
      observaciones: '',
    },
    observacionesGenerales: '',
    fotosEntrada: [],
    tecnicoResponsable: '',
  });

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFotos(prev => [...prev, ...files]);
    setFormData(prev => ({ ...prev, fotosEntrada: [...prev.fotosEntrada, ...files] }));
  };

  const removeFoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ 
      ...prev, 
      fotosEntrada: prev.fotosEntrada.filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const success = await onSave(formData);
      if (success) {
        setIsSuccess(true);
        toast({
          title: "✅ Evaluación Guardada",
          description: "La evaluación de entrada se guardó correctamente. Redirigiendo al dashboard...",
        });
        
        // Esperar un poco para mostrar el estado de éxito antes de navegar
        setTimeout(() => {
          // La navegación se maneja en la página padre
        }, 2000);
      } else {
        toast({
          title: "⚠️ Error al Guardar",
          description: "No se pudo guardar la evaluación. Verifica los datos e intenta nuevamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error del Sistema",
        description: "Ocurrió un error inesperado. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Información del Vehículo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car size={20} />
            Información del Vehículo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Vehículo</Label>
              <p className="text-lg font-semibold">
                {carro.marca} {carro.modelo} ({carro.year})
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Placa</Label>
              <p className="text-lg font-semibold">{carro.placa}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Kilometraje Actual</Label>
              <p className="text-lg font-semibold">{carro.kilometraje.toLocaleString()} km</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Color</Label>
              <p className="text-lg font-semibold">{carro.colorExterior}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos de Entrada */}
        <Card>
          <CardHeader>
            <CardTitle>Datos de Entrada</CardTitle>
            <CardDescription>
              Registra la información inicial del vehículo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kilometrajeEntrada">Kilometraje al Ingreso</Label>
                <Input
                  id="kilometrajeEntrada"
                  type="number"
                  value={formData.kilometrajeEntrada}
                  onChange={(e) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      kilometrajeEntrada: parseInt(e.target.value) || 0 
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tecnicoResponsable">Técnico Responsable</Label>
                <Input
                  id="tecnicoResponsable"
                  value={formData.tecnicoResponsable}
                  onChange={(e) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      tecnicoResponsable: e.target.value 
                    }))
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado Exterior */}
        <Card>
          <CardHeader>
            <CardTitle>Estado Exterior</CardTitle>
            <CardDescription>
              Evalúa el estado exterior del vehículo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Carrocería</Label>
                <Select
                  value={formData.estadoExterior.carroceria}
                  onValueChange={(value: any) => 
                    setFormData(prev => ({
                      ...prev,
                      estadoExterior: { ...prev.estadoExterior, carroceria: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pintura</Label>
                <Select
                  value={formData.estadoExterior.pintura}
                  onValueChange={(value: any) => 
                    setFormData(prev => ({
                      ...prev,
                      estadoExterior: { ...prev.estadoExterior, pintura: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Neumáticos</Label>
                <Select
                  value={formData.estadoExterior.neumaticos}
                  onValueChange={(value: any) => 
                    setFormData(prev => ({
                      ...prev,
                      estadoExterior: { ...prev.estadoExterior, neumaticos: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Luces</Label>
                <Select
                  value={formData.estadoExterior.luces}
                  onValueChange={(value: any) => 
                    setFormData(prev => ({
                      ...prev,
                      estadoExterior: { ...prev.estadoExterior, luces: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacionesExterior">Observaciones Exterior</Label>
              <Textarea
                id="observacionesExterior"
                value={formData.estadoExterior.observaciones}
                onChange={(e) => 
                  setFormData(prev => ({
                    ...prev,
                    estadoExterior: { ...prev.estadoExterior, observaciones: e.target.value }
                  }))
                }
                placeholder="Describe el estado exterior del vehículo..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Estado Interior */}
        <Card>
          <CardHeader>
            <CardTitle>Estado Interior</CardTitle>
            <CardDescription>
              Evalúa el estado interior del vehículo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Asientos</Label>
                <Select
                  value={formData.estadoInterior.asientos}
                  onValueChange={(value: any) => 
                    setFormData(prev => ({
                      ...prev,
                      estadoInterior: { ...prev.estadoInterior, asientos: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tablero</Label>
                <Select
                  value={formData.estadoInterior.tablero}
                  onValueChange={(value: any) => 
                    setFormData(prev => ({
                      ...prev,
                      estadoInterior: { ...prev.estadoInterior, tablero: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Aire Acondicionado</Label>
                <Select
                  value={formData.estadoInterior.aireAcondicionado}
                  onValueChange={(value: any) => 
                    setFormData(prev => ({
                      ...prev,
                      estadoInterior: { ...prev.estadoInterior, aireAcondicionado: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Radio/Sistema de Audio</Label>
                <Select
                  value={formData.estadoInterior.radio}
                  onValueChange={(value: any) => 
                    setFormData(prev => ({
                      ...prev,
                      estadoInterior: { ...prev.estadoInterior, radio: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacionesInterior">Observaciones Interior</Label>
              <Textarea
                id="observacionesInterior"
                value={formData.estadoInterior.observaciones}
                onChange={(e) => 
                  setFormData(prev => ({
                    ...prev,
                    estadoInterior: { ...prev.estadoInterior, observaciones: e.target.value }
                  }))
                }
                placeholder="Describe el estado interior del vehículo..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Fotos de Entrada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera size={20} />
              Fotos de Entrada
              <span className="text-sm font-normal text-muted-foreground">(Opcional)</span>
            </CardTitle>
            <CardDescription>
              Captura fotos del estado inicial del vehículo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fotos">Subir Fotos</Label>
              <Input
                id="fotos"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFotoChange}
                className="cursor-pointer"
              />
            </div>

            {fotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {fotos.map((foto, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(foto)}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-20 sm:h-24 object-cover rounded-lg shadow-sm transition-transform group-hover:scale-105"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFoto(index)}
                    >
                      <X size={10} />
                    </Button>
                    <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Observaciones Generales */}
        <Card>
          <CardHeader>
            <CardTitle>Observaciones Generales</CardTitle>
            <CardDescription>
              Comentarios adicionales sobre el estado del vehículo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="observacionesGenerales">Observaciones</Label>
              <Textarea
                id="observacionesGenerales"
                value={formData.observacionesGenerales}
                onChange={(e) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    observacionesGenerales: e.target.value 
                  }))
                }
                placeholder="Describe cualquier observación adicional sobre el vehículo..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Información de Acción */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Save className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 mb-1">
                  ¿Qué pasa al guardar?
                </h3>
                <p className="text-sm text-blue-700">
                  Al guardar esta evaluación, el vehículo será registrado en el sistema del taller 
                  y podrás continuar con las pruebas técnicas. Serás redirigido al dashboard del taller.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || isSuccess}
            className={`w-full sm:w-auto transition-all duration-200 hover:scale-105 ${
              isSuccess ? 'bg-green-600 hover:bg-green-700' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando Evaluación...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle size={16} className="mr-2" />
                ¡Evaluación Guardada!
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Guardar Evaluación
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
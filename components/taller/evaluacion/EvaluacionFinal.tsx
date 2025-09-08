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
  Save,
  Wrench,
  DollarSign,
  Clock,
  Plus,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  CreateEvaluacionFinalData,
  ReparacionRecomendada
} from '@/types/evaluaciontaller';

interface EvaluacionFinalProps {
  evaluacionId: string;
  onSave: (data: CreateEvaluacionFinalData) => Promise<boolean>;
  onCancel: () => void;
}

const PRIORIDADES = [
  { value: 'critico', label: 'Crítico', color: 'text-red-600' },
  { value: 'importante', label: 'Importante', color: 'text-orange-600' },
  { value: 'preventivo', label: 'Preventivo', color: 'text-blue-600' },
] as const;

const CATEGORIAS = [
  { value: 'mecanica', label: 'Mecánica' },
  { value: 'electrico', label: 'Eléctrico' },
  { value: 'carroceria', label: 'Carrocería' },
  { value: 'neumaticos', label: 'Neumáticos' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
] as const;

export function EvaluacionFinal({ evaluacionId, onSave, onCancel }: EvaluacionFinalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [fotos, setFotos] = useState<File[]>([]);
  
  const [formData, setFormData] = useState<CreateEvaluacionFinalData>({
    evaluacionId,
    resumenHallazgos: '',
    prioridadReparaciones: 'importante',
    tiempoEstimadoReparacion: 1,
    observacionesFinales: '',
    fotosFinales: [],
    tecnicoEvaluador: '',
    reparacionesRecomendadas: [],
  });

  const [nuevaReparacion, setNuevaReparacion] = useState<Omit<ReparacionRecomendada, 'id' | 'estado'>>({
    nombre: '',
    descripcion: '',
    prioridad: 'importante',
    montoEstimado: 0,
    tiempoEstimado: 1,
    categoria: 'mecanica',
  });

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFotos(prev => [...prev, ...files]);
    setFormData(prev => ({ ...prev, fotosFinales: [...prev.fotosFinales, ...files] }));
  };

  const addReparacion = () => {
    if (nuevaReparacion.nombre.trim() && nuevaReparacion.descripcion.trim()) {
      setFormData(prev => ({
        ...prev,
        reparacionesRecomendadas: [...prev.reparacionesRecomendadas, nuevaReparacion]
      }));
      setNuevaReparacion({
        nombre: '',
        descripcion: '',
        prioridad: 'importante',
        montoEstimado: 0,
        tiempoEstimado: 1,
        categoria: 'mecanica',
      });
    }
  };

  const removeReparacion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      reparacionesRecomendadas: prev.reparacionesRecomendadas.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await onSave(formData);
      if (success) {
        toast({
          title: "Éxito",
          description: "Evaluación final guardada correctamente",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar la evaluación final",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalMonto = formData.reparacionesRecomendadas.reduce(
    (sum, rep) => sum + rep.montoEstimado, 
    0
  );

  const totalTiempo = formData.reparacionesRecomendadas.reduce(
    (sum, rep) => sum + rep.tiempoEstimado, 
    0
  );

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos de Evaluación Final */}
        <Card>
          <CardHeader>
            <CardTitle>Datos de Evaluación Final</CardTitle>
            <CardDescription>
              Completa la evaluación final del vehículo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tecnicoEvaluador">Técnico Evaluador</Label>
                <Input
                  id="tecnicoEvaluador"
                  value={formData.tecnicoEvaluador}
                  onChange={(e) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      tecnicoEvaluador: e.target.value 
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiempoEstimadoReparacion">Tiempo Estimado (días)</Label>
                <Input
                  id="tiempoEstimadoReparacion"
                  type="number"
                  min="1"
                  value={formData.tiempoEstimadoReparacion}
                  onChange={(e) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      tiempoEstimadoReparacion: parseInt(e.target.value) || 1 
                    }))
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de Hallazgos */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Hallazgos</CardTitle>
            <CardDescription>
              Describe los principales hallazgos de la evaluación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resumenHallazgos">Resumen</Label>
                <Textarea
                  id="resumenHallazgos"
                  value={formData.resumenHallazgos}
                  onChange={(e) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      resumenHallazgos: e.target.value 
                    }))
                  }
                  placeholder="Describe los principales hallazgos de la evaluación..."
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prioridadReparaciones">Prioridad General</Label>
                <Select
                  value={formData.prioridadReparaciones}
                  onValueChange={(value: any) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      prioridadReparaciones: value 
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORIDADES.map((prioridad) => (
                      <SelectItem key={prioridad.value} value={prioridad.value}>
                        <span className={prioridad.color}>{prioridad.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reparaciones Recomendadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench size={20} />
              Reparaciones Recomendadas
            </CardTitle>
            <CardDescription>
              Agrega las reparaciones necesarias con sus costos estimados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Formulario para nueva reparación */}
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Agregar Nueva Reparación</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreReparacion">Nombre</Label>
                  <Input
                    id="nombreReparacion"
                    value={nuevaReparacion.nombre}
                    onChange={(e) => 
                      setNuevaReparacion(prev => ({ 
                        ...prev, 
                        nombre: e.target.value 
                      }))
                    }
                    placeholder="Ej: Cambio de aceite"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoriaReparacion">Categoría</Label>
                  <Select
                    value={nuevaReparacion.categoria}
                    onValueChange={(value: any) => 
                      setNuevaReparacion(prev => ({ 
                        ...prev, 
                        categoria: value 
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS.map((categoria) => (
                        <SelectItem key={categoria.value} value={categoria.value}>
                          {categoria.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="montoReparacion">Monto Estimado ($)</Label>
                  <Input
                    id="montoReparacion"
                    type="number"
                    min="0"
                    value={nuevaReparacion.montoEstimado}
                    onChange={(e) => 
                      setNuevaReparacion(prev => ({ 
                        ...prev, 
                        montoEstimado: parseFloat(e.target.value) || 0 
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiempoReparacion">Tiempo Estimado (horas)</Label>
                  <Input
                    id="tiempoReparacion"
                    type="number"
                    min="1"
                    value={nuevaReparacion.tiempoEstimado}
                    onChange={(e) => 
                      setNuevaReparacion(prev => ({ 
                        ...prev, 
                        tiempoEstimado: parseInt(e.target.value) || 1 
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prioridadReparacion">Prioridad</Label>
                  <Select
                    value={nuevaReparacion.prioridad}
                    onValueChange={(value: any) => 
                      setNuevaReparacion(prev => ({ 
                        ...prev, 
                        prioridad: value 
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORIDADES.map((prioridad) => (
                        <SelectItem key={prioridad.value} value={prioridad.value}>
                          <span className={prioridad.color}>{prioridad.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcionReparacion">Descripción</Label>
                <Textarea
                  id="descripcionReparacion"
                  value={nuevaReparacion.descripcion}
                  onChange={(e) => 
                    setNuevaReparacion(prev => ({ 
                      ...prev, 
                      descripcion: e.target.value 
                    }))
                  }
                  placeholder="Describe la reparación necesaria..."
                  rows={2}
                />
              </div>
              <Button 
                type="button" 
                onClick={addReparacion}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Agregar Reparación
              </Button>
            </div>

            {/* Lista de reparaciones */}
            {formData.reparacionesRecomendadas.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Reparaciones Agregadas</h4>
                {formData.reparacionesRecomendadas.map((reparacion, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium">{reparacion.nombre}</h5>
                        <p className="text-sm text-gray-600">{reparacion.descripcion}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <DollarSign size={14} />
                            ${reparacion.montoEstimado.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {reparacion.tiempoEstimado}h
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            reparacion.prioridad === 'critico' ? 'bg-red-100 text-red-800' :
                            reparacion.prioridad === 'importante' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {PRIORIDADES.find(p => p.value === reparacion.prioridad)?.label}
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeReparacion(index)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Resumen de costos */}
            {formData.reparacionesRecomendadas.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium mb-2">Resumen de Costos</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Estimado:</span>
                    <span className="font-semibold ml-2">${totalMonto.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Tiempo Total:</span>
                    <span className="font-semibold ml-2">{totalTiempo} horas</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fotos Finales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera size={20} />
              Fotos Finales
            </CardTitle>
            <CardDescription>
              Captura fotos del estado final del vehículo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fotosFinales">Subir Fotos</Label>
              <input
                id="fotosFinales"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFotoChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {fotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {fotos.map((foto, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(foto)}
                      alt={`Foto final ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Observaciones Finales */}
        <Card>
          <CardHeader>
            <CardTitle>Observaciones Finales</CardTitle>
            <CardDescription>
              Comentarios adicionales sobre la evaluación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="observacionesFinales">Observaciones</Label>
              <Textarea
                id="observacionesFinales"
                value={formData.observacionesFinales}
                onChange={(e) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    observacionesFinales: e.target.value 
                  }))
                }
                placeholder="Describe cualquier observación adicional sobre la evaluación..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Finalizar Evaluación
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
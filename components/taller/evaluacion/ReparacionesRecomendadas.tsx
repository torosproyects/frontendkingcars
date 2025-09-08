"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Wrench, 
  DollarSign, 
  Clock, 
  Plus, 
  Trash2, 
  Edit,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReparacionRecomendada } from '@/types/evaluaciontaller';

interface ReparacionesRecomendadasProps {
  reparaciones: ReparacionRecomendada[];
  onUpdateReparaciones: (reparaciones: ReparacionRecomendada[]) => void;
  readOnly?: boolean;
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

export function ReparacionesRecomendadas({ 
  reparaciones, 
  onUpdateReparaciones, 
  readOnly = false 
}: ReparacionesRecomendadasProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [nuevaReparacion, setNuevaReparacion] = useState<Omit<ReparacionRecomendada, 'id' | 'estado'>>({
    nombre: '',
    descripcion: '',
    prioridad: 'importante',
    montoEstimado: 0,
    tiempoEstimado: 1,
    categoria: 'mecanica',
  });

  const totalMonto = reparaciones.reduce((sum, rep) => sum + rep.montoEstimado, 0);
  const totalTiempo = reparaciones.reduce((sum, rep) => sum + rep.tiempoEstimado, 0);

  const addReparacion = () => {
    if (nuevaReparacion.nombre.trim() && nuevaReparacion.descripcion.trim()) {
      const reparacion: ReparacionRecomendada = {
        ...nuevaReparacion,
        id: `rep_${Date.now()}`,
        estado: 'pendiente',
      };
      
      onUpdateReparaciones([...reparaciones, reparacion]);
      setNuevaReparacion({
        nombre: '',
        descripcion: '',
        prioridad: 'importante',
        montoEstimado: 0,
        tiempoEstimado: 1,
        categoria: 'mecanica',
      });
      
      toast({
        title: "Éxito",
        description: "Reparación agregada correctamente",
      });
    } else {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
    }
  };

  const updateReparacion = (index: number, updatedRep: ReparacionRecomendada) => {
    const nuevasReparaciones = [...reparaciones];
    nuevasReparaciones[index] = updatedRep;
    onUpdateReparaciones(nuevasReparaciones);
    setEditingIndex(null);
    
    toast({
      title: "Éxito",
      description: "Reparación actualizada correctamente",
    });
  };

  const removeReparacion = (index: number) => {
    const nuevasReparaciones = reparaciones.filter((_, i) => i !== index);
    onUpdateReparaciones(nuevasReparaciones);
    
    toast({
      title: "Éxito",
      description: "Reparación eliminada correctamente",
    });
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setNuevaReparacion({
      nombre: reparaciones[index].nombre,
      descripcion: reparaciones[index].descripcion,
      prioridad: reparaciones[index].prioridad,
      montoEstimado: reparaciones[index].montoEstimado,
      tiempoEstimado: reparaciones[index].tiempoEstimado,
      categoria: reparaciones[index].categoria,
    });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setNuevaReparacion({
      nombre: '',
      descripcion: '',
      prioridad: 'importante',
      montoEstimado: 0,
      tiempoEstimado: 1,
      categoria: 'mecanica',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wrench size={20} />
              Reparaciones Recomendadas
            </CardTitle>
            <CardDescription>
              {reparaciones.length} reparaciones sugeridas
            </CardDescription>
          </div>
          {!readOnly && (
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? (
                <>
                  <X size={16} className="mr-2" />
                  Cancelar
                </>
              ) : (
                <>
                  <Edit size={16} className="mr-2" />
                  Editar
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Formulario para nueva reparación */}
        {isEditing && !readOnly && (
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
              onClick={addReparacion}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Agregar Reparación
            </Button>
          </div>
        )}

        {/* Lista de reparaciones */}
        {reparaciones.length === 0 ? (
          <div className="text-center py-8">
            <Wrench size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay reparaciones recomendadas
            </h3>
            <p className="text-gray-500">
              {isEditing ? 'Agrega las reparaciones necesarias' : 'No se han recomendado reparaciones'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reparaciones.map((reparacion, index) => (
              <div key={reparacion.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-medium">{reparacion.nombre}</h5>
                      <Badge 
                        variant={
                          reparacion.prioridad === 'critico' ? 'destructive' :
                          reparacion.prioridad === 'importante' ? 'default' : 'secondary'
                        }
                      >
                        {PRIORIDADES.find(p => p.value === reparacion.prioridad)?.label}
                      </Badge>
                      <Badge variant="outline">
                        {CATEGORIAS.find(c => c.value === reparacion.categoria)?.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{reparacion.descripcion}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <DollarSign size={14} />
                        ${reparacion.montoEstimado.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {reparacion.tiempoEstimado}h
                      </span>
                    </div>
                  </div>
                  
                  {isEditing && !readOnly && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(index)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeReparacion(index)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumen de costos */}
        {reparaciones.length > 0 && (
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
  );
}
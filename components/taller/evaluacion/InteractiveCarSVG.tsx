"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CarPart, CarPartEvaluation, EvaluationField } from '@/types/car-evaluation-json';
import { EvaluationModal } from './EvaluationModal';
import { Car, Wrench, Zap, Eye } from 'lucide-react';

interface InteractiveCarSVGProps {
  evaluationType: 'entrada' | 'pruebas' | 'final';
  onPartClick: (partData: CarPartEvaluation) => void;
  evaluatedParts: CarPartEvaluation[];
}

export function InteractiveCarSVG({ 
  evaluationType, 
  onPartClick, 
  evaluatedParts 
}: InteractiveCarSVGProps) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  // Definir grupos de partes del carro
  const partGroups = [
    {
      id: 'neumaticos',
      name: 'Neumáticos',
      icon: '🛞',
      color: '#4CAF50',
      description: 'Evaluación de neumáticos y llantas'
    },
    {
      id: 'luces',
      name: 'Sistema de Luces',
      icon: '💡',
      color: '#FFC107',
      description: 'Luces delanteras, traseras y señalización'
    },
    {
      id: 'mecanico',
      name: 'Sistema Mecánico',
      icon: '⚙️',
      color: '#FF5722',
      description: 'Motor, frenos, suspensión y dirección'
    },
    {
      id: 'exterior',
      name: 'Exterior',
      icon: '🚗',
      color: '#2196F3',
      description: 'Carrocería, pintura y elementos exteriores'
    },
    {
      id: 'interior',
      name: 'Interior',
      icon: '🪑',
      color: '#00BCD4',
      description: 'Asientos, tablero y sistemas internos'
    }
  ];

  // Definir las partes específicas agrupadas
  const carPartsByGroup: Record<string, CarPart[]> = {
    neumaticos: [
      {
        id: 'neumatico-delantero-izq',
        name: 'Neumático Delantero Izquierdo',
        category: 'neumaticos',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '🛞',
        color: '#4CAF50'
      },
      {
        id: 'neumatico-delantero-der',
        name: 'Neumático Delantero Derecho',
        category: 'neumaticos',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '🛞',
        color: '#4CAF50'
      },
      {
        id: 'neumatico-trasero-izq',
        name: 'Neumático Trasero Izquierdo',
        category: 'neumaticos',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '🛞',
        color: '#4CAF50'
      },
      {
        id: 'neumatico-trasero-der',
        name: 'Neumático Trasero Derecho',
        category: 'neumaticos',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '🛞',
        color: '#4CAF50'
      }
    ],
    luces: [
      {
        id: 'luces-delanteras',
        name: 'Luces Delanteras',
        category: 'electrico',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '💡',
        color: '#FFC107'
      },
      {
        id: 'luces-traseras',
        name: 'Luces Traseras',
        category: 'electrico',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '💡',
        color: '#FFC107'
      },
      {
        id: 'luces-direccionales',
        name: 'Luces Direccionales',
        category: 'electrico',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '💡',
        color: '#FFC107'
      }
    ],
    mecanico: [
      {
        id: 'motor',
        name: 'Motor',
        category: 'mecanico',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '⚙️',
        color: '#FF5722'
      },
      {
        id: 'frenos',
        name: 'Sistema de Frenos',
        category: 'mecanico',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '🛑',
        color: '#9C27B0'
      },
      {
        id: 'suspension',
        name: 'Suspensión',
        category: 'mecanico',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '🔧',
        color: '#607D8B'
      },
      {
        id: 'direccion',
        name: 'Dirección',
        category: 'mecanico',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '🎯',
        color: '#607D8B'
      }
    ],
    exterior: [
      {
        id: 'carroceria',
        name: 'Carrocería',
        category: 'exterior',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '🚗',
        color: '#2196F3'
      },
      {
        id: 'pintura',
        name: 'Pintura',
        category: 'exterior',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '🎨',
        color: '#2196F3'
      },
      {
        id: 'parachoques',
        name: 'Parachoques',
        category: 'exterior',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '🛡️',
        color: '#2196F3'
      }
    ],
    interior: [
      {
        id: 'asientos',
        name: 'Asientos',
        category: 'interior',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '🪑',
        color: '#00BCD4'
      },
      {
        id: 'tablero',
        name: 'Tablero',
        category: 'interior',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '📊',
        color: '#00BCD4'
      },
      {
        id: 'aire-acondicionado',
        name: 'Aire Acondicionado',
        category: 'interior',
        position: { x: 0, y: 0, width: 0, height: 0 },
        icon: '❄️',
        color: '#00BCD4'
      }
    ]
  };

  const handleGroupClick = (groupId: string) => {
    setSelectedGroup(groupId);
    setSelectedPart(null);
  };

  const handlePartClick = (partId: string) => {
    setSelectedPart(partId);
  };

  const handleBackToGroups = () => {
    setSelectedGroup(null);
    setSelectedPart(null);
  };

  const getPartStatus = (partId: string) => {
    const evaluation = evaluatedParts.find(p => p.partId === partId);
    if (!evaluation) return 'pending';
    return evaluation.status;
  };

  const getPartColor = (part: CarPart) => {
    const status = getPartStatus(part.id);
    switch (status) {
      case 'evaluated': return '#4CAF50'; // Verde
      case 'needs_attention': return '#FF9800'; // Naranja
      case 'critical': return '#F44336'; // Rojo
      default: return part.color; // Color original
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'evaluated': return '✅';
      case 'needs_attention': return '⚠️';
      case 'critical': return '🚨';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car size={20} />
          Vehículo Interactivo
        </CardTitle>
        <CardDescription>
          Haz clic en cualquier parte del carro para evaluarla. 
          {evaluationType === 'entrada' && ' Evaluación visual inicial.'}
          {evaluationType === 'pruebas' && ' Pruebas técnicas detalladas.'}
          {evaluationType === 'final' && ' Evaluación final y recomendaciones.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Navegación */}
          {selectedGroup && (
            <div className="mb-4 flex items-center gap-4">
              <button
                onClick={handleBackToGroups}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ← Volver a Grupos
              </button>
              <div className="text-sm text-gray-500">
                {partGroups.find(g => g.id === selectedGroup)?.name}
              </div>
            </div>
          )}

          {/* Grid de grupos o partes específicas */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            {!selectedGroup ? (
              // Mostrar grupos
              partGroups.map((group) => {
                const groupParts = carPartsByGroup[group.id] || [];
                const evaluatedCount = groupParts.filter(part => 
                  evaluatedParts.some(evaluation => evaluation.partId === part.id)
                ).length;
                const totalCount = groupParts.length;
                
                return (
                  <div
                    key={group.id}
                    className="relative group"
                  >
                    <button
                      onClick={() => handleGroupClick(group.id)}
                      className="w-full h-24 p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 hover:scale-105 hover:shadow-md bg-white border-gray-200 hover:bg-gray-50"
                    >
                      {/* Ícono del grupo */}
                      <div className="text-2xl">
                        {group.icon}
                      </div>
                      
                      {/* Nombre del grupo */}
                      <div className="text-xs font-medium text-center leading-tight">
                        {group.name}
                      </div>
                      
                      {/* Contador de evaluaciones */}
                      {evaluatedCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center">
                          {evaluatedCount}/{totalCount}
                        </div>
                      )}
                    </button>
                    
                    {/* Tooltip con descripción */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      {group.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Mostrar partes específicas del grupo seleccionado
              carPartsByGroup[selectedGroup]?.map((part) => {
                const status = getPartStatus(part.id);
                const color = getPartColor(part);
                const statusIcon = getStatusIcon(status);
                
                return (
                  <div
                    key={part.id}
                    className="relative group"
                  >
                    <button
                      onClick={() => handlePartClick(part.id)}
                      className={`
                        w-full h-24 p-3 rounded-lg border-2 transition-all duration-200
                        flex flex-col items-center justify-center gap-2
                        hover:scale-105 hover:shadow-md
                        ${status === 'pending' 
                          ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' 
                          : status === 'evaluated'
                          ? 'bg-green-50 border-green-300 hover:bg-green-100'
                          : status === 'needs_attention'
                          ? 'bg-orange-50 border-orange-300 hover:bg-orange-100'
                          : 'bg-red-50 border-red-300 hover:bg-red-100'
                        }
                      `}
                    >
                      {/* Ícono de la parte */}
                      <div className="text-2xl">
                        {part.icon}
                      </div>
                      
                      {/* Nombre de la parte */}
                      <div className="text-xs font-medium text-center leading-tight">
                        {part.name}
                      </div>
                      
                      {/* Indicador de estado */}
                      {status !== 'pending' && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                          <span className="text-sm">
                            {statusIcon}
                          </span>
                        </div>
                      )}
                    </button>
                    
                    {/* Tooltip con información adicional */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      {part.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Leyenda de colores */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span>Sin evaluar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>✅ Evaluado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span>⚠️ Necesita atención</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>🚨 Crítico</span>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {Object.values(carPartsByGroup).flat().length}
              </div>
              <div className="text-sm text-gray-500">Total Partes</div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {evaluatedParts.filter(p => p.status === 'evaluated').length}
              </div>
              <div className="text-sm text-gray-500">Evaluadas</div>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {evaluatedParts.filter(p => p.status === 'needs_attention').length}
              </div>
              <div className="text-sm text-gray-500">Atención</div>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {evaluatedParts.filter(p => p.status === 'critical').length}
              </div>
              <div className="text-sm text-gray-500">Críticas</div>
            </div>
          </div>
        </div>

        {/* Modal de evaluación */}
        {selectedPart && (
          <EvaluationModal
            part={Object.values(carPartsByGroup).flat().find(p => p.id === selectedPart)!}
            evaluationType={evaluationType}
            onClose={() => setSelectedPart(null)}
            onSave={(data) => {
              onPartClick(data);
              setSelectedPart(null);
            }}
            existingEvaluation={evaluatedParts.find(p => p.partId === selectedPart)}
          />
        )}
      </CardContent>
    </Card>
  );
}

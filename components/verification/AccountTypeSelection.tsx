'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AccountType } from '@/types/verification';
import { Wrench, User, Building2 } from 'lucide-react';
import { ValidationLabel } from './ValidationLabel';

interface AccountTypeSelectionProps {
  selectedType: AccountType | null;
  onSelect: (type: AccountType) => void;
}

const accountTypes = [
  {
    type: 'Taller' as AccountType,
    title: 'Taller',
    description: 'Para talleres mecánicos y servicios automotrices',
    icon: Wrench,
    features: [
      'Gestión de servicios',
      'Control de inventario',
      'Clientes y citas',
      'Facturación'
    ],
    color: 'bg-orange-50 border-orange-200 hover:border-orange-300',
    selectedColor: 'bg-orange-100 border-orange-500'
  },
  {
    type: 'Usuario' as AccountType,
    title: 'Usuario',
    description: 'Para particulares que compran y venden vehículos',
    icon: User,
    features: [
      'Compra de vehículos',
      'Venta de vehículos',
      'Subastas',
      'Favoritos'
    ],
    color: 'bg-blue-50 border-blue-200 hover:border-blue-300',
    selectedColor: 'bg-blue-100 border-blue-500'
  },
  {
    type: 'Empresa' as AccountType,
    title: 'Empresa',
    description: 'Para empresas del sector automotriz',
    icon: Building2,
    features: [
      'Gestión empresarial',
      'Flota de vehículos',
      'Contratos corporativos',
      'Reportes avanzados'
    ],
    color: 'bg-green-50 border-green-200 hover:border-green-300',
    selectedColor: 'bg-green-100 border-green-500'
  }
];

export function AccountTypeSelection({ selectedType, onSelect }: AccountTypeSelectionProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center px-4">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Selecciona tu tipo de cuenta</h2>
        <p className="text-sm md:text-base text-gray-600">
          Elige el tipo de cuenta que mejor se adapte a tus necesidades
        </p>
      </div>
      
      <ValidationLabel 
        show={!selectedType} 
        message="Selecciona un tipo de cuenta para continuar" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {accountTypes.map((account) => {
          const Icon = account.icon;
          const isSelected = selectedType === account.type;
          
          return (
            <Card
              key={account.type}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg",
                isSelected 
                  ? account.selectedColor 
                  : account.color
              )}
              onClick={() => onSelect(account.type)}
            >
              <CardHeader className="text-center p-4 md:p-6">
                <div className="flex justify-center mb-3 md:mb-4">
                  <div className={cn(
                    "p-2 md:p-3 rounded-full",
                    isSelected 
                      ? "bg-white shadow-md" 
                      : "bg-white/50"
                  )}>
                    <Icon className={cn(
                      "w-6 h-6 md:w-8 md:h-8",
                      isSelected 
                        ? "text-orange-600" 
                        : "text-gray-600"
                    )} />
                  </div>
                </div>
                <CardTitle className="text-lg md:text-xl">{account.title}</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  {account.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-4 md:p-6 pt-0">
                <ul className="space-y-1.5 md:space-y-2">
                  {account.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-xs md:text-sm">
                      <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gray-400 rounded-full mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {isSelected && (
                  <div className="mt-3 md:mt-4 p-2 bg-white rounded-md border">
                    <p className="text-xs text-center font-medium text-gray-700">
                      ✓ Seleccionado
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {selectedType && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">
            Has seleccionado: {selectedType}
          </h3>
          <p className="text-sm text-blue-700">
            Continuaremos con los datos específicos para este tipo de cuenta.
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerificationStep } from '@/types/verification';

interface ProgressIndicatorProps {
  currentStep: VerificationStep;
  completedSteps: VerificationStep[];
}

const stepOrder: VerificationStep[] = [
  'account-type',
  'basic-info', 
  'phone-verification',
  'specific-info',
  'documents',
  'review'
];

const stepLabels = {
  'account-type': 'Tipo de Cuenta',
  'basic-info': 'Información Básica',
  'phone-verification': 'Verificación Teléfono',
  'specific-info': 'Información Específica',
  'documents': 'Documentos',
  'review': 'Revisión'
};

export function ProgressIndicator({ currentStep, completedSteps }: ProgressIndicatorProps) {
  const currentIndex = stepOrder.indexOf(currentStep);
  const isCurrent = completedSteps.includes(currentStep);
  
  return (
    <div className="w-full mb-6 md:mb-8">
      {/* Versión móvil - más compacta */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between mb-4">
          {stepOrder.map((step, index) => {
            const isCompleted = completedSteps.includes(step);
            const isCurrentStep = step === currentStep;
            const isPast = index < currentIndex;
            
            return (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  {/* Línea conectora */}
                  {index > 0 && (
                    <div 
                      className={cn(
                        "h-0.5 flex-1 transition-colors",
                        isCompleted || isPast ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                  )}
                  
                  {/* Icono del paso */}
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all flex-shrink-0",
                    isCompleted 
                      ? "bg-green-500 border-green-500 text-white" 
                      : isCurrentStep
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  )}>
                    {isCompleted ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Circle className="w-3 h-3" />
                    )}
                  </div>
                  
                  {/* Línea conectora */}
                  {index < stepOrder.length - 1 && (
                    <div 
                      className={cn(
                        "h-0.5 flex-1 transition-colors",
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Barra de progreso móvil */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
          <div 
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{ 
              width: `${((completedSteps.length + (isCurrent ? 0.5 : 0)) / stepOrder.length) * 100}%` 
            }}
          />
        </div>
        <p className="text-xs text-gray-600 text-center">
          Paso {currentIndex + 1} de {stepOrder.length}
        </p>
      </div>

      {/* Versión desktop - original */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {stepOrder.map((step, index) => {
            const isCompleted = completedSteps.includes(step);
            const isCurrentStep = step === currentStep;
            const isPast = index < currentIndex;
            
            return (
              <div key={step} className="flex flex-col items-center">
                <div className="flex items-center">
                  {/* Línea conectora */}
                  {index > 0 && (
                    <div 
                      className={cn(
                        "h-0.5 w-8 transition-colors",
                        isCompleted || isPast ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                  )}
                  
                  {/* Icono del paso */}
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                    isCompleted 
                      ? "bg-green-500 border-green-500 text-white" 
                      : isCurrentStep
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  )}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>
                  
                  {/* Línea conectora */}
                  {index < stepOrder.length - 1 && (
                    <div 
                      className={cn(
                        "h-0.5 w-8 transition-colors",
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                  )}
                </div>
                
                {/* Etiqueta del paso */}
                <span className={cn(
                  "text-xs mt-2 text-center max-w-20",
                  isCurrentStep ? "text-blue-600 font-medium" : "text-gray-500"
                )}>
                  {stepLabels[step]}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Barra de progreso general */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((completedSteps.length + (isCurrent ? 0.5 : 0)) / stepOrder.length) * 100}%` 
              }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Paso {currentIndex + 1} de {stepOrder.length}: {stepLabels[currentStep]}
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccountType, documentTemplates, DocumentTemplate } from '@/types/verification';
import CameraModal from '@/components/camara/CameraModal';
import PhotoSlot from '@/components/camara/PhotoSlot';
import { ValidationLabel } from './ValidationLabel';

interface DocumentsStepProps {
  accountType: AccountType;
  documents: {
    dni?: string;
    cif?: string;
    autonomoRegistro?: string;
  };
  onDocumentCapture: (type: 'dni' | 'cif' | 'autonomoRegistro', dataUrl: string) => void;
  onDocumentDelete: (type: 'dni' | 'cif' | 'autonomoRegistro') => void;
}

export function DocumentsStep({ 
  accountType, 
  documents, 
  onDocumentCapture, 
  onDocumentDelete 
}: DocumentsStepProps) {
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [currentDocumentType, setCurrentDocumentType] = useState<'dni' | 'cif' | 'autonomoRegistro' | null>(null);

  // Filtrar templates según el tipo de cuenta
  const requiredTemplates = documentTemplates.filter(template => 
    template.accountType.includes(accountType)
  );

  const getDocumentValue = (templateId: number) => {
    switch (templateId) {
      case 1: return documents.dni;
      case 2: return documents.cif;
      case 3: return documents.autonomoRegistro;
      default: return undefined;
    }
  };

  const getDocumentType = (templateId: number): 'dni' | 'cif' | 'autonomoRegistro' => {
    switch (templateId) {
      case 1: return 'dni';
      case 2: return 'cif';
      case 3: return 'autonomoRegistro';
      default: return 'dni';
    }
  };

  const handleCapture = (template: DocumentTemplate) => {
    setCurrentDocumentType(getDocumentType(template.id));
    setShowCameraModal(true);
  };

  const handleDocumentCapture = (dataUrl: string) => {
    if (currentDocumentType) {
      onDocumentCapture(currentDocumentType, dataUrl);
    }
    setShowCameraModal(false);
    setCurrentDocumentType(null);
  };

  const handleDocumentDelete = (templateId: number) => {
    const docType = getDocumentType(templateId);
    onDocumentDelete(docType);
  };

  const handleRetake = (template: DocumentTemplate) => {
    handleCapture(template);
  };

  const getRequiredDocumentsCount = () => {
    return requiredTemplates.length;
  };

  const getCompletedDocumentsCount = () => {
    return requiredTemplates.filter(template => {
      const docValue = getDocumentValue(template.id);
      return docValue && docValue.length > 0;
    }).length;
  };

  const isAllDocumentsCompleted = () => {
    return getCompletedDocumentsCount() === getRequiredDocumentsCount();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Documentos Requeridos</h2>
        <p className="text-gray-600">
          Toma fotos de los documentos necesarios para tu tipo de cuenta: {accountType}
        </p>
      </div>

      {/* Progreso de documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Progreso de Documentos
          </CardTitle>
          <CardDescription>
            Documentos completados: {getCompletedDocumentsCount()} de {getRequiredDocumentsCount()}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ 
                width: `${(getCompletedDocumentsCount() / getRequiredDocumentsCount()) * 100}%` 
              }}
            />
          </div>
          
          {isAllDocumentsCompleted() && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">¡Todos los documentos completados!</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de documentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requiredTemplates.map((template) => {
          const documentValue = getDocumentValue(template.id);
          const isCompleted = documentValue && documentValue.length > 0;
          
          return (
            <Card key={template.id} className={cn(
              "transition-all",
              isCompleted ? "border-green-500 bg-green-50" : "border-gray-200"
            )}>
              <CardHeader>
                <ValidationLabel 
                  show={!isCompleted} 
                  message="Foto requerida" 
                />
                <CardTitle className="flex items-center gap-2 text-lg">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  )}
                  {template.label}
                </CardTitle>
                <CardDescription>
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <PhotoSlot
                  template={template}
                  capturedPhoto={documentValue ? {
                    templateId: template.id,
                    imageUrl: documentValue
                  } : undefined}
                  onCapture={() => handleCapture(template)}
                  onDelete={() => handleDocumentDelete(template.id)}
                  onRetake={() => handleRetake(template)}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Información adicional */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Consejos para tomar buenas fotos:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Asegúrate de que el documento esté completamente visible</li>
                <li>• Evita reflejos y sombras</li>
                <li>• Mantén el documento plano y sin dobleces</li>
                <li>• Usa buena iluminación</li>
                <li>• El texto debe ser legible</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CameraModal */}
      <CameraModal
        isOpen={showCameraModal}
        onClose={() => {
          setShowCameraModal(false);
          setCurrentDocumentType(null);
        }}
        onCapture={handleDocumentCapture}
        template={currentDocumentType ? requiredTemplates.find(t => 
          getDocumentType(t.id) === currentDocumentType
        ) || null : null}
      />
    </div>
  );
}

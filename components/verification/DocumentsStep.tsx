'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccountType, documentTemplates, DocumentTemplate } from '@/types/verification';
import { PhotoTemplate } from '@/types/camara';
import CameraModal from '@/components/camara/CameraModal';
import { DocumentSlot } from './DocumentSlot';
import { ValidationLabel } from './ValidationLabel';

interface DocumentsStepProps {
  accountType: AccountType;
  documents: {
    // Foto obligatoria para todos (base64)
    documentoIdentidad?: string;
    
    // PDFs específicos por tipo (File objects)
    reciboServicio?: File; // Particular
    certificadoBancario?: File; // Particular + Autónomo
    altaAutonomo?: File; // Autónomo
    reta?: File; // Autónomo
    escriturasConstitucion?: File; // Empresa
    iaeAno?: File; // Empresa
    tarjetaCif?: File; // Empresa
    certificadoTitularidadBancaria?: File; // Empresa
  };
  onDocumentCapture: (type: 'documentoIdentidad', dataUrl: string) => void;
  onDocumentDelete: (type: 'documentoIdentidad') => void;
  onFileUpload: (type: string, file: File) => void;
  onFileDelete: (type: string) => void;
}

// Helper function to convert DocumentTemplate to PhotoTemplate
const convertToPhotoTemplate = (docTemplate: DocumentTemplate): PhotoTemplate | null => {
  if (docTemplate.type === 'photo' && docTemplate.aspectRatio && docTemplate.referenceImage) {
    return {
      id: docTemplate.id,
      label: docTemplate.label,
      description: docTemplate.description,
      aspectRatio: docTemplate.aspectRatio,
      referenceImage: docTemplate.referenceImage,
      required: docTemplate.required,
      guidanceImage: docTemplate.guidanceImage
    };
  }
  return null;
};

export function DocumentsStep({ 
  accountType, 
  documents, 
  onDocumentCapture, 
  onDocumentDelete,
  onFileUpload,
  onFileDelete
}: DocumentsStepProps) {
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [currentDocumentType, setCurrentDocumentType] = useState<'documentoIdentidad' | null>(null);

  // Filtrar templates según el tipo de cuenta
  const requiredTemplates = documentTemplates.filter(template => 
    template.accountType.includes(accountType)
  );

  const getDocumentValue = (templateId: number) => {
    switch (templateId) {
      case 1: return documents.documentoIdentidad; // Foto para todos
      case 2: return documents.reciboServicio; // Particular
      case 3: return documents.certificadoBancario; // Particular
      case 4: return documents.altaAutonomo; // Autónomo
      case 5: return documents.reta; // Autónomo
      case 6: return documents.certificadoBancario; // Autónomo
      case 7: return documents.escriturasConstitucion; // Empresa
      case 8: return documents.iaeAno; // Empresa
      case 9: return documents.tarjetaCif; // Empresa
      case 10: return documents.certificadoTitularidadBancaria; // Empresa
      default: return undefined;
    }
  };

  const getDocumentType = (templateId: number): 'documentoIdentidad' | string => {
    switch (templateId) {
      case 1: return 'documentoIdentidad';
      case 2: return 'reciboServicio';
      case 3: return 'certificadoBancario';
      case 4: return 'altaAutonomo';
      case 5: return 'reta';
      case 6: return 'certificadoBancario';
      case 7: return 'escriturasConstitucion';
      case 8: return 'iaeAno';
      case 9: return 'tarjetaCif';
      case 10: return 'certificadoTitularidadBancaria';
      default: return 'documentoIdentidad';
    }
  };

  const handleCapture = (template: DocumentTemplate) => {
    if (template.type === 'photo') {
      setCurrentDocumentType('documentoIdentidad');
      setShowCameraModal(true);
    }
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
    if (docType === 'documentoIdentidad') {
      onDocumentDelete(docType);
    } else {
      onFileDelete(docType);
    }
  };

  const handleFileUpload = (templateId: number, file: File) => {
    const docType = getDocumentType(templateId);
    onFileUpload(docType, file);
  };

  const handleRetake = (template: DocumentTemplate) => {
    if (template.type === 'photo') {
      handleCapture(template);
    }
  };

  const getRequiredDocumentsCount = () => {
    return requiredTemplates.length;
  };

  const getCompletedDocumentsCount = () => {
    return requiredTemplates.filter(template => {
      const docValue = getDocumentValue(template.id);
      if (template.type === 'photo') {
        return docValue && typeof docValue === 'string' && docValue.length > 0;
      } else {
        return docValue && docValue instanceof File && docValue.size > 0;
      }
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
          const isCompleted = template.type === 'photo' 
            ? documentValue && typeof documentValue === 'string' && documentValue.length > 0
            : documentValue && documentValue instanceof File && documentValue.size > 0;
          
          return (
            <DocumentSlot
              key={template.id}
              template={template}
              capturedPhoto={template.type === 'photo' && documentValue ? {
                templateId: template.id,
                imageUrl: documentValue as string
              } : undefined}
              uploadedFile={template.type === 'pdf' ? documentValue as File : undefined}
              onCapture={() => handleCapture(template)}
              onDelete={() => handleDocumentDelete(template.id)}
              onRetake={() => handleRetake(template)}
              onFileUpload={(file) => handleFileUpload(template.id, file)}
              onFileDelete={() => handleDocumentDelete(template.id)}
              onFileRetake={() => handleFileUpload(template.id, documentValue as File)}
            />
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
        template={currentDocumentType ? convertToPhotoTemplate(
          requiredTemplates.find(t => t.type === 'photo' && t.id === 1)!
        ) : null}
      />
    </div>
  );
}

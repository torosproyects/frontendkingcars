'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentTemplate } from '@/types/verification';
import { PhotoTemplate } from '@/types/camara';
import { ValidationLabel } from './ValidationLabel';
import PhotoSlot from '@/components/camara/PhotoSlot';
import { FileUpload } from './FileUpload';

interface DocumentSlotProps {
  template: DocumentTemplate;
  // Para fotos (base64)
  capturedPhoto?: {
    templateId: number;
    imageUrl: string;
  };
  // Para PDFs (File object)
  uploadedFile?: File;
  onCapture?: (template: DocumentTemplate) => void;
  onDelete?: (templateId: number) => void;
  onRetake?: (template: DocumentTemplate) => void;
  onFileUpload?: (file: File) => void;
  onFileDelete?: () => void;
  onFileRetake?: () => void;
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

export function DocumentSlot({
  template,
  capturedPhoto,
  uploadedFile,
  onCapture,
  onDelete,
  onRetake,
  onFileUpload,
  onFileDelete,
  onFileRetake
}: DocumentSlotProps) {
  const isCompleted = template.type === 'photo' 
    ? capturedPhoto && capturedPhoto.imageUrl.length > 0
    : uploadedFile && uploadedFile.size > 0;

  const renderPhotoSlot = () => {
    if (!onCapture || !onDelete || !onRetake) {
      return null;
    }

    const photoTemplate = convertToPhotoTemplate(template);
    if (!photoTemplate) {
      return null;
    }

    // Wrapper function to convert PhotoTemplate back to DocumentTemplate
    const handleCapture = (photoTemplate: PhotoTemplate) => {
      onCapture(template); // Pass the original DocumentTemplate
    };

    const handleRetake = (photoTemplate: PhotoTemplate) => {
      onRetake(template); // Pass the original DocumentTemplate
    };

    return (
      <PhotoSlot
        template={photoTemplate}
        capturedPhoto={capturedPhoto}
        onCapture={handleCapture}
        onDelete={() => onDelete(template.id)}
        onRetake={handleRetake}
      />
    );
  };

  const renderFileUpload = () => {
    if (!onFileUpload || !onFileDelete || !onFileRetake) {
      return null;
    }

    return (
      <FileUpload
        template={template}
        uploadedFile={uploadedFile}
        onFileUpload={onFileUpload}
        onFileDelete={onFileDelete}
        onFileRetake={onFileRetake}
      />
    );
  };

  return (
    <Card className={cn(
      "transition-all",
      isCompleted ? "border-green-500 bg-green-50" : "border-gray-200"
    )}>
      <CardHeader>
        <ValidationLabel 
          show={!isCompleted} 
          message={template.type === 'photo' ? 'Foto requerida' : 'Documento requerido'} 
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
        {template.type === 'photo' ? renderPhotoSlot() : renderFileUpload()}
      </CardContent>
    </Card>
  );
}

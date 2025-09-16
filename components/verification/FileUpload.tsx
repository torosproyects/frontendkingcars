'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X, 
  RotateCcw,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentTemplate } from '@/types/verification';
import { validatePDFFile, formatFileSize } from '@/lib/utils/fileValidation';
import { ValidationLabel } from './ValidationLabel';

interface FileUploadProps {
  template: DocumentTemplate;
  uploadedFile?: File;
  onFileUpload: (file: File) => void;
  onFileDelete: () => void;
  onFileRetake: () => void;
}

export function FileUpload({ 
  template, 
  uploadedFile, 
  onFileUpload, 
  onFileDelete, 
  onFileRetake 
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setIsValidating(true);
    setValidationError(null);

    try {
      const validation = await validatePDFFile(file, template.maxSize || 10);
      
      if (validation.isValid) {
        onFileUpload(file);
      } else {
        setValidationError(validation.errors[0]);
      }
    } catch (error) {
      setValidationError('Error al validar el archivo');
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const isCompleted = uploadedFile && !validationError;

  return (
    <div className="space-y-4">
      {/* Área de subida de archivos */}
      {!uploadedFile && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer",
            isDragOver 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
            validationError && "border-red-500 bg-red-50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleUploadClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          {isValidating ? (
            <div className="space-y-3">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
              <p className="text-sm text-gray-600">Validando archivo...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {isDragOver ? 'Suelta el archivo aquí' : 'Sube tu archivo PDF'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {template.label} - Máximo {template.maxSize}MB
                </p>
              </div>
              <Button variant="outline" size="sm">
                Seleccionar archivo
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Archivo subido */}
      {uploadedFile && (
        <Card className={cn(
          "transition-all",
          isCompleted ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
        )}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "p-2 rounded-full",
                  isCompleted ? "bg-green-100" : "bg-red-100"
                )}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onFileRetake}
                  className="text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Cambiar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onFileDelete}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  <X className="h-3 w-3 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error de validación */}
      {validationError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <p className="text-sm text-red-800">{validationError}</p>
          </div>
        </div>
      )}

      {/* Información del template */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          {template.description}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Formatos aceptados: PDF • Tamaño máximo: {template.maxSize}MB
        </p>
      </div>
    </div>
  );
}

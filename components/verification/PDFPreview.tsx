'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Download, 
  Eye, 
  X, 
  RotateCcw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/utils/fileValidation';

interface PDFPreviewProps {
  file: File;
  label: string;
  onDelete: () => void;
  onRetake: () => void;
  isValid?: boolean;
  showActions?: boolean;
}

export function PDFPreview({ 
  file, 
  label, 
  onDelete, 
  onRetake, 
  isValid = true,
  showActions = true 
}: PDFPreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = () => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePreview = () => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
    // Limpiar URL después de un tiempo
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <>
      <Card className={cn(
        "transition-all",
        isValid ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
      )}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "p-2 rounded-full",
                isValid ? "bg-green-100" : "bg-red-100"
              )}>
                {isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {label}
                </p>
                <p className="text-xs text-gray-500">
                  {file.name} • {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            
            {showActions && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  className="text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Descargar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetake}
                  className="text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Cambiar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  <X className="h-3 w-3 mr-1" />
                  Eliminar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de preview (opcional, para una mejor experiencia) */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">{label}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-full p-4">
              <iframe
                src={URL.createObjectURL(file)}
                className="w-full h-full border-0"
                title={label}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Componente simplificado para mostrar solo información del PDF
export function PDFInfo({ 
  file, 
  label, 
  isValid = true 
}: {
  file: File;
  label: string;
  isValid?: boolean;
}) {
  return (
    <div className={cn(
      "flex items-center space-x-3 p-3 rounded-lg border",
      isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
    )}>
      <div className={cn(
        "p-2 rounded-full",
        isValid ? "bg-green-100" : "bg-red-100"
      )}>
        {isValid ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-red-600" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">
          {file.name} • {formatFileSize(file.size)}
        </p>
      </div>
      <FileText className="h-5 w-5 text-gray-400" />
    </div>
  );
}

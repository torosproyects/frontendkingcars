
import React from 'react';
import { PhotoTemplate, CapturedPhoto } from '@/types/camara';
import Image from 'next/image';
import { 
  Camera,
  RefreshCcw, 
  AlertCircle,
  CheckCircle, 

  Trash,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';


interface PhotoSlotProps {
  template: PhotoTemplate;
  capturedPhoto?: CapturedPhoto;
  onCapture: (template: PhotoTemplate) => void;
  onDelete: (templateId: number) => void;
  onRetake: (template: PhotoTemplate) => void;
}

const PhotoSlot: React.FC<PhotoSlotProps> = ({ template, capturedPhoto, onCapture, onDelete, onRetake }) => {
 
  return (
    <div className={cn(
                          "border-2 rounded-lg p-4 transition-all",
                          capturedPhoto ? "border-green-500 bg-green-50" : "border-muted"
                          
                        )}>
      <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-sm">{template.label}</h3>
                            {capturedPhoto ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : template.required ? (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            ) : null}
                          </div>
    {/* Imagen de referencia o foto capturada */}
                        <div className="relative h-32 bg-muted rounded mb-2 overflow-hidden">
                          <Image
                           src={capturedPhoto ? capturedPhoto.imageUrl : template.referenceImage}
                           alt={template.label}
                           className="w-full h-full object-cover"
                           width={500}  // Obligatorio: define el ancho máximo esperado
                           height={500} // Obligatorio: define el alto máximo esperado
                           priority={!capturedPhoto} // Solo priorizar imágenes de referencia
                           loading={capturedPhoto ? "lazy" : "eager"}
                           onError={(e) => {
                             console.warn(`Error loading image for ${template.label}:`, e);
                           }}
                           onLoad={() => {
                             // Imagen cargada exitosamente
                           }}
                          />
                          {!capturedPhoto && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white text-xs text-center px-2">
                                Referencia
                              </span>
                            </div>
                          )}
                          {capturedPhoto && (
                            <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              ✓
                            </div>
                          )}
                        </div>
                        {!capturedPhoto&& (
                            <p className="text-xs text-muted-foreground mb-3">
                          {template.description}
                        </p>
                          )}                      
     {capturedPhoto ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRetake(template)}
                        className="w-full"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Retomar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          onCapture(template)
                        }}
                        className="w-full"
                        
                      >
                        <Camera className="h-3 w-3 mr-1" />
                        Tomar Foto
                      </Button>
                    )} 
       
    </div>
  );
};

export default PhotoSlot;
    
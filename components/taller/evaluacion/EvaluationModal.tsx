"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CarPart, CarPartEvaluation, EvaluationField } from '@/types/car-evaluation-json';
import { Camera, X, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import CameraModal from '@/components/camara/CameraModal';
import { CapturedPhoto } from '@/types/camara';

interface EvaluationModalProps {
  part: CarPart;
  evaluationType: 'entrada' | 'pruebas' | 'final';
  onClose: () => void;
  onSave: (data: CarPartEvaluation) => void;
  existingEvaluation?: CarPartEvaluation;
}

export function EvaluationModal({ 
  part, 
  evaluationType, 
  onClose, 
  onSave,
  existingEvaluation 
}: EvaluationModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>(
    existingEvaluation?.evaluationData || {}
  );
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [notes, setNotes] = useState(existingEvaluation?.notes || '');
  const [status, setStatus] = useState<'pending' | 'evaluated' | 'needs_attention' | 'critical'>(
    existingEvaluation?.status || 'pending'
  );
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentPhotoDescription, setCurrentPhotoDescription] = useState('');

  // Configuración de campos según el tipo de evaluación
  const getEvaluationFields = (): EvaluationField[] => {
    if (evaluationType === 'entrada') {
      return [
        {
          id: 'estado',
          label: 'Estado General',
          type: 'select',
          options: [
            { value: 'excelente', label: 'Excelente' },
            { value: 'bueno', label: 'Bueno' },
            { value: 'regular', label: 'Regular' },
            { value: 'malo', label: 'Malo' }
          ],
          required: true
        }
      ];
    } else {
      // Pruebas técnicas - campos específicos por parte
      switch (part.id) {
        case 'neumatico-delantero-izq':
        case 'neumatico-delantero-der':
        case 'neumatico-trasero-izq':
        case 'neumatico-trasero-der':
          return [
            {
              id: 'presion',
              label: 'Presión',
              type: 'number',
              unit: 'PSI',
              required: true
            },
            {
              id: 'vida_util',
              label: 'Vida Útil',
              type: 'select',
              options: [
                { value: 'nuevo', label: 'Nuevo (0-20%)' },
                { value: 'bueno', label: 'Bueno (20-50%)' },
                { value: 'regular', label: 'Regular (50-80%)' },
                { value: 'gastado', label: 'Gastado (80-100%)' }
              ],
              required: true
            },
            {
              id: 'desgaste',
              label: 'Desgaste',
              type: 'select',
              options: [
                { value: 'uniforme', label: 'Uniforme' },
                { value: 'irregular', label: 'Irregular' },
                { value: 'excesivo', label: 'Excesivo' }
              ],
              required: true
            }
          ];
        case 'luces-delanteras':
        case 'luces-traseras':
          return [
            {
              id: 'funcionamiento',
              label: 'Funcionamiento',
              type: 'select',
              options: [
                { value: 'perfecto', label: 'Perfecto' },
                { value: 'bueno', label: 'Bueno' },
                { value: 'regular', label: 'Regular' },
                { value: 'defectuoso', label: 'Defectuoso' }
              ],
              required: true
            },
            {
              id: 'alineacion',
              label: 'Alineación',
              type: 'select',
              options: [
                { value: 'correcta', label: 'Correcta' },
                { value: 'desviada', label: 'Desviada' },
                { value: 'muy_desviada', label: 'Muy Desviada' }
              ],
              required: true
            }
          ];
        case 'motor':
          return [
            {
              id: 'temperatura',
              label: 'Temperatura',
              type: 'number',
              unit: '°C',
              required: true
            },
            {
              id: 'ruidos',
              label: 'Ruidos',
              type: 'select',
              options: [
                { value: 'ninguno', label: 'Ninguno' },
                { value: 'leve', label: 'Leve' },
                { value: 'moderado', label: 'Moderado' },
                { value: 'fuerte', label: 'Fuerte' }
              ],
              required: true
            },
            {
              id: 'arranque',
              label: 'Arranque',
              type: 'select',
              options: [
                { value: 'inmediato', label: 'Inmediato' },
                { value: 'normal', label: 'Normal' },
                { value: 'lento', label: 'Lento' },
                { value: 'difícil', label: 'Difícil' }
              ],
              required: true
            }
          ];
        case 'frenos':
          return [
            {
              id: 'eficiencia',
              label: 'Eficiencia',
              type: 'select',
              options: [
                { value: 'excelente', label: 'Excelente' },
                { value: 'buena', label: 'Buena' },
                { value: 'regular', label: 'Regular' },
                { value: 'mala', label: 'Mala' }
              ],
              required: true
            },
            {
              id: 'ruidos',
              label: 'Ruidos',
              type: 'select',
              options: [
                { value: 'ninguno', label: 'Ninguno' },
                { value: 'leve', label: 'Leve' },
                { value: 'moderado', label: 'Moderado' },
                { value: 'fuerte', label: 'Fuerte' }
              ],
              required: true
            }
          ];
        default:
          return [
            {
              id: 'estado',
              label: 'Estado',
              type: 'select',
              options: [
                { value: 'excelente', label: 'Excelente' },
                { value: 'bueno', label: 'Bueno' },
                { value: 'regular', label: 'Regular' },
                { value: 'malo', label: 'Malo' }
              ],
              required: true
            }
          ];
      }
    }
  };

  const fields = getEvaluationFields();

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
    setCurrentPhotoDescription('');
  };

  const handlePhotoCaptured = (dataUrl: string) => {
    const newPhoto: CapturedPhoto = {
      templateId: Date.now(), // Usar timestamp como ID único
      imageUrl: dataUrl,
      description: currentPhotoDescription
    };
    setCapturedPhotos(prev => [...prev, newPhoto].slice(0, 2)); // Máximo 2 fotos
    setIsCameraOpen(false);
    setCurrentPhotoDescription('');
  };

  const removePhoto = (templateId: number) => {
    setCapturedPhotos(prev => prev.filter(p => p.templateId !== templateId));
  };

  const handleSave = () => {
    // Generar IDs únicos para las fotos (en producción estos se generarían al subir a Cloudinary)
    const photoIds = capturedPhotos.map(photo => `photo_${photo.templateId}_${Date.now()}`);
    
    const evaluationData: CarPartEvaluation = {
      partId: part.id,
      partName: part.name,
      category: part.category,
      evaluationData: formData,
      photoIds,
      notes,
      status,
      timestamp: new Date().toISOString()
    };
    onSave(evaluationData);
  };

  const isFormValid = () => {
    return fields.every(field => {
      if (field.required) {
        return formData[field.id] !== undefined && formData[field.id] !== '';
      }
      return true;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {part.icon} {part.name}
                </CardTitle>
                <CardDescription>
                  Evaluación de {evaluationType === 'entrada' ? 'entrada' : 'pruebas técnicas'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Información sobre asunciones por defecto */}
            {/* Campos dinámicos */}
            {fields.map((field) => (
              <div key={field.id}>
                <Label className="flex items-center gap-1">
                  {field.label} 
                  {field.required && <span className="text-red-500">*</span>}
                </Label>
                
                {field.type === 'select' ? (
                  <Select
                    value={formData[field.id] || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, [field.id]: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === 'number' ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={formData[field.id] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      className="flex-1"
                    />
                    {field.unit && (
                      <span className="text-sm text-gray-500">{field.unit}</span>
                    )}
                  </div>
                ) : (
                  <Input
                    type="text"
                    value={formData[field.id] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                  />
                )}
              </div>
            ))}

            {/* Estado de la evaluación */}
            <div>
              <Label>Estado de la Evaluación</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      Pendiente
                    </div>
                  </SelectItem>
                  <SelectItem value="evaluated">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      Evaluado
                    </div>
                  </SelectItem>
                  <SelectItem value="needs_attention">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-orange-500" />
                      Necesita Atención
                    </div>
                  </SelectItem>
                  <SelectItem value="critical">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-500" />
                      Crítico
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Captura de fotos */}
            <div>
              <Label className="flex items-center gap-1">
                <Camera size={16} />
                Fotos (máximo 2)
              </Label>
              <div className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="photoDescription" className="text-sm">
                    Descripción de la foto (opcional)
                  </Label>
                  <Input
                    id="photoDescription"
                    placeholder="Ej: Vista frontal, detalle del daño, etc."
                    value={currentPhotoDescription}
                    onChange={(e) => setCurrentPhotoDescription(e.target.value)}
                  />
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleOpenCamera}
                  disabled={capturedPhotos.length >= 2}
                  className="w-full"
                >
                  <Camera size={16} className="mr-2" />
                  {capturedPhotos.length === 0 ? 'Tomar Primera Foto' : 'Tomar Segunda Foto'}
                </Button>
                
                {capturedPhotos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {capturedPhotos.map((photo) => (
                      <div key={photo.templateId} className="relative">
                        <img
                          src={photo.imageUrl}
                          alt={`Foto de ${part.name}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-5 w-5 p-0"
                          onClick={() => removePhoto(photo.templateId)}
                        >
                          <X size={10} />
                        </Button>
                        {photo.description && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b">
                            {photo.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Notas */}
            <div>
              <Label>Notas Adicionales</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Observaciones adicionales sobre esta parte..."
              />
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isFormValid()}
                className="flex-1"
              >
                <Save size={16} className="mr-2" />
                Guardar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Cámara */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={handleCloseCamera}
        onCapture={handlePhotoCaptured}
        template={{
          id: 1,
          label: `Foto de ${part.name}`,
          description: currentPhotoDescription || `Captura una foto de ${part.name}`,
          aspectRatio: "4/3",
          referenceImage: "",
          required: false
        }}
      />
    </div>
  );
}

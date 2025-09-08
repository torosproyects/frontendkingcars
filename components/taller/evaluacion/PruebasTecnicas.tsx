"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Camera, 
  Save,
  Wrench,
  Car
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  CreatePruebasTecnicasData,
  PruebaMotor,
  PruebaFrenos,
  PruebaSuspension,
  PruebaDireccion,
  PruebaLuces,
  PruebaNeumaticos,
  PruebaSistemaElectrico,
  PruebaTransmision,
  PruebaAireAcondicionado,
  PruebaLiquidos
} from '@/types/evaluaciontaller';

interface PruebasTecnicasProps {
  evaluacionId: string;
  onSave: (data: CreatePruebasTecnicasData) => Promise<boolean>;
  onCancel: () => void;
}

const ESTADOS = [
  { value: 'excelente', label: 'Excelente' },
  { value: 'bueno', label: 'Bueno' },
  { value: 'regular', label: 'Regular' },
  { value: 'malo', label: 'Malo' },
] as const;

export function PruebasTecnicas({ evaluacionId, onSave, onCancel }: PruebasTecnicasProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [fotos, setFotos] = useState<File[]>([]);
  
  const [formData, setFormData] = useState<CreatePruebasTecnicasData>({
    evaluacionId,
    motor: {
      arranque: 'bueno',
      ruidos: 'bueno',
      humo: 'bueno',
      temperatura: 'bueno',
      observaciones: '',
    },
    frenos: {
      eficiencia: 'bueno',
      ruidos: 'bueno',
      liquidoFrenos: 'bueno',
      observaciones: '',
    },
    suspension: {
      amortiguadores: 'bueno',
      estabilidad: 'bueno',
      observaciones: '',
    },
    direccion: {
      alineacion: 'bueno',
      ruidos: 'bueno',
      respuesta: 'bueno',
      observaciones: '',
    },
    luces: {
      funcionamiento: 'bueno',
      alineacion: 'bueno',
      observaciones: '',
    },
    neumaticos: {
      desgaste: 'bueno',
      presion: 'bueno',
      estado: 'bueno',
      observaciones: '',
    },
    sistemaElectrico: {
      bateria: 'bueno',
      alternador: 'bueno',
      luces: 'bueno',
      observaciones: '',
    },
    transmision: {
      cambios: 'bueno',
      ruidos: 'bueno',
      fluidos: 'bueno',
      observaciones: '',
    },
    aireAcondicionado: {
      funcionamiento: 'bueno',
      filtros: 'bueno',
      observaciones: '',
    },
    liquidos: {
      aceite: 'bueno',
      refrigerante: 'bueno',
      frenos: 'bueno',
      direccion: 'bueno',
      observaciones: '',
    },
    observacionesTecnicas: '',
    fotosPruebas: [],
  });

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFotos(prev => [...prev, ...files]);
    setFormData(prev => ({ ...prev, fotosPruebas: [...prev.fotosPruebas, ...files] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await onSave(formData);
      if (success) {
        toast({
          title: "Éxito",
          description: "Pruebas técnicas guardadas correctamente",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar las pruebas técnicas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const PruebaSection = ({ 
    title, 
    icon: Icon, 
    data, 
    onUpdate 
  }: { 
    title: string; 
    icon: any; 
    data: any; 
    onUpdate: (data: any) => void;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon size={20} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data).map(([key, value]) => {
            if (key === 'observaciones') return null;
            return (
              <div key={key} className="space-y-2">
                <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                <Select
                  value={value as string}
                  onValueChange={(newValue) => 
                    onUpdate({ ...data, [key]: newValue })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
        <div className="space-y-2">
          <Label>Observaciones</Label>
          <Textarea
            value={data.observaciones}
            onChange={(e) => onUpdate({ ...data, observaciones: e.target.value })}
            placeholder={`Observaciones sobre ${title.toLowerCase()}...`}
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Motor */}
        <PruebaSection
          title="Motor"
          icon={Wrench}
          data={formData.motor}
          onUpdate={(data) => setFormData(prev => ({ ...prev, motor: data }))}
        />

        {/* Frenos */}
        <PruebaSection
          title="Sistema de Frenos"
          icon={Wrench}
          data={formData.frenos}
          onUpdate={(data) => setFormData(prev => ({ ...prev, frenos: data }))}
        />

        {/* Suspensión */}
        <PruebaSection
          title="Suspensión"
          icon={Wrench}
          data={formData.suspension}
          onUpdate={(data) => setFormData(prev => ({ ...prev, suspension: data }))}
        />

        {/* Dirección */}
        <PruebaSection
          title="Dirección"
          icon={Wrench}
          data={formData.direccion}
          onUpdate={(data) => setFormData(prev => ({ ...prev, direccion: data }))}
        />

        {/* Luces */}
        <PruebaSection
          title="Sistema de Luces"
          icon={Wrench}
          data={formData.luces}
          onUpdate={(data) => setFormData(prev => ({ ...prev, luces: data }))}
        />

        {/* Neumáticos */}
        <PruebaSection
          title="Neumáticos"
          icon={Wrench}
          data={formData.neumaticos}
          onUpdate={(data) => setFormData(prev => ({ ...prev, neumaticos: data }))}
        />

        {/* Sistema Eléctrico */}
        <PruebaSection
          title="Sistema Eléctrico"
          icon={Wrench}
          data={formData.sistemaElectrico}
          onUpdate={(data) => setFormData(prev => ({ ...prev, sistemaElectrico: data }))}
        />

        {/* Transmisión */}
        <PruebaSection
          title="Transmisión"
          icon={Wrench}
          data={formData.transmision}
          onUpdate={(data) => setFormData(prev => ({ ...prev, transmision: data }))}
        />

        {/* Aire Acondicionado */}
        <PruebaSection
          title="Aire Acondicionado"
          icon={Wrench}
          data={formData.aireAcondicionado}
          onUpdate={(data) => setFormData(prev => ({ ...prev, aireAcondicionado: data }))}
        />

        {/* Líquidos */}
        <PruebaSection
          title="Líquidos"
          icon={Wrench}
          data={formData.liquidos}
          onUpdate={(data) => setFormData(prev => ({ ...prev, liquidos: data }))}
        />

        {/* Fotos de Pruebas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera size={20} />
              Fotos de Pruebas
            </CardTitle>
            <CardDescription>
              Captura fotos durante las pruebas técnicas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fotosPruebas">Subir Fotos</Label>
              <input
                id="fotosPruebas"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFotoChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {fotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {fotos.map((foto, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(foto)}
                      alt={`Foto prueba ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Observaciones Técnicas Generales */}
        <Card>
          <CardHeader>
            <CardTitle>Observaciones Técnicas Generales</CardTitle>
            <CardDescription>
              Comentarios adicionales sobre las pruebas realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="observacionesTecnicas">Observaciones</Label>
              <Textarea
                id="observacionesTecnicas"
                value={formData.observacionesTecnicas}
                onChange={(e) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    observacionesTecnicas: e.target.value 
                  }))
                }
                placeholder="Describe cualquier observación adicional sobre las pruebas técnicas..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Guardar Pruebas
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
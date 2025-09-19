// Estructura principal de evaluación
export interface CarEvaluationJSON {
  metadata: EvaluationMetadata;
  externalData: ExternalData;
  carParts: CarPartEvaluation[];
  summary: EvaluationSummary;
}

// Metadatos de la evaluación
export interface EvaluationMetadata {
  evaluationId: string;
  carroId: string;
  evaluationType: 'entrada' | 'pruebas' | 'final';
  technicianId: string;
  technicianName: string;
  timestamp: string;
  version: string; // Para versionado de la estructura
}

// Datos externos (km, fuel, etc.)
export interface ExternalData {
  kilometraje: {
    value: number;
    unit: 'km' | 'miles';
    source: 'manual' | 'odometer' | 'external_system';
    timestamp: string;
  };
  fuel: {
    level: number; // Porcentaje 0-100
    type: 'gasolina' | 'diesel' | 'electric' | 'hybrid';
    source: 'manual' | 'sensor' | 'external_system';
    timestamp: string;
  };
  battery?: {
    level: number; // Porcentaje 0-100
    voltage?: number;
    source: 'manual' | 'sensor' | 'external_system';
    timestamp: string;
  };
  tirePressure?: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
    unit: 'psi' | 'bar';
    source: 'manual' | 'sensor' | 'external_system';
    timestamp: string;
  };
}

// Evaluación de cada parte del carro
export interface CarPartEvaluation {
  partId: string;
  partName: string;
  category: 'exterior' | 'interior' | 'mecanico' | 'electrico' | 'neumaticos';
  evaluationData: Record<string, any>; // Datos específicos de la evaluación
  photoIds: string[]; // IDs de las fotos en la tabla de fotos
  notes?: string;
  status: 'pending' | 'evaluated' | 'needs_attention' | 'critical';
  timestamp: string;
}

// Datos de fotos (se guardarán en tabla separada)
export interface EvaluationPhoto {
  id: string;
  evaluationId: string;
  partId: string;
  partName: string;
  photoUrl: string; // URL de Cloudinary
  description?: string;
  timestamp: string;
  uploadedBy: string; // ID del técnico
}

// Resumen de la evaluación
export interface EvaluationSummary {
  totalParts: number;
  evaluatedParts: number;
  criticalIssues: number;
  needsAttention: number;
  overallStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  estimatedRepairCost?: number;
  estimatedRepairTime?: number; // en horas
  recommendations: string[];
}

// Parte del carro para el SVG interactivo
export interface CarPart {
  id: string;
  name: string;
  category: 'exterior' | 'interior' | 'mecanico' | 'electrico' | 'neumaticos';
  position: { x: number; y: number; width: number; height: number }; // Para el SVG
  icon: string;
  color: string;
}

// Campo de evaluación
export interface EvaluationField {
  id: string;
  label: string;
  type: 'select' | 'number' | 'text' | 'textarea';
  options?: { value: string; label: string }[];
  required: boolean;
  unit?: string; // Para campos numéricos (PSI, km, etc.)
}

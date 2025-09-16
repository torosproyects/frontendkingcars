export type AccountType = 'Particular' | 'Empresa' | 'Autónomo';

export type VerificationStep = 'account-type' | 'basic-info' | 'phone-verification' | 'specific-info' | 'documents' | 'review';

export type DocumentType = 'photo' | 'pdf';

export interface VerificationData {
  // Información básica común
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneVerified: boolean;
  
  // Nueva información personal común
  fechaNacimiento: string; // con validación edad >= 20
  documento: {
    tipo: 'NIF' | 'DNI' | 'TIE' | 'NIE';
    numero: string;
  };
  
  // Nueva información de dirección común
  direccion: string;
  codigoPostal: string;
  pais: string; // código del país (ES, FR, etc.)
  ciudad: string; // generado por API, editable
  estado: string; // generado por API, editable
  
  // Información específica por tipo
  accountType: AccountType;
  
  // Datos específicos para Particular
  particularData?: {
    numeroReciboServicio: string;
  };
  
  // Datos específicos para Autónomo
  autonomoData?: {
    altaAutonomo: string;
    reta: string;
  };
  
  // Datos específicos para Empresa
  empresaData?: {
    cif: string;
    numeroEscrituraConstitucion: string;
  };
  
  // Documentos capturados
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
}

export interface DocumentTemplate {
  id: number;
  label: string;
  description: string;
  type: DocumentType; // 'photo' | 'pdf'
  maxSize?: number; // Para PDFs en MB
  acceptedFormats?: string[]; // ['pdf'] para documentos
  aspectRatio?: '4/3' | '16/9' | '1/1' | '3/4'; // Solo para fotos
  referenceImage?: string; // Solo para fotos
  guidanceImage?: string; // Solo para fotos
  required: boolean;
  accountType: AccountType[];
}

export const documentTemplates: DocumentTemplate[] = [
  // Foto obligatoria para todos
  {
    id: 1,
    label: 'Documento de Identidad',
    description: 'Toma una foto clara de tu DNI, NIE o NIF',
    type: 'photo',
    aspectRatio: '4/3',
    referenceImage: '/assets/dni-reference.png',
    guidanceImage: '/assets/dni-guide.png',
    required: true,
    accountType: ['Particular', 'Autónomo', 'Empresa']
  },
  
  // PDFs para Particular
  {
    id: 2,
    label: 'Recibo de Servicio',
    description: 'Sube el recibo de servicio en formato PDF',
    type: 'pdf',
    maxSize: 10,
    acceptedFormats: ['pdf'],
    required: true,
    accountType: ['Particular']
  },
  {
    id: 3,
    label: 'Certificado Bancario',
    description: 'Sube el certificado bancario en formato PDF',
    type: 'pdf',
    maxSize: 10,
    acceptedFormats: ['pdf'],
    required: true,
    accountType: ['Particular']
  },
  
  // PDFs para Autónomo
  {
    id: 4,
    label: 'Alta de Autónomo',
    description: 'Sube el documento de alta de autónomo en formato PDF',
    type: 'pdf',
    maxSize: 10,
    acceptedFormats: ['pdf'],
    required: true,
    accountType: ['Autónomo']
  },
  {
    id: 5,
    label: 'RETA',
    description: 'Sube el documento RETA en formato PDF',
    type: 'pdf',
    maxSize: 10,
    acceptedFormats: ['pdf'],
    required: true,
    accountType: ['Autónomo']
  },
  {
    id: 6,
    label: 'Certificado Bancario',
    description: 'Sube el certificado bancario en formato PDF',
    type: 'pdf',
    maxSize: 10,
    acceptedFormats: ['pdf'],
    required: true,
    accountType: ['Autónomo']
  },
  
  // PDFs para Empresa
  {
    id: 7,
    label: 'Escrituras de Constitución',
    description: 'Sube las escrituras de constitución en formato PDF',
    type: 'pdf',
    maxSize: 10,
    acceptedFormats: ['pdf'],
    required: true,
    accountType: ['Empresa']
  },
  {
    id: 8,
    label: 'IAE del Año',
    description: 'Sube el IAE del año en formato PDF',
    type: 'pdf',
    maxSize: 10,
    acceptedFormats: ['pdf'],
    required: true,
    accountType: ['Empresa']
  },
  {
    id: 9,
    label: 'Tarjeta CIF',
    description: 'Sube la tarjeta CIF en formato PDF',
    type: 'pdf',
    maxSize: 10,
    acceptedFormats: ['pdf'],
    required: true,
    accountType: ['Empresa']
  },
  {
    id: 10,
    label: 'Certificado de Titularidad Bancaria',
    description: 'Sube el certificado de titularidad bancaria en formato PDF',
    type: 'pdf',
    maxSize: 10,
    acceptedFormats: ['pdf'],
    required: true,
    accountType: ['Empresa']
  }
];

export const spanishProvinces = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Baleares',
  'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real',
  'Córdoba', 'La Coruña', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa',
  'Huelva', 'Huesca', 'Jaén', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Murcia',
  'Navarra', 'Ourense', 'Palencia', 'Las Palmas', 'Pontevedra', 'La Rioja', 'Salamanca',
  'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel',
  'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'
];

// Validaciones de documentos por tipo
export const documentValidations: Record<string, RegExp> = {
  'DNI': /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i,
  'NIE': /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i,
  'NIF': /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i,
  'TIE': /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i
};

// Validar documento según su tipo
export const validateDocument = (tipo: string, numero: string): boolean => {
  const pattern = documentValidations[tipo];
  return pattern ? pattern.test(numero) : false;
};

// Validar edad (debe ser mayor o igual a 20 años)
export const validateAge = (fechaNacimiento: string): boolean => {
  const birthDate = new Date(fechaNacimiento);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 20;
  }
  return age >= 20;
};

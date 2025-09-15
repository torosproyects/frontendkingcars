export type AccountType = 'Particular' | 'Empresa' | 'Autónomo';

export type VerificationStep = 'account-type' | 'basic-info' | 'phone-verification' | 'specific-info' | 'documents' | 'review';

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
    // Solo campos específicos de particular (si los hay)
  };
  
  // Datos específicos para Autónomo
  autonomoData?: {
    nombreComercial: string;
    cif: string;
    numeroRegistro: string;
    telefono: string;
    email: string;
  };
  
  // Datos específicos para Empresa
  empresaData?: {
    razonSocial: string;
    cif: string;
    telefono: string;
    emailCorporativo: string;
    representanteLegal: {
      nombre: string;
      dni: string;
      cargo: string;
      telefono: string;
      email: string;
    };
  };
  
  // Documentos capturados
  documents: {
    dni?: string; // base64 data URL
    cif?: string; // base64 data URL
    autonomoRegistro?: string; // base64 data URL
  };
}

export interface DocumentTemplate {
  id: number;
  label: string;
  description: string;
  aspectRatio: '4/3' | '16/9' | '1/1' | '3/4';
  referenceImage: string;
  guidanceImage: string;
  required: boolean;
  accountType: AccountType[];
}

export const documentTemplates: DocumentTemplate[] = [
  {
    id: 1,
    label: 'DNI/NIE',
    description: 'Toma una foto clara de tu DNI o NIE',
    aspectRatio: '4/3',
    referenceImage: '/assets/dni-reference.png',
    guidanceImage: '/assets/dni-guide.png',
    required: true,
    accountType: ['Particular', 'Empresa']
  },
  {
    id: 2,
    label: 'CIF de la Empresa',
    description: 'Toma una foto clara del CIF de la empresa',
    aspectRatio: '4/3',
    referenceImage: '/assets/cif-reference.png',
    guidanceImage: '/assets/cif-guide.png',
    required: true,
    accountType: ['Autónomo', 'Empresa']
  },
  {
    id: 3,
    label: 'Registro de Autónomo',
    description: 'Toma una foto del documento de registro de autónomo',
    aspectRatio: '4/3',
    referenceImage: '/assets/autonomo-reference.png',
    guidanceImage: '/assets/autonomo-guide.png',
    required: true,
    accountType: ['Autónomo']
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

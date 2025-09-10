export type AccountType = 'Taller' | 'Usuario' | 'Empresa';

export type VerificationStep = 'account-type' | 'basic-info' | 'phone-verification' | 'specific-info' | 'documents' | 'review';

export interface VerificationData {
  // Información básica común
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneVerified: boolean;
  
  // Información específica por tipo
  accountType: AccountType;
  
  // Datos específicos para Taller
  tallerData?: {
    nombreTaller: string;
    cif: string;
    numeroRegistro: string;
    direccion: string;
    codigoPostal: string;
    provincia: string;
    telefono: string;
    email: string;
  };
  
  // Datos específicos para Usuario
  usuarioData?: {
    dni: string;
    fechaNacimiento: string;
    direccion: string;
    codigoPostal: string;
    provincia: string;
  };
  
  // Datos específicos para Empresa
  empresaData?: {
    razonSocial: string;
    cif: string;
    direccionFiscal: string;
    codigoPostal: string;
    provincia: string;
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
    tallerRegistro?: string; // base64 data URL
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
    accountType: ['Usuario', 'Empresa']
  },
  {
    id: 2,
    label: 'CIF de la Empresa',
    description: 'Toma una foto clara del CIF de la empresa',
    aspectRatio: '4/3',
    referenceImage: '/assets/cif-reference.png',
    guidanceImage: '/assets/cif-guide.png',
    required: true,
    accountType: ['Taller', 'Empresa']
  },
  {
    id: 3,
    label: 'Registro de Taller',
    description: 'Toma una foto del documento de registro del taller',
    aspectRatio: '4/3',
    referenceImage: '/assets/taller-reference.png',
    guidanceImage: '/assets/taller-guide.png',
    required: true,
    accountType: ['Taller']
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

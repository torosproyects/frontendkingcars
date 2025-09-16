import { fetchWithRetry, withRetry} from '../utils/retry-utils';
import { connectivityService } from '../service/connectivity-service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_TIMEOUT = 30000; // 30 segundos para uploads de archivos

// Tipos para la respuesta de la API
export interface VerificationResponse {
  success: boolean;
  message: string;
  verificationId?: number;
  documents?: {
    [key: string]: string;
  };
}

export interface VerificationError {
  success: false;
  message: string;
  errors?: string[];
  missingFiles?: string[];
}

// Función para hacer peticiones HTTP con reintentos robustos
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Verificar conectividad antes de hacer llamadas
  try {
    const connectivityStatus = await connectivityService.checkFullConnectivity();
    
    if (!connectivityStatus.isOnline) {
      throw new Error('Sin conectividad de red');
    }
    
    if (!connectivityStatus.backendReachable) {
      console.warn('Backend no disponible, pero continuando con intentos...');
    }
  } catch (connectivityError) {
    console.warn('Error verificando conectividad, continuando...');
  }

  // Usar sistema de reintentos robusto
  return withRetry(async () => {
    const response = await fetchWithRetry(url, {
      credentials: 'include',
      headers: {
        ...options.headers,
      },
      ...options,
    }, {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 5000,
      backoffMultiplier: 2,
      timeoutMs: API_TIMEOUT
    });
    
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Si no se puede parsear el JSON, usar el mensaje por defecto
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  }, {
    maxRetries: 2, // Reintentos adicionales a nivel de función
    baseDelay: 2000,
    maxDelay: 8000,
    backoffMultiplier: 2,
    timeoutMs: 60000 // 60 segundos total para uploads
  });
}

// Función para convertir File a base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = error => reject(error);
  });
}

// Función para convertir dataUrl a base64 (remover el prefijo data:image/...)
function dataUrlToBase64(dataUrl: string): string {
  if (dataUrl.startsWith('data:')) {
    return dataUrl.split(',')[1];
  }
  return dataUrl;
}

export interface VerificationData {
  // Información básica
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneVerified: boolean;
  fechaNacimiento: string;
  
  // Documento de identidad
  documento: {
    tipo: string;
    numero: string;
  };
  
  // Dirección
  direccion: string;
  codigoPostal: string;
  pais: string;
  ciudad: string;
  estado: string;
  
  // Tipo de cuenta
  accountType: 'Particular' | 'Autónomo' | 'Empresa';
  
  // Datos específicos según tipo
  particularData?: {
    numeroReciboServicio: string;
  };
  autonomoData?: {
    altaAutonomo: string;
    reta: string;
  };
  empresaData?: {
    cif: string;
    numeroEscrituraConstitucion: string;
  };
  
  // Archivos - estructura real del frontend
  documents?: {
    // Foto obligatoria para todos (dataUrl string)
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

export class VerificationService {
  // Enviar solicitud de verificación
  static async submitVerification(data: VerificationData): Promise<VerificationResponse> {
    try {
      // Crear FormData para multipart/form-data
      const formData = new FormData();
      
      // Información básica
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('phoneVerified', data.phoneVerified.toString());
      formData.append('fechaNacimiento', data.fechaNacimiento);
      
      // Documento de identidad
      formData.append('documento', JSON.stringify(data.documento));
      
      // Dirección
      formData.append('direccion', data.direccion);
      formData.append('codigoPostal', data.codigoPostal);
      formData.append('pais', data.pais);
      formData.append('ciudad', data.ciudad);
      formData.append('estado_provincia', data.estado);
      
      // Tipo de cuenta
      formData.append('accountType', data.accountType);
      
      // Datos específicos según tipo (como JSON strings)
      if (data.accountType === 'Particular' && data.particularData) {
        formData.append('particularData', JSON.stringify(data.particularData));
      } else if (data.accountType === 'Autónomo' && data.autonomoData) {
        formData.append('autonomoData', JSON.stringify(data.autonomoData));
      } else if (data.accountType === 'Empresa' && data.empresaData) {
        formData.append('empresaData', JSON.stringify(data.empresaData));
      }
      
      // Procesar documento de identidad (foto) - enviar como dataUrl completo
      if (data.documents?.documentoIdentidad) {
        // El backend espera el dataUrl completo con prefijo data:image/jpeg;base64,
        formData.append('documentoIdentidad', data.documents.documentoIdentidad);
      }
      
      // Procesar archivos PDF según tipo de cuenta - siempre son File objects
      if (data.documents) {
        const fileFields = [
          'reciboServicio',
          'certificadoBancario', 
          'altaAutonomo',
          'reta',
          'escriturasConstitucion',
          'iaeAno',
          'tarjetaCif',
          'certificadoTitularidadBancaria'
        ];
        
        for (const field of fileFields) {
          const file = data.documents[field as keyof typeof data.documents];
          if (file && file instanceof File) {
            formData.append(field, file);
          }
        }
      }
      
      // Hacer la llamada al backend
      return await apiRequest<VerificationResponse>('/verification/submit', {
        method: 'POST',
        body: formData,
        // No establecer Content-Type, dejar que el navegador lo haga automáticamente para multipart/form-data
      });
      
    } catch (error) {
      console.error('Error submitting verification:', error);
      
      if (error instanceof Error) {
        // Intentar parsear como respuesta de error del servidor
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.success === false) {
            return errorData as VerificationError;
          }
        } catch {
          // No es JSON válido, continuar con el error original
        }
        
        throw new Error(`Error enviando verificación: ${error.message}`);
      }
      
      throw new Error('Error desconocido enviando verificación');
    }
  }
}

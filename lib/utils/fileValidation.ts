export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Valida el contenido de un archivo PDF verificando su firma
 */
export const validatePDFContent = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Verificar firma PDF (primeros 4 bytes)
        const pdfSignature = uint8Array.slice(0, 4);
        const isValidPDF = 
          pdfSignature[0] === 0x25 && // %
          pdfSignature[1] === 0x50 && // P
          pdfSignature[2] === 0x44 && // D
          pdfSignature[3] === 0x46;   // F
        
        resolve(isValidPDF);
      } catch (error) {
        console.error('Error validating PDF content:', error);
        resolve(false);
      }
    };
    
    reader.onerror = () => {
      resolve(false);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Valida el tipo MIME de un archivo PDF
 */
export const validatePDFMimeType = (file: File): boolean => {
  return file.type === 'application/pdf';
};

/**
 * Valida el tamaño de un archivo en MB
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Valida un archivo PDF completo con todas las validaciones
 */
export const validatePDFFile = async (
  file: File, 
  maxSizeMB: number = 10
): Promise<FileValidationResult> => {
  const errors: string[] = [];
  
  // Validar tamaño
  if (!validateFileSize(file, maxSizeMB)) {
    errors.push(`El archivo no puede superar los ${maxSizeMB}MB`);
  }
  
  // Validar tipo MIME
  if (!validatePDFMimeType(file)) {
    errors.push('El archivo debe ser un PDF válido');
  }
  
  // Validar contenido PDF solo si pasa las validaciones anteriores
  if (errors.length === 0) {
    const isValidContent = await validatePDFContent(file);
    if (!isValidContent) {
      errors.push('El archivo no es un PDF válido');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Formatea el tamaño de archivo en bytes a formato legible
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Valida si un archivo es una imagen válida
 */
export const validateImageFile = (file: File): FileValidationResult => {
  const errors: string[] = [];
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  // Validar tipo MIME
  if (!validImageTypes.includes(file.type)) {
    errors.push('El archivo debe ser una imagen válida (JPEG, PNG, WebP)');
  }
  
  // Validar tamaño (máximo 5MB para imágenes)
  if (!validateFileSize(file, 5)) {
    errors.push('La imagen no puede superar los 5MB');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

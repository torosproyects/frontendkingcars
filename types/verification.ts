// Tipos para el panel de administración de verificaciones

export interface Verification {
  id: number;
  pre_registro_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  fecha_nacimiento: string;
  documento_tipo: string;
  documento_numero: string;
  documento_identidad_url: string;
  documento_identidad_public_id: string;
  direccion: string;
  codigo_postal: string;
  pais: string;
  ciudad: string;
  estado_provincia: string;
  account_type_id: number;
  account_type_name: string;
  particular_data: string | null;
  autonomo_data: string | null;
  empresa_data: string | null;
  estado: 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada';
  fecha_solicitud: string;
  fecha_revision: string | null;
  notas_revision: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  pre_registro_name: string;
  pre_registro_email: string;
  archivos: VerificationFile[];
}

export interface VerificationFile {
  id: number;
  tipo: string;
  nombre: string;
  tamaño: number;
  fecha_subida: string;
}

export interface VerificationDetail extends Verification {
  usuario_info: {
    pre_registro_id: number;
    name: string;
    email: string;
    fecha_registro: string;
  };
  documentos: {
    documento_identidad: {
      tipo: string;
      url: string;
      public_id: string;
      formato: string;
      almacenamiento: string;
    };
    archivos_pdf: PDFFile[];
  };
  resumen_documentos: {
    total_archivos: number;
    archivos_pdf: number;
    foto_documento: number;
    tipos_archivos: string[];
    tamaño_total_pdf: number;
  };
}

export interface PDFFile {
  id: number;
  tipo: string;
  nombre_original: string;
  tamaño: number;
  fecha_subida: string;
  formato: string;
  almacenamiento: string;
  descarga_url: string;
}

export interface VerificationFilters {
  estado?: string;
  account_type_id?: number;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

export interface VerificationListResponse {
  success: boolean;
  data: {
    verificaciones: Verification[];
    pagination: {
      limit: number;
      offset: number;
      total: number;
      hasMore: boolean;
    };
    filters: {
      estado: string | null;
      account_type_id: number | null;
      sort_by: string;
      sort_order: string;
    };
    stats: {
      total: number;
      pendientes: number;
      en_revision: number;
      aprobadas: number;
      rechazadas: number;
      por_tipo: {
        particulares: number;
        autonomos: number;
        empresas: number;
      };
    };
  };
}

export interface VerificationDetailResponse {
  success: boolean;
  data: VerificationDetail;
}

export interface VerificationStatusUpdate {
  estado: 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada';
  notas_revision?: string;
}

export interface VerificationStatusResponse {
  success: boolean;
  message: string;
  verification: {
    id: number;
    estado: string;
    fecha_solicitud: string;
    fecha_revision: string;
    notas_revision: string;
    account_type_name: string;
    archivos: VerificationFile[];
  };
}

// Tipos para los filtros de la UI
export interface FilterOption {
  value: string | number;
  label: string;
}

export interface VerificationFiltersUI {
  estado: FilterOption[];
  account_type: FilterOption[];
  sort_by: FilterOption[];
}
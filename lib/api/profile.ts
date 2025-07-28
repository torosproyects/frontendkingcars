import { User } from '@/lib/types/auth';

// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Función para hacer peticiones HTTP
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
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
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
    throw error;
  }
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  dateOfBirth?: string;
  occupation?: string;
  avatar?: string;
}

export interface UploadAvatarResponse {
  url: string;
  message: string;
}

// API de perfil para backend real
export const profileAPI = {
  // Actualizar perfil
  updateProfile: async (data: UpdateProfileData, token: string): Promise<User> => {
    console.log('👤 Actualizando perfil...', data);
    
    const response = await apiRequest<User>('/profile/update', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    console.log('✅ Perfil actualizado exitosamente');
    return response;
  },

  // Subir avatar
  uploadAvatar: async (file: File, token: string): Promise<UploadAvatarResponse> => {
    console.log('📸 Subiendo avatar...');
    
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiRequest<UploadAvatarResponse>('/profile/avatar', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // No incluir Content-Type para FormData
      },
      body: formData,
    });

    console.log('✅ Avatar subido exitosamente');
    return response;
  },

  // Subir avatar desde base64
  uploadAvatarBase64: async (base64Data: string, token: string): Promise<UploadAvatarResponse> => {
    console.log('📸 Subiendo avatar desde base64...');
    
    const response = await apiRequest<UploadAvatarResponse>('/profile/avatar/base64', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        image: base64Data,
        filename: `avatar_${Date.now()}.jpg`
      }),
    });

    console.log('✅ Avatar subido exitosamente');
    return response;
  },

  // Eliminar avatar
  deleteAvatar: async (token: string): Promise<{ message: string }> => {
    console.log('🗑️ Eliminando avatar...');
    
    const response = await apiRequest<{ message: string }>('/profile/avatar', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('✅ Avatar eliminado exitosamente');
    return response;
  },

  // Cambiar contraseña
  changePassword: async (
    currentPassword: string, 
    newPassword: string, 
    token: string
  ): Promise<{ message: string }> => {
    console.log('🔑 Cambiando contraseña...');
    
    const response = await apiRequest<{ message: string }>('/profile/change-password', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        currentPassword, 
        newPassword 
      }),
    });

    console.log('✅ Contraseña cambiada exitosamente');
    return response;
  },

  // Eliminar cuenta
  deleteAccount: async (password: string, token: string): Promise<{ message: string }> => {
    console.log('⚠️ Eliminando cuenta...');
    
    const response = await apiRequest<{ message: string }>('/profile/delete-account', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    console.log('✅ Cuenta eliminada exitosamente');
    return response;
  },
};
import { Captcha } from '@/components/auth/captcha';
import { LoginCredentials, RegisterData, AuthResponse, User, VerifyCredentials, ResendCredentials } from '@/lib/types/auth';

// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Función para hacer peticiones HTTP
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Si la respuesta no es ok, intentar extraer el mensaje de error
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

// API de autenticación para backend real
export const authAPI = {
  // Iniciar sesión
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('🔐 Iniciando sesión...', { email: credentials.email });
    
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        captcha: credentials.capchat,
        rememberMe: credentials.rememberMe,
      }),
    });

    console.log('✅ Inicio de sesión exitoso');
    return response;
  },
  //VerifyEmail
  verifyEmail: async (credentials: VerifyCredentials): Promise<AuthResponse> => {
    console.log('🔐 Iniciando sesión...', { email: credentials.email });
    
    const response = await apiRequest<AuthResponse>('/auth/verify-and-register', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        name: credentials.name,
        code: credentials.code,
      }),
    });

    console.log('✅ envio de correo correcto');
    return response;
  },
  //Resendcode
   resendVerificationCode: async (credentials: ResendCredentials): Promise<AuthResponse> => {
    console.log('🔐 Iniciando sesión...', { email: credentials.email });
    
    const response = await apiRequest<AuthResponse>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        name: credentials.name,
      }),
    });

    console.log('✅ Inicio de sesión exitoso');
    return response;
  },

  // Registrarse
  register: async (data: RegisterData): Promise<AuthResponse> => {
     const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        capchat: data.capchat,
        email: data.email,
        password: data.password,
        
      }),
    });

    return response;
  },
  preregister: async (data: RegisterData): Promise<AuthResponse> => {
     const response = await apiRequest<AuthResponse>('/auth/pre-register', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        capchat: data.capchat,
        email: data.email,
        password: data.password,
        
      }),
    });

    return response;
  },
getCurrentUser: async (): Promise<User> => {
    return await apiRequest<User>('/auth/me', {
      method: 'GET',
      // credentials: 'include' ya está en apiRequest
    });
  },
 

  // Cerrar sesión
  logout: async (token?: string): Promise<void> => {
    console.log('👋 Cerrando sesión...');
    
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      await apiRequest<void>('/auth/logout', {
        method: 'POST',
        headers,
      });
      console.log('✅ Sesión cerrada exitosamente');
    } catch (error) {
      // El logout puede fallar si el token ya expiró, pero eso está bien
      console.warn('⚠️ Error al cerrar sesión en el servidor:', error);
    }
  },

  // Obtener perfil del usuario
  getProfile: async (token: string): Promise<User> => {
    console.log('👤 Obteniendo perfil del usuario...');
    
    const response = await apiRequest<User>('/auth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('✅ Perfil obtenido exitosamente');
    return response;
  },

  // Verificar si el email existe
  checkEmailExists: async (email: string): Promise<{ exists: boolean }> => {
    console.log('📧 Verificando disponibilidad del email...');
    
    const response = await apiRequest<{ exists: boolean }>('/auth/check-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    return response;
  },

  // Solicitar restablecimiento de contraseña
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    console.log('🔑 Solicitando restablecimiento de contraseña...');
    
    const response = await apiRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    console.log('✅ Solicitud de restablecimiento enviada');
    return response;
  },

  // Restablecer contraseña
  resetPassword: async (newPassword: string): Promise<{ message: string }> => {
    console.log('🔑 Restableciendo contraseña...');
    
    const response = await apiRequest<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({newPassword }),
    });

    console.log('✅ Contraseña restablecida exitosamente');
    return response;
  },
};
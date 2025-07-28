import { create } from 'zustand';
import { User, LoginCredentials, VerifyCredentials, ResendCredentials, RegisterData, UserRole,ProfileStatus, VerificationRequirement, AccessResult} from '@/lib/types/auth';
import { authAPI } from '@/lib/api/auth';
import { profileAPI, UpdateProfileData } from '@/lib/api/profile';


interface AuthState {
  // Estado de autenticación
  user: User | null;
  seLogueo: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  preregister: (data: RegisterData) => Promise<boolean>;
  verifyEmail: (credentials: VerifyCredentials) => Promise<boolean>;
  resendVerificationCode: (credentials: ResendCredentials) => Promise<boolean>;
  
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => void;
  checkAccess: (requirements: VerificationRequirement) => AccessResult;
  canAccessFeature: (feature: string) => boolean;
  getUserStatus: () => 'logueado' | 'rechazado' | 'verificado' | 'visitante';
  getVerificationProgress: () => number;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isDealer: () => boolean;
  isCustomer: () => boolean;
  isVerified: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Estado inicial
  user: null,
  seLogueo: false,
  isLoading: false,
  error: null,

  // Iniciar sesión
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authAPI.login(credentials);
      if(response.success){
      
      set({
        user: response.user,
        seLogueo: true,
        isLoading: false,
        error: null,
      });
     
      return true;
    } 
    else{
      set({
        user: null,
        seLogueo: false,
        isLoading: false,
        error: null,
      });
      return false;
    }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      set({
        user: null,
        seLogueo: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
      
    }
  },
  verifyEmail: async (credentials: VerifyCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authAPI.verifyEmail(credentials);
      if(response.success){
      
      set({
        user: response.user,
        seLogueo: true,
        isLoading: false,
        error: null,
      });
     
      return true;
    } 
    else{
      set({
        user: null,
        seLogueo: false,
        isLoading: false,
        error: null,
      });
      return false;
    }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      set({
        user: null,
        seLogueo: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
      
    }
  },
  resendVerificationCode: async (credentials: ResendCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authAPI.resendVerificationCode(credentials);
      set({ isLoading: false });
      if(response.success){
            return true;
        } 
      else{
            set({ error: response.error || 'Error al reenviar código' });
            return false;
       }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el reenvio';
      set({
         isLoading: false,
         error: errorMessage,
      });
      throw error;
      
    }
  },

  // Registrarse
  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authAPI.register(data);
      set({
        user: response.user,
        seLogueo: true,
        isLoading: false,
        error: null,
      });
      
      console.log(`✅ Usuario ${response.user.email} registrado exitosamente`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrarse';
      set({
        user: null,
        seLogueo: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
      return false;
    }
  },
  preregister: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
   try {
    const response = await authAPI.preregister(data);
    
    // Si el backend responde con éxito (200-299)
    if (response.success) {
      return true;
    } 
    // Si el backend responde con un 409 (Conflict) u otro error controlado
    else if (response.error) {
      throw new Error(response.error); // Lanza el mensaje de error del backend
    } 
    // Si no, asumimos que algo salió mal
    else {
      throw new Error("Error desconocido al registrar");
    }
  } catch (error) {
    
    if (error instanceof Error) {
      set({ error: error.message }); 
      throw error; 
    } else {
      const unknownError = new Error("Error inesperado");
      set({ error: unknownError.message });
      throw unknownError;
    }
  } finally {
    set({ isLoading: false }); 
  } 
   
  },

  // Cerrar sesión
  logout: async () => {
    set({ isLoading: true });
    
    try {
      await authAPI.logout();
    
      set({
        user: null,
        seLogueo: false,
        isLoading: false,
        error: null,
      });
      
      console.log('✅ Sesión cerrada exitosamente');
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      
      // Limpiar estado local incluso si hay error
      set({
        user: null,
        seLogueo: false,
        isLoading: false,
        error: null,
      });
    }
  },

 
  // Actualizar perfil
  updateProfile: async (data: UpdateProfileData) => {
    const {  user } = get();
    
    if (!user) {
      throw new Error('No hay sesión activa');
    }
    
    set({ isLoading: true, error: null });
    
    try {
      console.log('👤 Actualizando perfil...', data);
      
      // Simular actualización de perfil
      const updatedUser = {
        ...user,
        ...data,
        profileStatus: 'verified' as ProfileStatus,
        role: 'customer' as UserRole, // Asignar rol después de verificación
        verificationProgress: 100,
      };
      
      set({
        user: updatedUser,
        isLoading: false,
        error: null,
      });
      
      console.log('✅ Perfil actualizado exitosamente - Usuario ahora verificado');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar perfil';
      console.error('❌ Error al actualizar perfil:', error);
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },
// Limpiar error
  clearError: () => {
    set({ error: null });
  },

  // Inicializar autenticación desde cookies
  initializeAuth: async () => {
    try {
    // Hacer petición para verificar sesión actual
    const user = await authAPI.getCurrentUser();
    set({
      user,
      seLogueo: true,
    });
  } catch (error) {
    // No hay sesión válida
    set({
      user: null,
      seLogueo: false,
    });
  }
  },

  // NUEVAS FUNCIONES PARA EL SISTEMA DE VERIFICACIÓN

  // Verificar acceso a funcionalidades
  checkAccess: (requirements: VerificationRequirement): AccessResult => {
    const { user, seLogueo } = get();
    
    // Si requiere login y no está logueado
    if (requirements.requiresLogin && !seLogueo) {
      return {
        hasAccess: false,
        reason: 'not_logged',
        message: 'Necesitas iniciar sesión para acceder a esta funcionalidad',
        actionText: 'Iniciar Sesión',
        actionPath: '/auth/login',
      };
    }
    
    // Si requiere autenticación completa y no está verificado
    if (requirements.requiresAuth && (!user || !user.role || user.profileStatus !== 'verificado')) {
      return {
        hasAccess: false,
        reason: 'not_verified',
        message: 'Necesitas completar tu verificación de perfil para acceder a esta funcionalidad',
        actionText: 'Completar Verificación',
        actionPath: '/profile/verification',
      };
    }
    
    // Si requiere roles específicos
    if (requirements.requiredRoles && requirements.requiredRoles.length > 0) {
      if (!user?.role || !requirements.requiredRoles.includes(user.role)) {
        return {
          hasAccess: false,
          reason: 'insufficient_role',
          message: `Esta funcionalidad requiere permisos de: ${requirements.requiredRoles.join(', ')}`,
          actionText: 'Contactar Soporte',
          actionPath: '/contact',
        };
      }
    }
    
    return { hasAccess: true };
  },

  // Verificar acceso a funcionalidad específica
  canAccessFeature: (feature: string): boolean => {
    const featureRequirements: Record<string, VerificationRequirement> = {
      'upload-car': { requiresAuth: true },
      'auctions': { requiresAuth: true },
      'create-auction': { requiresAuth: true },
      'my-auctions': { requiresAuth: true },
      'favorites': { requiresLogin: true },
      'profile': { requiresLogin: true },
      'admin': { requiresAuth: true, requiredRoles: ['Administrador'] },
      'dealer-inventory': { requiresAuth: true, requiredRoles: ['Taller'] },
    };
    
    const requirements = featureRequirements[feature];
    if (!requirements) return true; // Funcionalidad pública
    
    return get().checkAccess(requirements).hasAccess;
  },

  // Obtener estado del usuario
  getUserStatus: (): 'logueado' | 'verificado' | 'visitante' | 'rechazado'=> {
    const { user, seLogueo } = get();
    
    if (!seLogueo || !user) return 'visitante';
    if (!user.role || user.profileStatus !== 'verificado') return 'logueado';
    return 'verificado';
  },

  // Obtener progreso de verificación
  getVerificationProgress: (): number => {
    const { user } = get();
    return user?.verificationProgress || 0;
  },

  // Funciones de utilidad mejoradas
  hasRole: (role: UserRole) => {
    const { user } = get();
    return user?.role === role;
  },

  hasAnyRole: (roles: UserRole[]) => {
    const { user } = get();
    return user?.role ? roles.includes(user.role) : false;
  },

  isAdmin: () => {
    return get().hasRole('Administrador');
  },

  isDealer: () => {
    return get().hasRole('Taller');
  },

  isCustomer: () => {
    return get().hasRole('Usuario');
  },

  isVerified: () => {
    const { user } = get();
    return user?.profileStatus === 'verificado' && user?.role !== null;
  },
}));
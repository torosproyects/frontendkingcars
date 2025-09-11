/**
 * Servicio para verificar conectividad de red y backend
 */

interface ConnectivityStatus {
  isOnline: boolean;
  backendReachable: boolean;
  lastCheck: Date;
  error?: string;
}

class ConnectivityService {
  private status: ConnectivityStatus = {
    isOnline: false,
    backendReachable: false,
    lastCheck: new Date()
  };

  private readonly BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  private readonly CHECK_TIMEOUT = 3000; // 3 segundos

  /**
   * Verifica si hay conectividad básica de red
   */
  async checkNetworkConnectivity(): Promise<boolean> {
    try {
      // Verificar si estamos online usando navigator.onLine
      if (typeof window !== 'undefined' && !navigator.onLine) {
        return false;
      }

      // Hacer una petición simple a un servicio público para verificar conectividad
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.CHECK_TIMEOUT);

      try {
        const response = await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal,
          cache: 'no-cache'
        });
        
        clearTimeout(timeoutId);
        return true;
      } catch (error) {
        clearTimeout(timeoutId);
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica si el backend está disponible
   */
  async checkBackendConnectivity(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.CHECK_TIMEOUT);

      try {
        const response = await fetch(`${this.BACKEND_URL}/health`, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-cache',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        clearTimeout(timeoutId);
        return response.ok;
      } catch (error) {
        clearTimeout(timeoutId);
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica conectividad completa (red + backend)
   */
  async checkFullConnectivity(): Promise<ConnectivityStatus> {
    try {
      // Verificar red primero
      const networkOk = await this.checkNetworkConnectivity();
      
      if (!networkOk) {
        this.status = {
          isOnline: false,
          backendReachable: false,
          lastCheck: new Date(),
          error: 'Sin conectividad de red'
        };
        return this.status;
      }

      // Si hay red, verificar backend
      const backendOk = await this.checkBackendConnectivity();
      
      this.status = {
        isOnline: true,
        backendReachable: backendOk,
        lastCheck: new Date(),
        error: backendOk ? undefined : 'Backend no disponible'
      };

      return this.status;
    } catch (error) {
      this.status = {
        isOnline: false,
        backendReachable: false,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      return this.status;
    }
  }

  /**
   * Obtiene el estado actual de conectividad
   */
  getStatus(): ConnectivityStatus {
    return { ...this.status };
  }

  /**
   * Verifica si es seguro hacer llamadas al backend
   */
  async canMakeBackendCalls(): Promise<boolean> {
    const status = await this.checkFullConnectivity();
    return status.isOnline && status.backendReachable;
  }
}

// Singleton instance
export const connectivityService = new ConnectivityService();

// Hook para usar en componentes React
export function useConnectivity() {
  const [status, setStatus] = React.useState<ConnectivityStatus>(connectivityService.getStatus());
  const [isChecking, setIsChecking] = React.useState(false);

  const checkConnectivity = React.useCallback(async () => {
    setIsChecking(true);
    try {
      const newStatus = await connectivityService.checkFullConnectivity();
      setStatus(newStatus);
    } finally {
      setIsChecking(false);
    }
  }, []);

  React.useEffect(() => {
    // Verificar conectividad al montar el componente
    checkConnectivity();
  }, [checkConnectivity]);

  return {
    status,
    isChecking,
    checkConnectivity,
    canMakeBackendCalls: status.isOnline && status.backendReachable
  };
}

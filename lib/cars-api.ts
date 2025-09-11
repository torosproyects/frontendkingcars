import { BackendCar } from "@/types/carro";
import { connectivityService } from "./service/connectivity-service";
import { fetchWithRetry, withRetry, DEFAULT_RETRY_OPTIONS, isNetworkError } from "./utils/retry-utils";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function getAllCars(): Promise<BackendCar[]> {
  // Verificar conectividad antes de hacer llamadas
  try {
    const connectivityStatus = await connectivityService.checkFullConnectivity();
    
    if (!connectivityStatus.isOnline) {
      throw new Error('Sin conectividad de red');
    }
    
    if (!connectivityStatus.backendReachable) {
      // Backend no disponible, pero continuar con intentos
      console.warn('Backend no disponible, pero continuando con intentos...');
    }
  } catch (connectivityError) {
    // Continuar con los intentos aunque falle la verificación de conectividad
    console.warn('Error verificando conectividad, continuando...');
  }

  // Usar sistema de reintentos robusto
  return withRetry(async () => {
    const response = await fetchWithRetry(`${API_URL}/api/cars`, {
      headers: {
        'Accept': 'application/json'
      },
      keepalive: true
    }, {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 5000,
      backoffMultiplier: 2,
      timeoutMs: 10000
    });

    const backendCars: BackendCar[] = await response.json();
    return backendCars;
  }, {
    maxRetries: 2, // Reintentos adicionales a nivel de función
    baseDelay: 2000,
    maxDelay: 8000,
    backoffMultiplier: 2,
    timeoutMs: 15000
  });
}

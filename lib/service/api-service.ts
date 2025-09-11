import { Auction, Bid, Car, CreateAuctionData } from '../types/auction';
import { fetchWithRetry, withRetry, isNetworkError } from '../utils/retry-utils';
import { connectivityService } from './connectivity-service';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_TIMEOUT = 5000;



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
        'Content-Type': 'application/json',
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
    timeoutMs: 15000
  });
}

export class ApiService {
  static async checkApiHealth(): Promise<boolean> {
    try {
      await apiRequest<{ status: string }>('/health');
      return true;
    } catch {
      return false;
    }
  }

   static async getAuctions(): Promise<Auction[]> {
    try {
      const data = await apiRequest<Auction[]>('/auctions');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('API falló, usando datos estáticos...', error);
      return [];
    }
  }

 
  static async getAuction(id: string): Promise<Auction | null> {
    try {
      const data = await apiRequest<Auction>(`/auctions/${id}`);
      return data;
    } catch (error) {
      console.warn('API falló al obtener subasta, usando estático...', error);
      return null;
    }
  }


  static async placeBid(auctionId: string, amount: number, userId: string, userName: string): Promise<Bid | null> {
    try {
      const data = await apiRequest<{ bid: Bid }>(`/auctions/${auctionId}/bids`, {
        method: 'POST',
        body: JSON.stringify({ amount, userId, userName }),
      });
      return data.bid;
    } catch (error) {
      console.error('Error al pujar:', error);
      return null;
    }
  }


  static async toggleWatchAuction(auctionId: string, userId: string, watch: boolean): Promise<boolean> {
    try {
      await apiRequest<{ success: boolean }>(`/auctions/${auctionId}/watch`, {
        method: watch ? 'POST' : 'DELETE',
        body: JSON.stringify({ userId }),
      });
      return true;
    } catch (error) {
      console.error('Error al observar subasta:', error);
      return false;
    }
  }


  static async createAuction(data: CreateAuctionData, userId: string, userName: string): Promise<Auction | null> {
    try {
      const result = await apiRequest<{ auction: Auction }>('/auctions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return result.auction;
    } catch (error) {
      console.error('Error al crear subasta:', error);
      return null;
    }
  }

  // Obtener carros del usuario
  static async getUserCars(userId: string): Promise<Car[]> {
    try {
      const data = await apiRequest<Car[]>(`/cars/${userId}/cars`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('API falló, usando datos estáticos...', error);
      return [];
    }
  }

  // Finalizar subasta
  static async endAuction(auctionId: string): Promise<Auction | null> {
    try {
      const data = await apiRequest<Auction>(`/auctions/${auctionId}/end`, {
        method: 'POST',
      });
      return data;
    } catch (error) {
      console.error('Error al finalizar subasta:', error);
      return null;
    }
  }
}

// Verificar salud al cargar (solo en cliente)
if (typeof window !== 'undefined') {
  ApiService.checkApiHealth().then(isHealthy => {
    if (!isHealthy ) {
      console.warn('Advertencia: La API no está disponible.');
    }
  });
}
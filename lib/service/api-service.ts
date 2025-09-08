import { Auction, Bid, Car, CreateAuctionData } from '../types/auction';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_TIMEOUT = 5000;



async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado y fue cancelada');
    }
    throw error;
  }
}

export class ApiService {
  static async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 3000);
      return response.ok;
    } catch {
      return false;
    }
  }

   static async getAuctions(): Promise<Auction[]> {
    
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auctions`,{credentials: 'include'});
      if (!response.ok) throw new Error('Error en API');
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('API falló, usando datos estáticos...', error);
      return [];
    }
  }

 
  static async getAuction(id: string): Promise<Auction | null> {
   
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auctions/${id}`, {
      credentials: 'include'
    });
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Error en API');
      }
      const respuesta= await response.json()
      return respuesta;

    } catch (error) {
      console.warn('API falló al obtener subasta, usando estático...', error);
      return null;
    }
  }


  static async placeBid(auctionId: string, amount: number, userId: string, userName: string): Promise<Bid | null> {
     try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auctions/${auctionId}/bids`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, userId, userName }),
      });
      if (!response.ok) throw new Error('Error al pujar');
      const{bid}=await response.json();
      return bid 
    } catch (error) {
      console.error('Error al pujar:', error);
      return null;
    }
  }


  static async toggleWatchAuction(auctionId: string, userId: string, watch: boolean): Promise<boolean> {
   
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auctions/${auctionId}/watch`, {
        method: watch ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error al observar subasta:', error);
      return false;
    }
  }


  static async createAuction(data: CreateAuctionData, userId: string, userName: string): Promise<Auction | null> {
   try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auctions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al crear subasta');
      const { auction } = await response.json();
      return auction
    } catch (error) {
      console.error('Error al crear subasta:', error);
      return null;
    }
  }

  // Obtener carros del usuario
  static async getUserCars(userId: string): Promise<Car[]> {
    
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/cars/${userId}/cars`);
      if (!response.ok) throw new Error('Error en API');
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('API falló, usando datos estáticos...', error);
      return [];
    }
  }

  // Finalizar subasta
  static async endAuction(auctionId: string): Promise<Auction | null> {
    
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auctions/${auctionId}/end`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Error al finalizar');
      return await response.json();
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
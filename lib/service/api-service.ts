// API Service con fallback automático a datos estáticos
import { Auction, Bid, Car, CreateAuctionData } from '../types/auction';

// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ;
const API_TIMEOUT = 5000; // 5 segundos timeout

// Datos estáticos como fallback
const STATIC_CARS: Car[] = [
  {
    id: '1',
    make: 'BMW',
    model: 'M3',
    year: 2020,
    mileage: 45000,
    color: 'Azul',
    images: [
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'BMW M3 en excelente estado, mantenimiento al día. Motor V6 biturbo, transmisión automática de 8 velocidades.',
    condition: 'excellent',
    estimatedValue: 65000,
    ownerId: 'user-1',
    isInAuction: true,
  },
  {
    id: '2',
    make: 'Mercedes',
    model: 'C-Class',
    year: 2019,
    mileage: 32000,
    color: 'Negro',
    images: [
      'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Mercedes C-Class con equipamiento completo. Interior de cuero, sistema de navegación, cámara trasera.',
    condition: 'excellent',
    estimatedValue: 45000,
    ownerId: 'user-2',
    isInAuction: true,
  },
  {
    id: '3',
    make: 'Audi',
    model: 'A4',
    year: 2021,
    mileage: 25000,
    color: 'Gris',
    images: [
      'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Audi A4 prácticamente nuevo. Quattro AWD, asientos deportivos, sistema de sonido premium.',
    condition: 'excellent',
    estimatedValue: 42000,
    ownerId: 'user-3',
    isInAuction: false,
  },
  {
    id: '4',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    mileage: 35000,
    color: 'Blanco',
    images: [
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Toyota Camry híbrido, excelente economía de combustible. Mantenimiento completo.',
    condition: 'excellent',
    estimatedValue: 28000,
    ownerId: 'current-user',
    isInAuction: false,
  },
  {
    id: '5',
    make: 'Honda',
    model: 'Civic',
    year: 2019,
    mileage: 42000,
    color: 'Rojo',
    images: [
      'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Honda Civic deportivo, perfecto para ciudad. Transmisión manual, turbo.',
    condition: 'good',
    estimatedValue: 22000,
    ownerId: 'current-user',
    isInAuction: false,
  }
];

const STATIC_AUCTIONS: Auction[] = [
  {
    id: '1',
    car: STATIC_CARS[0],
    startPrice: 50000,
    reservePrice: 60000,
    currentBid: 52500,
    bidCount: 8,
    highestBidder: 'user-1',
    highestBidderName: 'Juan Pérez',
    startTime: new Date(Date.now() - 86400000), // Ayer
    endTime: new Date(Date.now() + 3600000 * 2), // En 2 horas
    status: 'active',
    bids: [
      {
        id: '1',
        auctionId: '1',
        userId: 'user-1',
        userName: 'Juan Pérez',
        amount: 52500,
        timestamp: new Date(Date.now() - 300000),
      },
      {
        id: '2',
        auctionId: '1',
        userId: 'user-2',
        userName: 'María García',
        amount: 52000,
        timestamp: new Date(Date.now() - 900000),
      }
    ],
    watchers: 24,
    isWatched: false,
    sellerId: 'seller-1',
    sellerName: 'Carlos Vendedor',
  },
  {
    id: '2',
    car: STATIC_CARS[1],
    startPrice: 35000,
    currentBid: 38200,
    bidCount: 12,
    highestBidder: 'user-2',
    highestBidderName: 'María García',
    startTime: new Date(Date.now() - 86400000 * 2),
    endTime: new Date(Date.now() + 86400000), // Mañana
    status: 'active',
    bids: [
      {
        id: '3',
        auctionId: '2',
        userId: 'user-2',
        userName: 'María García',
        amount: 38200,
        timestamp: new Date(Date.now() - 600000),
      }
    ],
    watchers: 18,
    isWatched: true,
    sellerId: 'seller-2',
    sellerName: 'Ana Vendedora',
  },
  {
    id: '3',
    car: STATIC_CARS[2],
    startPrice: 32000,
    currentBid: 32000,
    bidCount: 0,
    startTime: new Date(Date.now() + 3600000), // En 1 hora
    endTime: new Date(Date.now() + 86400000 * 3), // En 3 días
    status: 'upcoming',
    bids: [],
    watchers: 31,
    isWatched: false,
    sellerId: 'seller-3',
    sellerName: 'Luis Vendedor',
  }
];

// Utility para hacer requests con timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = API_TIMEOUT): Promise<Response> {
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
    throw error;
  }
}

// Simulador de delay para hacer más realista
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ApiService {
  private static useStaticData = false;

  // Método para verificar si la API está disponible
  static async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 3000);
      return response.ok;
    } catch {
      console.warn('API no disponible, usando datos estáticos');
      this.useStaticData = true;
      return false;
    }
  }

  // Obtener todas las subastas
  static async getAuctions(): Promise<Auction[]> {
    await delay(800); // Simular latencia de red
    
    if (this.useStaticData) {
      return this.getStaticAuctions();
    }

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auctions`);
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (error) {
      console.warn('Error en API, usando datos estáticos:', error);
      this.useStaticData = true;
      return this.getStaticAuctions();
    }
  }

  // Obtener subasta específica
  static async getAuction(id: string): Promise<Auction | null> {
    await delay(500);
    
    if (this.useStaticData) {
      return STATIC_AUCTIONS.find(a => a.id === id) || null;
    }

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auctions/${id}`);
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (error) {
      console.warn('Error en API, usando datos estáticos:', error);
      return STATIC_AUCTIONS.find(a => a.id === id) || null;
    }
  }

  // Realizar puja
  static async placeBid(auctionId: string, amount: number, userId: string, userName: string): Promise<Bid> {
    await delay(1200); // Simular procesamiento
    
    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      auctionId,
      userId,
      userName,
      amount,
      timestamp: new Date(),
    };

    if (this.useStaticData) {
      // Actualizar datos estáticos localmente
      const auction = STATIC_AUCTIONS.find(a => a.id === auctionId);
      if (auction) {
        auction.currentBid = amount;
        auction.bidCount += 1;
        auction.highestBidder = userId;
        auction.highestBidderName = userName;
        auction.bids.unshift(newBid);
      }
      return newBid;
    }

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auctions/${auctionId}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, userId, userName }),
      });
      
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (error) {
      console.warn('Error en API para puja, usando simulación:', error);
      // Fallback: simular puja exitosa
      return newBid;
    }
  }

  // Observar/dejar de observar subasta
  static async toggleWatchAuction(auctionId: string, userId: string, watch: boolean): Promise<boolean> {
    await delay(300);
    
    if (this.useStaticData) {
      const auction = STATIC_AUCTIONS.find(a => a.id === auctionId);
      if (auction) {
        auction.isWatched = watch;
        auction.watchers += watch ? 1 : -1;
      }
      return watch;
    }

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auctions/${auctionId}/watch`, {
        method: watch ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) throw new Error('API Error');
      return watch;
    } catch (error) {
      console.warn('Error en API para watch, usando simulación:', error);
      return watch;
    }
  }

  // Crear nueva subasta
  static async createAuction(data: CreateAuctionData, userId: string, userName: string): Promise<Auction> {
    await delay(2000); // Simular procesamiento más largo
    
    const car = STATIC_CARS.find(c => c.id === data.carId);
    if (!car) throw new Error('Carro no encontrado');

    const startTime = data.startImmediately ? new Date() : data.scheduledStartTime || new Date();
    const endTime = new Date(startTime.getTime() + (data.duration * 60 * 60 * 1000));

    const newAuction: Auction = {
      id: `auction-${Date.now()}`,
      car: { ...car, isInAuction: true },
      startPrice: data.startPrice,
      reservePrice: data.reservePrice,
      currentBid: data.startPrice,
      bidCount: 0,
      startTime,
      endTime,
      status: data.startImmediately ? 'active' : 'upcoming',
      bids: [],
      watchers: 0,
      isWatched: false,
      sellerId: userId,
      sellerName: userName,
    };

    if (this.useStaticData) {
      STATIC_AUCTIONS.unshift(newAuction);
      return newAuction;
    }

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auctions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (error) {
      console.warn('Error en API para crear subasta, usando simulación:', error);
      STATIC_AUCTIONS.unshift(newAuction);
      return newAuction;
    }
  }

  // Obtener carros del usuario
  static async getUserCars(userId: string): Promise<Car[]> {
    await delay(400);
    
    if (this.useStaticData) {
      return STATIC_CARS.filter(car => car.ownerId === userId);
    }

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/users/${userId}/cars`);
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (error) {
      console.warn('Error en API para carros de usuario, usando datos estáticos:', error);
      this.useStaticData = true;
      return STATIC_CARS.filter(car => car.ownerId === userId);
    }
  }

  // Finalizar subasta (llamado automáticamente cuando termina el tiempo)
  static async endAuction(auctionId: string): Promise<Auction> {
    await delay(1000);
    
    if (this.useStaticData) {
      const auction = STATIC_AUCTIONS.find(a => a.id === auctionId);
      if (auction) {
        auction.status = 'ended';
        // Marcar al ganador si hay pujas
        if (auction.bids.length > 0) {
          auction.bids[0].isWinner = true;
        }
      }
      return auction!;
    }

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auctions/${auctionId}/end`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (error) {
      console.warn('Error en API para finalizar subasta, usando simulación:', error);
      const auction = STATIC_AUCTIONS.find(a => a.id === auctionId);
      if (auction) {
        auction.status = 'ended';
        if (auction.bids.length > 0) {
          auction.bids[0].isWinner = true;
        }
      }
      return auction!;
    }
  }

  // Obtener datos estáticos (método privado)
  private static getStaticAuctions(): Auction[] {
    // Actualizar estados basado en tiempo actual
    return STATIC_AUCTIONS.map(auction => {
      const now = new Date();
      const endTime = new Date(auction.endTime);
      const startTime = new Date(auction.startTime);
      
      let status: Auction['status'] = auction.status;
      
      if (now > endTime) {
        status = 'ended';
      } else if (now > startTime && now < endTime) {
        status = 'active';
      } else if (now < startTime) {
        status = 'upcoming';
      }
      
      return { ...auction, status };
    });
  }

  // Método para forzar uso de datos estáticos (útil para testing)
  static forceStaticMode(force: boolean = true) {
    this.useStaticData = force;
  }
}

// Inicializar verificación de API al cargar
if (typeof window !== 'undefined') {
  ApiService.checkApiHealth();
}
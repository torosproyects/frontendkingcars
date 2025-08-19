import { Auction, Bid, Car, CreateAuctionData } from '../types/auction';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_TIMEOUT = 5000;

// Control de fallback estático (solo en desarrollo o forzado)
const SHOULD_USE_STATIC_FALLBACK =
  !API_BASE_URL || process.env.NEXT_PUBLIC_USE_STATIC_DATA === 'true';


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

const STATIC_CARS: Car[] = [
  {
    id: '1',
    make: 'BMW',
    model: 'M3',
    year: 2020,
    mileage: 45000,
    color: 'Azul',
    imagen:'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      { id:"uhuhu",
        url:'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',},
      {id:"assd",
        url:'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800',}
    ],
    description: 'BMW M3 en excelente estado, mantenimiento al día. Motor V6 biturbo, transmisión automática de 8 velocidades.',
    condition: 'usado',
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
    imagen:'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      { id:"uhuhhu",
        url:'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',},
      {id:"ashsd",
        url:'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800',}
    ],
    description: 'Mercedes C-Class con equipamiento completo. Interior de cuero, sistema de navegación, cámara trasera.',
    condition: 'nuevo',
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
   imagen:'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      { id:"u555huhu",
        url:'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',},
      {id:"a555ssd",
        url:'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800',}
    ],
    description: 'Audi A4 prácticamente nuevo. Quattro AWD, asientos deportivos, sistema de sonido premium.',
    condition: 'nuevo',
    estimatedValue: 42000,
    ownerId: 'user-3',
    isInAuction: false,
  },
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
    startTime: new Date(Date.now() - 86400000),
    endTime: new Date(Date.now() + 3600000 * 2),
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
      },
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
    endTime: new Date(Date.now() + 86400000),
    status: 'active',
    bids: [
      {
        id: '3',
        auctionId: '2',
        userId: 'user-2',
        userName: 'María García',
        amount: 38200,
        timestamp: new Date(Date.now() - 600000),
      },
    ],
    watchers: 18,
    isWatched: true,
    sellerId: 'seller-2',
    sellerName: 'Ana Vendedora',
  },
];

function getStaticAuctions(): Auction[] {
  const now = new Date();
  return STATIC_AUCTIONS.map(auction => {
    const startTime = new Date(auction.startTime);
    const endTime = new Date(auction.endTime);
    let status: Auction['status'] = 'upcoming';

    if (now >= startTime && now <= endTime) status = 'active';
    else if (now > endTime) status = 'ended';

    return { ...auction, status };
  });
}

export class ApiService {
  static async checkApiHealth(): Promise<boolean> {
    if (SHOULD_USE_STATIC_FALLBACK) return false;

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 3000);
      return response.ok;
    } catch {
      return false;
    }
  }

   static async getAuctions(): Promise<Auction[]> {
    if (SHOULD_USE_STATIC_FALLBACK) {
      return getStaticAuctions();
    }

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auctions`);
      if (!response.ok) throw new Error('Error en API');
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('API falló, usando datos estáticos...', error);
      return getStaticAuctions();
    }
  }

 
  static async getAuction(id: string): Promise<Auction | null> {
    if (SHOULD_USE_STATIC_FALLBACK) {
      return getStaticAuctions().find(a => a.id === id) || null;
    }

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auctions/${id}`, {
      credentials: 'include'
    });
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Error en API');
      }
      return await response.json();
    } catch (error) {
      console.warn('API falló al obtener subasta, usando estático...', error);
      return getStaticAuctions().find(a => a.id === id) || null;
    }
  }


  static async placeBid(auctionId: string, amount: number, userId: string, userName: string): Promise<Bid | null> {
    if (SHOULD_USE_STATIC_FALLBACK) {
      return {
        id: `bid-${Date.now()}`,
        auctionId,
        userId,
        userName,
        amount,
        timestamp: new Date(),
      };
    }

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auctions/${auctionId}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, userId, userName }),
      });
      if (!response.ok) throw new Error('Error al pujar');
      return await response.json();
    } catch (error) {
      console.error('Error al pujar:', error);
      return null;
    }
  }


  static async toggleWatchAuction(auctionId: string, userId: string, watch: boolean): Promise<boolean> {
    if (SHOULD_USE_STATIC_FALLBACK) return true;

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
      return await response.json();
    } catch (error) {
      console.error('Error al crear subasta:', error);
      return null;
    }
  }

  // Obtener carros del usuario
  static async getUserCars(userId: string): Promise<Car[]> {
    if (SHOULD_USE_STATIC_FALLBACK) {
      return STATIC_CARS.filter(car => car.ownerId === userId);
    }

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/cars/${userId}/cars`);
      if (!response.ok) throw new Error('Error en API');
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('API falló, usando datos estáticos...', error);
      return STATIC_CARS.filter(car => car.ownerId === userId);
    }
  }

  // Finalizar subasta
  static async endAuction(auctionId: string): Promise<Auction | null> {
    if (SHOULD_USE_STATIC_FALLBACK) {
      const auction = getStaticAuctions().find(a => a.id === auctionId) || null;
      if (auction) auction.status = 'ended';
      return auction;
    }

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
    if (!isHealthy && !SHOULD_USE_STATIC_FALLBACK) {
      console.warn('Advertencia: La API no está disponible.');
    }
  });
}
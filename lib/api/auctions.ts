import { Auction, CreateAuctionData, UserCar, Bid } from '@/lib/types/auction';


// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Datos simulados de carros del usuario
const mockUserCars: UserCar[] = [
  {
    id: 1,
    make: "BMW",
    model: "M4 Competition",
    year: 2023,
    image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
    isAvailableForAuction: true,
  },
  {
    id: 3,
    make: "Audi",
    model: "e-tron GT",
    year: 2023,
    image: "https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg",
    isAvailableForAuction: true,
  },
  {
    id: 5,
    make: "Tesla",
    model: "Model S",
    year: 2023,
    image: "https://images.pexels.com/photos/13861/IMG_3496bfree.jpg",
    isAvailableForAuction: false,
    currentAuctionId: "auction-1",
  },
];

// Datos simulados de subastas
const mockAuctions: Auction[] = [
  {
    id: "auction-1",
    carId: 5,
    sellerId: "3",
    title: "Tesla Model S 2023 - Subasta Exclusiva",
    description: "Tesla Model S en excelente condición, con todas las características premium.",
    startingPrice: 75000,
    currentPrice: 82000,
    reservePrice: 85000,
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Hace 1 día
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // En 2 días
    status: 'active',
    bids: [
      {
        id: "bid-1",
        auctionId: "auction-1",
        bidderId: "user-1",
        bidderName: "Carlos M.",
        amount: 76000,
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        isWinning: false,
      },
      {
        id: "bid-2",
        auctionId: "auction-1",
        bidderId: "user-2",
        bidderName: "María L.",
        amount: 82000,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isWinning: true,
      },
    ],
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

// API de subastas simulada
export const auctionsAPI = {
  // Obtener carros del usuario disponibles para subasta
  getUserCars: async (userId: string): Promise<UserCar[]> => {
    await delay(1000);
    
    // Simular que solo algunos usuarios tienen carros
    if (userId === "3") { // Cliente de ejemplo
      return mockUserCars;
    }
    
    // Para otros usuarios, devolver algunos carros
    return mockUserCars.slice(0, 2);
  },

  // Crear nueva subasta
  createAuction: async (data: CreateAuctionData, userId: string): Promise<Auction> => {
    await delay(2000);
    
    // Simular validaciones del backend
    if (data.startingPrice < 1000) {
      throw new Error('El precio inicial debe ser de al menos $1,000');
    }
    
    if (data.duration < 1 || data.duration > 168) { // 1 hora a 7 días
      throw new Error('La duración debe estar entre 1 hora y 7 días');
    }
    
    // Verificar que el carro pertenece al usuario
    const userCar = mockUserCars.find(car => car.id === data.carId);
    if (!userCar) {
      throw new Error('El vehículo seleccionado no te pertenece');
    }
    
    if (!userCar.isAvailableForAuction) {
      throw new Error('Este vehículo ya está en subasta');
    }
    
    // Simular error ocasional
    if (Math.random() > 0.9) {
      throw new Error('Error del servidor. Por favor, inténtalo de nuevo.');
    }
    
    // Crear nueva subasta
    const startDate = new Date(data.startDate);
    const endDate = new Date(startDate.getTime() + data.duration * 60 * 60 * 1000);
    
    const newAuction: Auction = {
      id: `auction-${Date.now()}`,
      carId: data.carId,
      sellerId: userId,
      title: data.title,
      description: data.description,
      startingPrice: data.startingPrice,
      currentPrice: data.startingPrice,
      reservePrice: data.reservePrice,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: startDate <= new Date() ? 'active' : 'draft',
      bids: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Agregar a la lista simulada
    mockAuctions.push(newAuction);
    
    // Marcar el carro como no disponible
    const carIndex = mockUserCars.findIndex(car => car.id === data.carId);
    if (carIndex !== -1) {
      mockUserCars[carIndex].isAvailableForAuction = false;
      mockUserCars[carIndex].currentAuctionId = newAuction.id;
    }
    
    return newAuction;
  },

  // Obtener subastas del usuario
  getUserAuctions: async (userId: string): Promise<Auction[]> => {
    await delay(800);
    return mockAuctions.filter(auction => auction.sellerId === userId);
  },

  // Obtener todas las subastas activas
  getActiveAuctions: async (): Promise<Auction[]> => {
    await delay(1000);
    return mockAuctions.filter(auction => auction.status === 'active');
  },

  // Obtener subasta por ID
  getAuctionById: async (auctionId: string): Promise<Auction | null> => {
    await delay(500);
    return mockAuctions.find(auction => auction.id === auctionId) || null;
  },

  // Hacer una oferta
  placeBid: async (auctionId: string, amount: number, userId: string): Promise<Bid> => {
    await delay(1500);
    
    const auction = mockAuctions.find(a => a.id === auctionId);
    if (!auction) {
      throw new Error('Subasta no encontrada');
    }
    
    if (auction.status !== 'active') {
      throw new Error('Esta subasta no está activa');
    }
    
    if (amount <= auction.currentPrice) {
      throw new Error(`La oferta debe ser mayor a $${auction.currentPrice.toLocaleString()}`);
    }
    
    if (auction.sellerId === userId) {
      throw new Error('No puedes ofertar en tu propia subasta');
    }
    
    // Crear nueva oferta
    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      auctionId,
      bidderId: userId,
      bidderName: "Usuario Anónimo", // En una app real, obtener del perfil
      amount,
      timestamp: new Date().toISOString(),
      isWinning: true,
    };
    
    // Marcar ofertas anteriores como no ganadoras
    auction.bids.forEach(bid => bid.isWinning = false);
    
    // Agregar nueva oferta
    auction.bids.push(newBid);
    auction.currentPrice = amount;
    auction.updatedAt = new Date().toISOString();
    
    return newBid;
  },
};
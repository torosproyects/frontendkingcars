import { Auction, CreateAuctionData, UserCar, Bid, Car } from '@/lib/types/auction';

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
    car: {
      id: "5",
      make: "Tesla",
      model: "Model S",
      year: 2023,
      mileage: 15000,
      color: "Negro",
      images: ["https://images.pexels.com/photos/13861/IMG_3496bfree.jpg"],
      description: "Tesla Model S en excelente condición.",
      condition: "excellent",
      estimatedValue: 88000,
      ownerId: "3",
      isInAuction: true,
    },
    startPrice: 75000,
    reservePrice: 85000,
    currentBid: 82000,
    bidCount: 2,
    highestBidder: "user-2",
    highestBidderName: "María L.",
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: "active",
    bids: [
      {
        id: "bid-1",
        auctionId: "auction-1",
        userId: "user-1",
        userName: "Carlos M.",
        amount: 76000,
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
        isWinner: false,
      },
      {
        id: "bid-2",
        auctionId: "auction-1",
        userId: "user-2",
        userName: "María L.",
        amount: 82000,
        timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
        isWinner: true,
      },
    ],
    watchers: 10,
    isWatched: false,
    sellerId: "3",
    sellerName: "Luis G.",
  },
];

// API de subastas simulada
export const auctionsAPI = {
  // Obtener carros del usuario disponibles para subasta
  getUserCars: async (userId: string): Promise<UserCar[]> => {
    await delay(1000);

    if (userId === "3") {
      return mockUserCars;
    }

    return mockUserCars.slice(0, 2);
  },

  // Crear nueva subasta
  createAuction: async (data: CreateAuctionData, userId: string, userName: string): Promise<Auction> => {
    await delay(2000);

    if (data.startPrice < 1000) {
      throw new Error("El precio inicial debe ser de al menos $1,000");
    }

    if (data.duration < 1 || data.duration > 168) {
      throw new Error("La duración debe estar entre 1 y 168 horas");
    }

    const userCar = mockUserCars.find(car => car.id.toString() === data.carId);
    if (!userCar) {
      throw new Error("El vehículo no te pertenece");
    }

    if (!userCar.isAvailableForAuction) {
      throw new Error("Este vehículo ya está en subasta");
    }

    const startTime = data.startImmediately ? new Date() : data.scheduledStartTime!;
    const endTime = new Date(startTime.getTime() + data.duration * 60 * 60 * 1000);

    const newAuction: Auction = {
      id: `auction-${Date.now()}`,
      car: {
        id: data.carId,
        make: userCar.make,
        model: userCar.model,
        year: userCar.year,
        mileage: 0,
        color: "Gris",
        images: [userCar.image],
        description: "Auto en buen estado.",
        condition: "good",
        estimatedValue: data.reservePrice ?? data.startPrice,
        ownerId: userId,
        isInAuction: true,
      },
      startPrice: data.startPrice,
      reservePrice: data.reservePrice,
      currentBid: data.startPrice,
      bidCount: 0,
      startTime,
      endTime,
      status: startTime <= new Date() ? "active" : "upcoming",
      bids: [],
      watchers: 0,
      sellerId: userId,
      sellerName: userName,
    };

    mockAuctions.push(newAuction);

    const carIndex = mockUserCars.findIndex(c => c.id.toString() === data.carId);
    if (carIndex !== -1) {
      mockUserCars[carIndex].isAvailableForAuction = false;
      mockUserCars[carIndex].currentAuctionId = newAuction.id;
    }

    return newAuction;
  },

  // Obtener subastas del usuario
  getUserAuctions: async (userId: string): Promise<Auction[]> => {
    await delay(800);
    return mockAuctions.filter(a => a.sellerId === userId);
  },

  // Obtener todas las subastas activas
  getActiveAuctions: async (): Promise<Auction[]> => {
    await delay(1000);
    return mockAuctions.filter(a => a.status === "active");
  },

  // Obtener subasta por ID
  getAuctionById: async (auctionId: string): Promise<Auction | null> => {
    await delay(500);
    return mockAuctions.find(a => a.id === auctionId) || null;
  },

  // Hacer una oferta
  placeBid: async (auctionId: string, amount: number, userId: string): Promise<Bid> => {
    await delay(1500);

    const auction = mockAuctions.find(a => a.id === auctionId);
    if (!auction) throw new Error("Subasta no encontrada");

    if (auction.status !== "active") throw new Error("Esta subasta no está activa");

    if (amount <= auction.currentBid) {
      throw new Error(`La oferta debe ser mayor a $${auction.currentBid.toLocaleString()}`);
    }

    if (auction.sellerId === userId) {
      throw new Error("No puedes ofertar en tu propia subasta");
    }

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      auctionId,
      userId,
      userName: "Usuario Anónimo",
      amount,
      timestamp: new Date(),
      isWinner: true,
    };

    auction.bids.forEach(b => (b.isWinner = false));

    auction.bids.push(newBid);
    auction.currentBid = amount;
    auction.highestBidder = userId;
    auction.highestBidderName = "Usuario Anónimo";
    auction.bidCount++;

    return newBid;
  },
};

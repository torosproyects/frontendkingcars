export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  color: string;
  imagen:string;
  images: CarImageA[];
  description: string;
  condition: 'nuevo' | 'usado' | 'reparado' ;
  estimatedValue: number;
  ownerId: string; // ID del propietario
  isInAuction?: boolean; // Si ya está en subasta
}
export interface CarImageA {
  id: string;
  url: string;
}
export interface Bid {
  id: string;
  auctionId: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: Date;
  isWinner?: boolean;
}

export interface Auction {
  id: string;
  car: Car;
  startPrice: number;
  reservePrice?: number;
  currentBid: number;
  bidCount: number;
  highestBidder?: string;
  highestBidderName?: string;
  startTime: Date;
  endTime: Date;
  status: 'upcoming' | 'active' | 'ended';
  bids: Bid[];
  watchers: number;
  isWatched?: boolean;
  sellerId: string; // ID del vendedor
  sellerName: string; // Nombre del vendedor
}

export interface CreateAuctionData {
  carId: string;
  startPrice: number;
  reservePrice?: number;
  duration: number; // Duración en horas
  startImmediately: boolean;
  scheduledStartTime?: Date;
}

export interface AuctionState {
  auctions: Auction[];
  currentAuction: Auction | null;
  userBids: Bid[];
  watchedAuctions: string[];
  userAuctions: Auction[]; // Subastas del usuario
  loading: boolean;
  error: string | null;
}

export interface AuctionActions {
  setAuctions: (auctions: Auction[]) => void;
  setCurrentAuction: (auction: Auction | null) => void;
  addBid: (auctionId: string, bid: Omit<Bid, 'id' | 'timestamp'>) => void;
  watchAuction: (auctionId: string) => void;
  unwatchAuction: (auctionId: string) => void;
  updateAuctionStatus: (auctionId: string, status: Auction['status']) => void;
  createAuction: (auctionData: CreateAuctionData, userId: string, userName: string) => Promise<void>;
  getUserAuctions: (userId: string) => Auction[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

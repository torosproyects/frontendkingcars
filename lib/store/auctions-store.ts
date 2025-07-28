import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Auction, AuctionState, AuctionActions, Bid, CreateAuctionData, Car } from '../types/auction';
import { ApiService } from "@/lib/service/api-service";
import { wsService, WebSocketMessage, BidPlacedData, TimerUpdateData } from '@/lib/service//websocket-service';

// Tipos para notificaciones
export interface AuctionNotification {
  id: string;
  type: 'bid_placed' | 'auction_ending' | 'auction_ended' | 'outbid' | 'won_auction' | 'new_auction';
  title: string;
  message: string;
  timestamp: Date;
  auctionId?: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface ExtendedAuctionState extends AuctionState {
  notifications: AuctionNotification[];
  isLoading: boolean;
  lastUpdate: Date | null;
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  activeAuctionId: string | null; // Subasta que estamos viendo actualmente
}

interface ExtendedAuctionActions extends AuctionActions {
  // Métodos de API
  fetchAuctions: () => Promise<void>;
  fetchAuction: (id: string) => Promise<void>;
  placeBid: (auctionId: string, amount: number, userId: string, userName: string) => Promise<void>;
  toggleWatch: (auctionId: string, userId: string) => Promise<void>;
  
  // WebSocket
  connectWebSocket: (userId: string) => Promise<void>;
  disconnectWebSocket: () => void;
  joinAuction: (auctionId: string) => void;
  leaveAuction: (auctionId: string) => void;
  
  // Notificaciones
  addNotification: (notification: Omit<AuctionNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  getUnreadCount: () => number;
  
  // Estados
  setConnectionStatus: (status: ExtendedAuctionState['connectionStatus']) => void;
  setActiveAuction: (auctionId: string | null) => void;
  
  // Datos de usuario
  fetchUserCars: (userId: string) => Promise<Car[]>;
}

export const useAuctionStore = create<ExtendedAuctionState & ExtendedAuctionActions>()(
  persist(
    (set, get) => ({
      // Estado inicial
      auctions: [],
      currentAuction: null,
      userBids: [],
      watchedAuctions: [],
      userAuctions: [],
      loading: false,
      error: null,
      notifications: [],
      isLoading: false,
      lastUpdate: null,
      connectionStatus: 'disconnected',
      activeAuctionId: null,

      // Acciones básicas
      setAuctions: (auctions) => set({ auctions, lastUpdate: new Date() }),
      setCurrentAuction: (auction) => set({ currentAuction: auction }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setConnectionStatus: (status) => set({ connectionStatus: status }),
      setActiveAuction: (auctionId) => set({ activeAuctionId: auctionId }),

      // WebSocket Connection
      connectWebSocket: async (userId: string) => {
        set({ connectionStatus: 'connecting' });
        
        try {
          await wsService.connect(userId);
          set({ connectionStatus: 'connected' });

          // Configurar listeners de WebSocket
          const state = get();

          // Listener para nuevas pujas
          wsService.on('bid_placed', (data: BidPlacedData) => {
            const { bid, auction } = data;
            
            set((state) => {
              // Actualizar lista de subastas
              const updatedAuctions = state.auctions.map((a) =>
                a.id === auction.id ? auction : a
              );

              // Actualizar subasta actual si es la misma
              const updatedCurrentAuction = state.currentAuction?.id === auction.id 
                ? auction 
                : state.currentAuction;

              // Agregar a pujas del usuario si es suya
              const updatedUserBids = bid.userId === userId 
                ? [bid, ...state.userBids]
                : state.userBids;

              return {
                auctions: updatedAuctions,
                currentAuction: updatedCurrentAuction,
                userBids: updatedUserBids,
              };
            });

            // Notificación
            if (bid.userId === userId) {
              state.addNotification({
                type: 'bid_placed',
                title: '✅ Puja realizada',
                message: `Has pujado $${bid.amount.toLocaleString()} exitosamente`,
                auctionId: auction.id,
                priority: 'medium',
              });
            } else if (state.watchedAuctions.includes(auction.id)) {
              state.addNotification({
                type: 'outbid',
                title: '🔔 Nueva puja',
                message: `${bid.userName} pujó $${bid.amount.toLocaleString()}`,
                auctionId: auction.id,
                priority: 'low',
              });
            }
          });

          // Listener para actualizaciones de timer
          wsService.on('timer_update', (data: TimerUpdateData) => {
            set((state) => {
              const updatedAuctions = state.auctions.map((auction) =>
                auction.id === data.auctionId
                  ? { ...auction, status: data.status }
                  : auction
              );

              const updatedCurrentAuction = state.currentAuction?.id === data.auctionId
                ? { ...state.currentAuction, status: data.status }
                : state.currentAuction;

              return {
                auctions: updatedAuctions,
                currentAuction: updatedCurrentAuction,
              };
            });

            // Notificaciones de tiempo
            if (data.timeRemaining <= 300000 && data.timeRemaining > 240000) { // 5 minutos
              state.addNotification({
                type: 'auction_ending',
                title: '⏰ ¡Últimos 5 minutos!',
                message: 'La subasta termina pronto',
                auctionId: data.auctionId,
                priority: 'high',
              });
            }
          });

          // Listener para subastas terminadas
          wsService.on('auction_ended', (data: { auction: Auction }) => {
            const { auction } = data;
            
            set((state) => {
              const updatedAuctions = state.auctions.map((a) =>
                a.id === auction.id ? { ...auction, status: 'ended' as const} : a
              );

              const updatedCurrentAuction = state.currentAuction?.id === auction.id
                ? { ...auction, status: 'ended' as const }
                : state.currentAuction;

              return {
                auctions: updatedAuctions,
                currentAuction: updatedCurrentAuction,
              };
            });

            // Notificación de finalización
            if (auction.highestBidder === userId) {
              state.addNotification({
                type: 'won_auction',
                title: '🎉 ¡Ganaste la subasta!',
                message: `Has ganado ${auction.car.make} ${auction.car.model} por $${auction.currentBid.toLocaleString()}`,
                auctionId: auction.id,
                priority: 'high',
              });
            } else if (state.watchedAuctions.includes(auction.id)) {
              state.addNotification({
                type: 'auction_ended',
                title: '🏁 Subasta finalizada',
                message: `${auction.car.make} ${auction.car.model} se vendió por $${auction.currentBid.toLocaleString()}`,
                auctionId: auction.id,
                priority: 'medium',
              });
            }
          });

          // Listener para nuevas subastas
          wsService.on('auction_started', (data: { auction: Auction }) => {
            const { auction } = data;
            
            set((state) => ({
              auctions: [auction, ...state.auctions],
            }));

            state.addNotification({
              type: 'new_auction',
              title: '🚗 Nueva subasta',
              message: `${auction.car.make} ${auction.car.model} está en subasta`,
              auctionId: auction.id,
              priority: 'low',
            });
          });

        } catch (error) {
          set({ connectionStatus: 'disconnected' });
          console.error('Error conectando WebSocket:', error);
        }
      },

      disconnectWebSocket: () => {
        wsService.disconnect();
        set({ connectionStatus: 'disconnected' });
      },

      joinAuction: (auctionId: string) => {
        wsService.joinAuction(auctionId);
        set({ activeAuctionId: auctionId });
      },

      leaveAuction: (auctionId: string) => {
        wsService.leaveAuction(auctionId);
        if (get().activeAuctionId === auctionId) {
          set({ activeAuctionId: null });
        }
      },

      // Fetch auctions desde API
      fetchAuctions: async () => {
        set({ isLoading: true, error: null });
        try {
          const auctions = await ApiService.getAuctions();
          set({ 
            auctions, 
            isLoading: false, 
            lastUpdate: new Date(),
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar subastas',
            isLoading: false 
          });
        }
      },

      // Fetch auction específica
      fetchAuction: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const auction = await ApiService.getAuction(id);
          set({ 
            currentAuction: auction, 
            loading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar subasta',
            loading: false 
          });
        }
      },

      // Realizar puja (WebSocket + API fallback)
      placeBid: async (auctionId: string, amount: number, userId: string, userName: string) => {
        set({ loading: true, error: null });
        
        try {
          // Intentar por WebSocket primero
          if (wsService.isConnected) {
            const success = wsService.placeBid(auctionId, amount, userId, userName);
            if (success) {
              set({ loading: false });
              return; // WebSocket manejará la actualización
            }
          }

          // Fallback a API REST
          const newBid = await ApiService.placeBid(auctionId, amount, userId, userName);
          
          // Actualizar estado local
          set((state) => {
            const updatedAuctions = state.auctions.map((auction) =>
              auction.id === auctionId
                ? {
                    ...auction,
                    currentBid: amount,
                    bidCount: auction.bidCount + 1,
                    highestBidder: userId,
                    highestBidderName: userName,
                    bids: [newBid, ...auction.bids],
                  }
                : auction
            );

            const updatedCurrentAuction = state.currentAuction?.id === auctionId
              ? {
                  ...state.currentAuction,
                  currentBid: amount,
                  bidCount: state.currentAuction.bidCount + 1,
                  highestBidder: userId,
                  highestBidderName: userName,
                  bids: [newBid, ...state.currentAuction.bids],
                }
              : state.currentAuction;

            return {
              auctions: updatedAuctions,
              currentAuction: updatedCurrentAuction,
              userBids: [newBid, ...state.userBids],
              loading: false,
            };
          });

          // Agregar notificación
          get().addNotification({
            type: 'bid_placed',
            title: '✅ Puja realizada',
            message: `Has pujado $${amount.toLocaleString()} exitosamente`,
            auctionId,
            priority: 'medium',
          });

        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al realizar puja',
            loading: false 
          });
          throw error;
        }
      },

      // Toggle watch auction
      toggleWatch: async (auctionId: string, userId: string) => {
        const state = get();
        const isCurrentlyWatched = state.watchedAuctions.includes(auctionId);
        const newWatchState = !isCurrentlyWatched;

        try {
          await ApiService.toggleWatchAuction(auctionId, userId, newWatchState);
          
          set((state) => ({
            watchedAuctions: newWatchState
              ? [...state.watchedAuctions, auctionId]
              : state.watchedAuctions.filter(id => id !== auctionId),
            auctions: state.auctions.map((auction) =>
              auction.id === auctionId
                ? { 
                    ...auction, 
                    isWatched: newWatchState,
                    watchers: auction.watchers + (newWatchState ? 1 : -1)
                  }
                : auction
            ),
            currentAuction: state.currentAuction?.id === auctionId
              ? { 
                  ...state.currentAuction, 
                  isWatched: newWatchState,
                  watchers: state.currentAuction.watchers + (newWatchState ? 1 : -1)
                }
              : state.currentAuction,
          }));

          get().addNotification({
            type: 'bid_placed',
            title: newWatchState ? '👁️ Subasta agregada' : '👁️ Subasta removida',
            message: newWatchState 
              ? 'Agregada a tu lista de observación' 
              : 'Removida de tu lista de observación',
            auctionId,
            priority: 'low',
          });

        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Error al actualizar observación' });
        }
      },

      // Métodos heredados (compatibilidad)
      addBid: (auctionId, bidData) => {
        console.warn('addBid deprecated, use placeBid instead');
      },

      watchAuction: (auctionId) => {
        console.warn('watchAuction deprecated, use toggleWatch instead');
      },

      unwatchAuction: (auctionId) => {
        console.warn('unwatchAuction deprecated, use toggleWatch instead');
      },

      updateAuctionStatus: (auctionId, status) => {
        set((state) => ({
          auctions: state.auctions.map((auction) =>
            auction.id === auctionId ? { ...auction, status } : auction
          ),
          currentAuction: state.currentAuction?.id === auctionId 
            ? { ...state.currentAuction, status }
            : state.currentAuction,
        }));
      },

      createAuction: async (auctionData: CreateAuctionData, userId: string, userName: string) => {
        set({ loading: true, error: null });
        try {
          const newAuction = await ApiService.createAuction(auctionData, userId, userName);
          
          set((state) => ({
            auctions: [newAuction, ...state.auctions],
            loading: false,
          }));

          const addNotification = get().addNotification;
          addNotification({
            type: 'new_auction',
            title: '🚗 Subasta creada',
            message: `Tu subasta de ${newAuction.car.make} ${newAuction.car.model} está activa`,
            auctionId: newAuction.id,
            priority: 'medium',
          });

        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Error al crear la subasta' 
          });
          throw error;
        }
      },

      getUserAuctions: (userId: string) => {
        const state = get();
        return state.auctions.filter(auction => auction.sellerId === userId);
      },

      // Gestión de notificaciones
      addNotification: (notificationData) => {
        const notification: AuctionNotification = {
          ...notificationData,
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          read: false,
        };

        set((state) => ({
          notifications: [notification, ...state.notifications.slice(0, 99)] // Mantener máximo 100
        }));
      },

      markNotificationRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length;
      },

      // Obtener carros del usuario
      fetchUserCars: async (userId: string) => {
        try {
          return await ApiService.getUserCars(userId);
        } catch (error) {
          console.error('Error fetching user cars:', error);
          return [];
        }
      },
    }),
    {
      name: 'auction-storage',
      partialize: (state) => ({
        watchedAuctions: state.watchedAuctions,
        userBids: state.userBids,
        userAuctions: state.userAuctions,
        notifications: state.notifications,
        lastUpdate: state.lastUpdate,
      }),
    }
  )
);

// Hook para auto-conectar WebSocket
export const useAuctionWebSocket = (userId?: string) => {
  const { 
    connectWebSocket, 
    disconnectWebSocket, 
    connectionStatus,
    fetchAuctions 
  } = useAuctionStore();

  React.useEffect(() => {
    if (userId) {
      // Conectar WebSocket
      connectWebSocket(userId);
      
      // Cargar datos iniciales
      fetchAuctions();

      return () => {
        disconnectWebSocket();
      };
    }
  }, [userId, connectWebSocket, disconnectWebSocket, fetchAuctions]);

  return { connectionStatus };
};

// React import
import React from 'react';
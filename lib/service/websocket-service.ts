// Servicio WebSocket para subastas en tiempo real
import { Auction, Bid } from '../types/auction';

export interface WebSocketMessage {
  type: 'bid_placed' | 'auction_ended' | 'auction_started' | 'timer_update' | 'user_joined' | 'user_left';
  data: any;
  auctionId?: string;
  timestamp: Date;
}

export interface BidPlacedData {
  bid: Bid;
  auction: Auction;
}

export interface TimerUpdateData {
  auctionId: string;
  timeRemaining: number;
  status: Auction['status'];
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private isConnecting = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  // URL del WebSocket - en producción sería wss://api.carauction.com/ws
  private readonly WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';

  connect(userId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        // Ya hay una conexión en progreso
        setTimeout(() => {
          if (this.ws?.readyState === WebSocket.OPEN) {
            resolve();
          } else {
            reject(new Error('Conexión en progreso falló'));
          }
        }, 3000);
        return;
      }

      this.isConnecting = true;

      try {
        const wsUrl = userId ? `${this.WS_URL}?userId=${userId}` : this.WS_URL;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('✅ WebSocket conectado');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            message.timestamp = new Date(message.timestamp);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('🔌 WebSocket desconectado:', event.code, event.reason);
          this.isConnecting = false;
          this.stopHeartbeat();
          
          // Reconectar automáticamente si no fue intencional
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect(userId);
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ Error WebSocket:', error);
          this.isConnecting = false;
          reject(error);
        };

        // Timeout para la conexión
        setTimeout(() => {
          if (this.ws?.readyState !== WebSocket.OPEN) {
            this.ws?.close();
            this.isConnecting = false;
            reject(new Error('Timeout de conexión WebSocket'));
          }
        }, 10000);

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private scheduleReconnect(userId?: string) {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Backoff exponencial
    
    console.log(`🔄 Reintentando conexión en ${delay}ms (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect(userId).catch(console.error);
    }, delay);
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Ping cada 30 segundos
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleMessage(message: WebSocketMessage) {
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach(callback => callback(message.data));
    }

    // Listeners globales
    const globalListeners = this.listeners.get('*');
    if (globalListeners) {
      globalListeners.forEach(callback => callback(message));
    }
  }

  // Suscribirse a eventos
  on(eventType: string, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    // Retornar función para desuscribirse
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    };
  }

  // Desuscribirse de eventos
  off(eventType: string, callback?: (data: any) => void) {
    if (callback) {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    } else {
      this.listeners.delete(eventType);
    }
  }

  // Enviar mensaje
  send(message: Omit<WebSocketMessage, 'timestamp'>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        ...message,
        timestamp: new Date(),
      };
      this.ws.send(JSON.stringify(fullMessage));
      return true;
    }
    console.warn('⚠️ WebSocket no está conectado, no se puede enviar mensaje');
    return false;
  }

  // Unirse a una subasta específica
  joinAuction(auctionId: string) {
    return this.send({
      type: 'user_joined',
      data: { auctionId },
      auctionId,
    });
  }

  // Salir de una subasta específica
  leaveAuction(auctionId: string) {
    return this.send({
      type: 'user_left',
      data: { auctionId },
      auctionId,
    });
  }

  // Realizar puja
  placeBid(auctionId: string, amount: number, userId: string, userName: string) {
    return this.send({
      type: 'bid_placed',
      data: {
        auctionId,
        amount,
        userId,
        userName,
      },
      auctionId,
    });
  }

  // Desconectar
  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, 'Desconexión intencional');
      this.ws = null;
    }
    this.listeners.clear();
    this.reconnectAttempts = 0;
  }

  // Estado de conexión
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  get connectionState(): string {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CLOSING: return 'closing';
      case WebSocket.CLOSED: return 'disconnected';
      default: return 'unknown';
    }
  }
}

// Instancia singleton
export const wsService = new WebSocketService();

// Hook para usar WebSocket en componentes React
import { useEffect, useRef } from 'react';

export function useWebSocket(eventType: string, callback: (data: any) => void, deps: any[] = []) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const unsubscribe = wsService.on(eventType, (data) => {
      callbackRef.current(data);
    });

    return unsubscribe;
  }, [eventType, ...deps]);
}

// Hook para conectar automáticamente
export function useWebSocketConnection(userId?: string) {
  const [connectionState, setConnectionState] = useState<string>('disconnected');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const connect = async () => {
      try {
        setError(null);
        setConnectionState('connecting');
        await wsService.connect(userId);
        if (mounted) {
          setConnectionState('connected');
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Error de conexión');
          setConnectionState('disconnected');
        }
      }
    };

    connect();

    // Listener para cambios de estado
    const checkConnection = setInterval(() => {
      if (mounted) {
        setConnectionState(wsService.connectionState);
      }
    }, 1000);

    return () => {
      mounted = false;
      clearInterval(checkConnection);
      wsService.disconnect();
    };
  }, [userId]);

  return { connectionState, error, isConnected: connectionState === 'connected' };
}

// React imports
import { useState } from 'react';
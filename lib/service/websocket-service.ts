// services/WebSocketService.ts
import { io, Socket } from 'socket.io-client';
import { useEffect, useRef, useCallback, useState } from 'react';
import type { Auction, Bid } from '../types/auction';

// === INTERFACES ===
export interface WebSocketMessage {
  type:
    | 'bid_placed'
    | 'auction_ended'
    | 'auction_started'
    | 'timer_update'
    | 'user_joined'
    | 'user_left'
    // eventos locales del cliente (no vienen del servidor)
    | 'socket_connected'
    | 'socket_disconnected'
    | 'socket_error'
    | 'socket_reconnecting';
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

type ConnectionState = 'connecting' | 'connected' | 'disconnected';

// === CLASE PRINCIPAL ===
class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  // Reconexión con backoff exponencial + jitter
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts =
    process.env.NODE_ENV === 'production' ? 8 : Infinity;
  private reconnectTimers: Set<ReturnType<typeof setTimeout>> = new Set();

  // Usa HTTP/HTTPS para socket.io (no ws://wss://)
  private readonly WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';

  // === Conectar ===
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        this.emitLocal('socket_connected');
        resolve();
        return;
      }

      // Si existe una instancia previa, primero limpiamos
      if (this.socket) {
        this.cleanupSocket();
      }

      try {
        this.socket = io(this.WS_URL, {
          withCredentials: true,
          // Permite fallback; en ciertos hosts primero hace polling
          transports: ['websocket', 'polling'],
          reconnection: false, // hacemos reconexión manual para control fino
          timeout: 10000,
        });

        // Estados básicos
        this.emitLocal('socket_reconnecting', { attempt: this.reconnectAttempts });

        this.socket.on('connect', () => {
          this.log('✅ Socket.IO conectado');
          this.reconnectAttempts = 0;
          this.emitLocal('socket_connected');
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          this.log('🔌 Socket desconectado', { reason });
          this.emitLocal('socket_disconnected', { reason });
          this.scheduleReconnect();
        });

        this.socket.on('connect_error', (error) => {
          this.log('❌ Error de conexión', { error });
          this.emitLocal('socket_error', { message: error.message });
          this.cleanupSocket(false);
          this.scheduleReconnect();
          // Rechazamos la primera conexión; posteriores serán gestionadas por reconexión
          reject(error);
        });

        // Reenvío de eventos del servidor
        this.socket.onAny((event, data) => {
          const message: WebSocketMessage = {
            type: event as WebSocketMessage['type'],
            data,
            auctionId: data?.auctionId,
            timestamp: new Date(),
          };
          this.handleMessage(message);
        });

        // Latido (mantener viva la conexión)
        const pingInterval = setInterval(() => {
          if (this.socket?.connected) this.socket.emit('ping');
        }, 20000);
        this.reconnectTimers.add(pingInterval);

        // Reintento al volver al foreground (útil en móviles/ pestañas inactivas)
        const onVisibility = () => {
          if (document.visibilityState === 'visible' && !this.socket?.connected) {
            this.scheduleReconnect(true);
          }
        };
        document.addEventListener('visibilitychange', onVisibility);
        // Guardamos para limpiar
        const clearVisibility = () => document.removeEventListener('visibilitychange', onVisibility);
        this.reconnectTimers.add(setTimeout(() => {}, 0)); // ancla para mantener el set

        // Nota: no limpiamos aquí; cleanupSocket se encarga
      } catch (error) {
        this.log('❌ Error al crear conexión', { error });
        reject(error);
      }
    });
  }

  // === Mensajería ===
  private handleMessage(message: WebSocketMessage) {
    // listeners por tipo
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach((callback) => callback(message.data));
    }
    // listeners globales
    const globalListeners = this.listeners.get('*');
    if (globalListeners) {
      globalListeners.forEach((callback) => callback(message));
    }
  }

  private emitLocal(type: WebSocketMessage['type'], data: any = {}) {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: new Date(),
    };
    this.handleMessage(message);
  }

  private scheduleReconnect(immediate = false) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.log('⛔ Límite de reconexiones alcanzado');
      return;
    }
    this.reconnectAttempts += 1;

    // backoff exponencial con jitter
    const base = Math.min(30000, 1000 * 2 ** (this.reconnectAttempts - 1));
    const jitter = Math.floor(Math.random() * 800);
    const delay = immediate ? 0 : base + jitter;

    this.log('⏳ Reintentando conexión', { attempt: this.reconnectAttempts, delay });

    const t = setTimeout(() => {
      this.connect().catch(() => {
        // el siguiente scheduleReconnect lo disparará connect_error/disconnect
      });
    }, delay);
    this.reconnectTimers.add(t);
    this.emitLocal('socket_reconnecting', {
      attempt: this.reconnectAttempts,
      inMs: delay,
    });
  }

  private log(message: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify({ message, ...metadata }));
    } else {
      console.log(message, metadata);
    }
  }

  on(eventType: string, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
    return () => {
      this.off(eventType, callback);
    };
  }

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

  send(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
      return true;
    }
    this.log('⚠️ Socket no está conectado, no se puede enviar', { event });
    return false;
  }

  // API específica de subastas
  joinAuction(auctionId: string) {
    return this.send('join_auction', { auctionId });
  }

  leaveAuction(auctionId: string) {
    return this.send('leave_auction', { auctionId });
  }

  placeBid(auctionId: string, amount: number) {
    // El backend deduce el usuario desde la cookie HttpOnly (auth_token)
    return this.send('bid_placed', { auctionId, amount });
  }

  disconnect() {
    this.cleanupSocket();
  }

  private cleanupSocket(cleanTimers = true) {
    if (this.socket) {
      try {
        this.socket.offAny();
        this.socket.removeAllListeners();
        this.socket.disconnect();
      } catch {}
      this.socket = null;
    }
    if (cleanTimers) {
      this.reconnectTimers.forEach((timer) => clearTimeout(timer as any));
      this.reconnectTimers.clear();
    }
  }

  // Estado público correcto
  get isConnected(): boolean {
    return !!this.socket?.connected;
  }

  get connectionState(): ConnectionState {
    if (this.socket?.connected) return 'connected';
    if (this.socket) return 'connecting';
    return 'disconnected';
  }
}

// === SINGLETON ===
export const wsService = new WebSocketService();

// === HOOKS ===

// Helper para callbacks estables
function useEventCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  }, [fn]);
  return useCallback((...args: Parameters<T>) => ref.current(...args), []) as T;
}

// Hook para escuchar eventos (del servidor o locales)
export function useWebSocket<T = any>(eventType: WebSocketMessage['type'] | '*', callback: (data: T) => void) {
  const stableCallback = useEventCallback(callback);
  useEffect(() => {
    const unsubscribe = wsService.on(eventType, stableCallback);
    return unsubscribe;
  }, [eventType, stableCallback]);
}

// Hook para conectar automáticamente y reflejar estado en UI
export function useWebSocketConnection() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const setState = (s: ConnectionState) => {
      if (mounted) setConnectionState(s);
    };

    const onConnected = () => setState('connected');
    const onDisconnected = () => setState('disconnected');
    const onError = (e: any) => {
      setError(typeof e?.message === 'string' ? e.message : 'Socket error');
      setState('disconnected');
    };
    const onReconnecting = () => setState('connecting');

    // Conectar
    wsService.connect().catch((err) => onError(err));

    // Suscribir a eventos locales
    const u1 = wsService.on('socket_connected', onConnected);
    const u2 = wsService.on('socket_disconnected', onDisconnected);
    const u3 = wsService.on('socket_error', onError);
    const u4 = wsService.on('socket_reconnecting', onReconnecting);

    // Estado inicial
    setState(wsService.connectionState);

    return () => {
      mounted = false;
      u1(); u2(); u3(); u4();
    };
  }, []);

  return { connectionState, error, isConnected: connectionState === 'connected' };
}

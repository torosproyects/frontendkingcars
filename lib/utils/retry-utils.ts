/**
 * Utilidades para manejo de reintentos y timeouts
 */

export interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  timeoutMs: number;
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000, // 1 segundo
  maxDelay: 10000, // 10 segundos máximo
  backoffMultiplier: 2,
  timeoutMs: 10000 // 10 segundos
};

/**
 * Calcula el delay para el siguiente reintento usando backoff exponencial
 */
export function calculateRetryDelay(attempt: number, options: RetryOptions): number {
  const delay = options.baseDelay * Math.pow(options.backoffMultiplier, attempt - 1);
  return Math.min(delay, options.maxDelay);
}

/**
 * Crea un AbortController con timeout
 */
export function createTimeoutController(timeoutMs: number): AbortController {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  // Limpiar timeout cuando se aborta
  controller.signal.addEventListener('abort', () => {
    clearTimeout(timeoutId);
  });
  
  return controller;
}

/**
 * Verifica si un error es de tipo red/conectividad
 */
export function isNetworkError(error: any): boolean {
  if (error instanceof TypeError) {
    return true; // Error de red
  }
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('network') || 
           message.includes('fetch') || 
           message.includes('connection') ||
           message.includes('timeout') ||
           message.includes('aborted');
  }
  
  return false;
}

/**
 * Verifica si un error es de timeout
 */
export function isTimeoutError(error: any): boolean {
  if (error instanceof Error) {
    return error.name === 'AbortError' || 
           error.message.toLowerCase().includes('timeout');
  }
  return false;
}

/**
 * Función de delay con Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Ejecuta una función con reintentos y backoff exponencial
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Si es el último intento, lanzar el error
      if (attempt === config.maxRetries) {
        throw lastError;
      }
      
      // Si no es un error de red, no reintentar
      if (!isNetworkError(error)) {
        throw lastError;
      }
      
      // Calcular delay para el siguiente intento
      const retryDelay = calculateRetryDelay(attempt, config);
      await delay(retryDelay);
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

/**
 * Crea un fetch con timeout y reintentos
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: Partial<RetryOptions> = {}
): Promise<Response> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
  
  return withRetry(async () => {
    const controller = createTimeoutController(config.timeoutMs);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      // Si es timeout, lanzar error específico
      if (isTimeoutError(error)) {
        throw new Error(`Request timeout after ${config.timeoutMs}ms`);
      }
      throw error;
    }
  }, retryOptions);
}

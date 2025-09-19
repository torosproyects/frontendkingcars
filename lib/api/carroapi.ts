import { Carro } from "@/types/carro";

// URL base del backend
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Función para pausar entre reintentos
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Timeout: si la promesa no responde en X ms, falla
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: La petición excedió ${ms}ms`)), ms)
    ),
  ]);
}

// Función genérica con reintentos y timeout
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  maxRetries = 2,
  timeoutMs = 10_000 // 10 segundos por defecto
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Intento ${attempt} a ${url}`);

      // Envolver el fetch en un timeout
      const response = await withTimeout(fetch(url, options), timeoutMs);

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      // Leer como texto para manejar respuestas vacías
      const text = await response.text();

      // Si no hay contenido, devolvemos undefined (válido para 204, etc.)
      if (!text) {
        return undefined as unknown as T;
      }

      // Parsear JSON de forma segura
      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error(`Error al parsear JSON de ${url}:`, text);
        throw new Error("La respuesta no es un JSON válido");
      }

      return data as T;
    } catch (error: any) {
      lastError = error;

      // Si fue un timeout, no reintentamos (probablemente red caída)
      if (error.message.includes("Timeout")) {
        console.error("Falló por timeout, no se reintentará:", error.message);
        throw error;
      }

      // Reintentar si quedan intentos
      if (attempt < maxRetries) {
        const backoff = attempt * 1000; // Backoff exponencial: 1s, 2s...
        console.warn(`Intento ${attempt} fallido. Reintentando en ${backoff}ms...`, error);
        await delay(backoff);
      } else {
        console.error(`Todos los intentos fallaron para ${url}`, error);
      }
    }
  }

  // Si todos los reintentos fallaron
  throw lastError || new Error("Falló la petición después de todos los intentos");
}

export async function getPendingCars(): Promise<Carro[]> {
  return fetchWithRetry<Carro[]>(`${API_BASE_URL}/cars/pending`, {
    credentials: "include",
  });
}

export async function getCarById(id: string): Promise<Carro> {
  return fetchWithRetry<Carro>(`${API_URL}/cars/${id}`, {
    credentials: "include",
  });
}

export async function approveCar(id: string): Promise<void> {
  await fetchWithRetry<void>(`${API_BASE_URL}/cars/${id}/approve`, {
    method: "POST",
    credentials: "include",
  });
}

export async function rejectCar(id: string): Promise<void> {
  await fetchWithRetry<void>(`${API_BASE_URL}/cars/${id}/reject`, {
    method: "POST",
    credentials: "include",
  });
}
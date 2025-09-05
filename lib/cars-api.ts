import { BackendCar } from "@/types/carro";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
// Función para hacer petición al backend con reintentos
function delay(ms: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), ms);
  });
}
export async function getAllCars(): Promise<BackendCar[]> {
 
const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
     
      const response = await fetch(`${API_URL}/api/cars`);
      
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const backendCars: BackendCar[] = await response.json();
        
      return backendCars;
    } catch (error) {
      lastError = error as Error;
      console.error(`Intento ${attempt} falló:`, error);
      
      if (attempt < maxRetries) {
        console.log(`Reintentando en ${attempt * 1000}ms...`);
        await delay(attempt * 1000); // Backoff exponencial
      }
       throw lastError || new Error('Failed to fetch cars after all attempts');
    }
  }
    throw lastError || new Error('Failed to fetch cars after all attempts');
}

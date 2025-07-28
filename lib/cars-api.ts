import { BackendCar } from "@/types/carro";

// Función para hacer petición al backend con reintentos
function delay(ms: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), ms);
  });
}
export async function getAllCars(): Promise<BackendCar[]> {
 
const maxRetries = 2;
  let lastError: Error | null = null;
 console.log("se llama.............................................. ");
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Intento ${attempt} de obtener todos los carros del backend...`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cars`);
      
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const backendCars: BackendCar[] = await response.json();
          
      console.log('✅ Carros obtenidos y transformados exitosamente');
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

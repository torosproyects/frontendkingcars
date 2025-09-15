// Servicio para consultar información de códigos postales
// API: https://api.zipcodestack.com/v1/search

export interface PostalCodeResult {
  postal_code: string;
  country_code: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string;
  state_code: string;
  province?: string;
  province_code?: string;
}

export interface PostalCodeResponse {
  query: {
    codes: string[];
    country: string;
  };
  results: {
    [postalCode: string]: PostalCodeResult[];
  };
}

// Patrones de validación de códigos postales por país
export const postalCodePatterns: Record<string, RegExp> = {
  'ES': /^\d{5}$/, // España: 5 dígitos
  'FR': /^\d{5}$/, // Francia: 5 dígitos
  'DE': /^\d{5}$/, // Alemania: 5 dígitos
  'IT': /^\d{5}$/, // Italia: 5 dígitos
  'PT': /^\d{4}-\d{3}$/, // Portugal: 4-3 dígitos
  'NL': /^\d{4}\s?[A-Z]{2}$/, // Países Bajos: 4 dígitos + 2 letras
  'BE': /^\d{4}$/, // Bélgica: 4 dígitos
  'AT': /^\d{4}$/, // Austria: 4 dígitos
  'CH': /^\d{4}$/, // Suiza: 4 dígitos
  'IE': /^[A-Z]\d{2}\s?[A-Z0-9]{4}$/, // Irlanda: formato especial
  'DK': /^\d{4}$/, // Dinamarca: 4 dígitos
  'SE': /^\d{3}\s?\d{2}$/, // Suecia: 3-2 dígitos
  'NO': /^\d{4}$/, // Noruega: 4 dígitos
  'FI': /^\d{5}$/, // Finlandia: 5 dígitos
  'PL': /^\d{2}-\d{3}$/, // Polonia: 2-3 dígitos
  'CZ': /^\d{3}\s?\d{2}$/, // República Checa: 3-2 dígitos
  'HU': /^\d{4}$/, // Hungría: 4 dígitos
  'RO': /^\d{6}$/, // Rumania: 6 dígitos
  'BG': /^\d{4}$/, // Bulgaria: 4 dígitos
  'GR': /^\d{3}\s?\d{2}$/, // Grecia: 3-2 dígitos
  'HR': /^\d{5}$/, // Croacia: 5 dígitos
  'SI': /^\d{4}$/, // Eslovenia: 4 dígitos
  'SK': /^\d{3}\s?\d{2}$/, // Eslovaquia: 3-2 dígitos
  'LT': /^\d{5}$/, // Lituania: 5 dígitos
  'LV': /^\d{4}$/, // Letonia: 4 dígitos
  'EE': /^\d{5}$/, // Estonia: 5 dígitos
  'LU': /^\d{4}$/, // Luxemburgo: 4 dígitos
  'MT': /^[A-Z]{3}\s?\d{4}$/, // Malta: 3 letras + 4 dígitos
  'CY': /^\d{4}$/ // Chipre: 4 dígitos
};

// Lista de países europeos soportados
export const europeanCountries = [
  { code: 'ES', name: 'España' },
  { code: 'FR', name: 'Francia' },
  { code: 'DE', name: 'Alemania' },
  { code: 'IT', name: 'Italia' },
  { code: 'PT', name: 'Portugal' },
  { code: 'NL', name: 'Países Bajos' },
  { code: 'BE', name: 'Bélgica' },
  { code: 'AT', name: 'Austria' },
  { code: 'CH', name: 'Suiza' },
  { code: 'IE', name: 'Irlanda' },
  { code: 'DK', name: 'Dinamarca' },
  { code: 'SE', name: 'Suecia' },
  { code: 'NO', name: 'Noruega' },
  { code: 'FI', name: 'Finlandia' },
  { code: 'PL', name: 'Polonia' },
  { code: 'CZ', name: 'República Checa' },
  { code: 'HU', name: 'Hungría' },
  { code: 'RO', name: 'Rumania' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'GR', name: 'Grecia' },
  { code: 'HR', name: 'Croacia' },
  { code: 'SI', name: 'Eslovenia' },
  { code: 'SK', name: 'Eslovaquia' },
  { code: 'LT', name: 'Lituania' },
  { code: 'LV', name: 'Letonia' },
  { code: 'EE', name: 'Estonia' },
  { code: 'LU', name: 'Luxemburgo' },
  { code: 'MT', name: 'Malta' },
  { code: 'CY', name: 'Chipre' }
];

// Validar código postal según el país
export const validatePostalCode = (postalCode: string, countryCode: string): boolean => {
  const pattern = postalCodePatterns[countryCode];
  return pattern ? pattern.test(postalCode) : false;
};

// Verificar si se debe hacer la llamada a la API
export const shouldCallPostalAPI = (postalCode: string, countryCode: string): boolean => {
  return !!(
    countryCode && 
    postalCode.length >= 4 && 
    validatePostalCode(postalCode, countryCode)
  );
};

// Llamada a la API de códigos postales
export const getPostalCodeData = async (
  postalCode: string, 
  countryCode: string
): Promise<PostalCodeResponse | null> => {
  try {
    console.log('🔍 [Postal API] Iniciando llamada:', { postalCode, countryCode });
    
    // Verificar que se cumplan las condiciones antes de hacer la llamada
    if (!shouldCallPostalAPI(postalCode, countryCode)) {
      console.log('❌ [Postal API] No se cumplen las condiciones para llamar a la API');
      return null;
    }

    const apiKey = 'zip_live_hM314Js2cNSykckMALpQcQNyRnojU13v6r79BSF6';
    const url = `https://api.zipcodestack.com/v1/search?apikey=${apiKey}&codes=${postalCode}&country=${countryCode}`;
    
    console.log('🌐 [Postal API] URL de la llamada:', url);
    console.log('📡 [Postal API] Realizando fetch...');
    
    const response = await fetch(url);
    
    console.log('📊 [Postal API] Respuesta recibida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [Postal API] Error en la respuesta:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
    }
    
    const data: PostalCodeResponse = await response.json();
    console.log('✅ [Postal API] Datos recibidos:', data);
    
    // Verificar que la respuesta tenga resultados
    if (!data.results || Object.keys(data.results).length === 0) {
      console.log('⚠️ [Postal API] No se encontraron resultados para el código postal');
      throw new Error('No results found for this postal code');
    }
    
    const postalCodes = Object.keys(data.results);
    console.log('🎯 [Postal API] Códigos postales encontrados:', postalCodes);
    console.log('📊 [Postal API] Total de resultados:', postalCodes.reduce((total, code) => total + data.results[code].length, 0));
    return data;
  } catch (error) {
    console.error('💥 [Postal API] Error completo:', error);
    return null;
  }
};

// Procesar respuesta de la API y extraer datos útiles
export const processPostalCodeResponse = (data: PostalCodeResponse): {
  city: string;
  state: string;
  coordinates?: { lat: number; lng: number };
} | null => {
  console.log('🔍 [Postal Service] Procesando respuesta:', data);
  
  if (!data.results) {
    console.log('⚠️ [Postal Service] No hay results en la respuesta');
    return null;
  }

  // La API devuelve results como un objeto con claves de código postal
  // Necesitamos extraer el primer resultado del primer código postal
  const postalCodes = Object.keys(data.results);
  console.log('📮 [Postal Service] Códigos postales encontrados:', postalCodes);
  
  if (postalCodes.length === 0) {
    console.log('⚠️ [Postal Service] No hay códigos postales en results');
    return null;
  }

  const firstPostalCode = postalCodes[0];
  const resultsForPostalCode = (data.results as any)[firstPostalCode];
  console.log('🎯 [Postal Service] Resultados para código postal', firstPostalCode, ':', resultsForPostalCode);
  
  if (!resultsForPostalCode || resultsForPostalCode.length === 0) {
    console.log('⚠️ [Postal Service] No hay resultados para el código postal');
    return null;
  }

  const result = resultsForPostalCode[0];
  console.log('✅ [Postal Service] Primer resultado:', result);
  
  const processedData = {
    city: result.city || '',
    // Priorizar provincia si viene, sino usar state
    state: result.province || result.state || '',
    coordinates: result.latitude && result.longitude ? {
      lat: parseFloat(result.latitude),
      lng: parseFloat(result.longitude)
    } : undefined
  };
  
  console.log('🎉 [Postal Service] Datos procesados:', processedData);
  return processedData;
};

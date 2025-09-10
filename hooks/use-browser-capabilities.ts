import { useState, useEffect, useCallback } from 'react';

interface BrowserCapabilities {
  hasMediaDevices: boolean;
  hasGetUserMedia: boolean;
  isSecureContext: boolean;
  isHTTPS: boolean;
  isLocalhost: boolean;
  userAgent: string;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isSafari: boolean;
  isEdge: boolean;
  supportsCanvas: boolean;
  supportsFileAPI: boolean;
  supportsWebGL: boolean;
  cameraSupported: boolean;
  recommendedBrowser: boolean;
}

export const useBrowserCapabilities = () => {
  const [capabilities, setCapabilities] = useState<BrowserCapabilities | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const detectCapabilities = useCallback((): BrowserCapabilities => {
    const userAgent = navigator.userAgent;
    
    return {
      hasMediaDevices: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      hasGetUserMedia: !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia),
      isSecureContext: window.isSecureContext,
      isHTTPS: location.protocol === 'https:',
      isLocalhost: location.hostname === 'localhost' || location.hostname === '127.0.0.1',
      userAgent,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
      isIOS: /iPad|iPhone|iPod/.test(userAgent),
      isAndroid: /Android/.test(userAgent),
      isChrome: /Chrome/.test(userAgent) && !/Edge/.test(userAgent),
      isFirefox: /Firefox/.test(userAgent),
      isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
      isEdge: /Edge/.test(userAgent),
      supportsCanvas: !!document.createElement('canvas').getContext,
      supportsFileAPI: !!(window.File && window.FileReader && window.FileList && window.Blob),
      supportsWebGL: (() => {
        try {
          const canvas = document.createElement('canvas');
          return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
          return false;
        }
      })(),
      cameraSupported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || 
                      !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia),
      recommendedBrowser: /Chrome|Firefox|Safari|Edge/.test(userAgent) && 
                         !/MSIE|Trident/.test(userAgent) && 
                         !/Opera Mini/.test(userAgent)
    };
  }, []);

  useEffect(() => {
    const detect = () => {
      try {
        const caps = detectCapabilities();
        setCapabilities(caps);
      } catch (error) {
        console.error('Error detecting browser capabilities:', error);
        // Fallback básico
        setCapabilities({
          hasMediaDevices: false,
          hasGetUserMedia: false,
          isSecureContext: false,
          isHTTPS: false,
          isLocalhost: false,
          userAgent: navigator.userAgent,
          isMobile: false,
          isIOS: false,
          isAndroid: false,
          isChrome: false,
          isFirefox: false,
          isSafari: false,
          isEdge: false,
          supportsCanvas: false,
          supportsFileAPI: false,
          supportsWebGL: false,
          cameraSupported: false,
          recommendedBrowser: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    detect();
  }, [detectCapabilities]);

  const getCompatibilityMessage = useCallback(() => {
    if (!capabilities) return null;

    if (!capabilities.cameraSupported) {
      return {
        type: 'error' as const,
        title: 'Cámara no soportada',
        message: 'Tu navegador no soporta acceso a la cámara. Por favor, actualiza a una versión más reciente.',
        browsers: ['Chrome 53+', 'Firefox 36+', 'Safari 11+', 'Edge 12+']
      };
    }

    if (!capabilities.isSecureContext && !capabilities.isLocalhost) {
      return {
        type: 'warning' as const,
        title: 'Conexión no segura',
        message: 'Se requiere HTTPS para acceder a la cámara. Por favor, usa una conexión segura.',
        browsers: []
      };
    }

    if (!capabilities.recommendedBrowser) {
      return {
        type: 'warning' as const,
        title: 'Navegador no recomendado',
        message: 'Para la mejor experiencia, recomendamos usar Chrome, Firefox, Safari o Edge actualizados.',
        browsers: ['Chrome 53+', 'Firefox 36+', 'Safari 11+', 'Edge 12+']
      };
    }

    return null;
  }, [capabilities]);

  return {
    capabilities,
    isLoading,
    getCompatibilityMessage
  };
};

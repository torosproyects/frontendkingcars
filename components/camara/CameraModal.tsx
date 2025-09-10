
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PhotoTemplate } from '@/types/camara';
import Image from 'next/image';
import { 
  Camera, 
  AlertCircleIcon
} from 'lucide-react';
import { useBrowserCapabilities } from '@/hooks/use-browser-capabilities';

// Extender la interfaz Navigator para incluir getUserMedia legacy
declare global {
  interface Navigator {
    getUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: (stream: MediaStream) => void,
      errorCallback: (error: any) => void
    ) => void;
    webkitGetUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: (stream: MediaStream) => void,
      errorCallback: (error: any) => void
    ) => void;
    mozGetUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: (stream: MediaStream) => void,
      errorCallback: (error: any) => void
    ) => void;
    msGetUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: (stream: MediaStream) => void,
      errorCallback: (error: any) => void
    ) => void;
  }
}


interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  template: PhotoTemplate | null;
}

const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture, template }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  
  // Usar el hook de capacidades del navegador
  const { capabilities, isLoading: capabilitiesLoading, getCompatibilityMessage } = useBrowserCapabilities();

  const handleCameraError = useCallback((err: Error | any, capabilities: any) => {
    // Manejar tanto Error como errores de MediaStream
    const errorName = err.name || (err as any).constraintName;
    const errorMessage = err.message || (err as any).message || 'Error desconocido';
    
    switch (errorName) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        setError("Permiso de cámara denegado. Por favor, habilita el acceso a la cámara en la configuración de tu navegador y recarga la página.");
        break;
      case "NotFoundError":
      case "DevicesNotFoundError":
        setError("No se encontró ninguna cámara. Asegúrate de que una cámara esté conectada y habilitada.");
        break;
      case "NotReadableError":
      case "TrackStartError":
        setError("La cámara está siendo usada por otra aplicación. Cierra otras aplicaciones que puedan estar usando la cámara.");
        break;
      case "OverconstrainedError":
      case "ConstraintNotSatisfiedError":
        setError("La configuración de la cámara no es compatible. Intenta con una resolución diferente.");
        break;
      case "NotSupportedError":
        setError("Tu navegador no soporta esta funcionalidad. Actualiza tu navegador o usa Chrome, Firefox, Safari o Edge.");
        break;
      case "SecurityError":
        if (!capabilities.isSecureContext) {
          setError("Se requiere HTTPS para acceder a la cámara. Por favor, usa una conexión segura.");
        } else {
          setError("Error de seguridad al acceder a la cámara. Verifica los permisos.");
        }
        break;
      case "AbortError":
        setError("La operación de cámara fue cancelada. Intenta nuevamente.");
        break;
      case "TypeError":
        setError("Error de tipo en la configuración de la cámara. Verifica la compatibilidad del navegador.");
        break;
      default:
        setError(`Error al acceder a la cámara: ${errorMessage}`);
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (!capabilities) return;
    
    setError(null);
    setIsCameraReady(false);
    
    // Verificar contexto seguro (HTTPS o localhost)
    if (!capabilities.isSecureContext && !capabilities.isLocalhost) {
      setError("Se requiere HTTPS para acceder a la cámara. Por favor, usa una conexión segura.");
      return;
    }

    // Intentar con la API moderna primero
    if (capabilities.hasMediaDevices) {
      try {
        // Configuración adaptativa según el dispositivo
        const constraints = {
          video: { 
            facingMode: { ideal: "environment" }, // Preferir cámara trasera
            width: { 
              min: 320, 
              ideal: capabilities.isMobile ? 1280 : 1920, 
              max: 4096 
            },
            height: { 
              min: 240, 
              ideal: capabilities.isMobile ? 720 : 1080, 
              max: 2160 
            },
            frameRate: { ideal: 30, max: 60 }
          }
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
             setIsCameraReady(true);
          };
          
          // Manejar errores de carga del video
          videoRef.current.onerror = () => {
            setError("Error al cargar el stream de video. Intenta nuevamente.");
          };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        handleCameraError(err, capabilities);
      }
    } 
    // Fallback para navegadores más antiguos
    else if (capabilities.hasGetUserMedia) {
      try {
        const getUserMedia = navigator.getUserMedia || 
                           navigator.webkitGetUserMedia || 
                           navigator.mozGetUserMedia || 
                           navigator.msGetUserMedia;
        
        if (getUserMedia) {
          // Usar bind para asegurar el contexto correcto
          const boundGetUserMedia = getUserMedia.bind(navigator);
          boundGetUserMedia(
            { video: true }, 
            (mediaStream: MediaStream) => {
              setStream(mediaStream);
              if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = () => {
                  setIsCameraReady(true);
                };
              }
            },
            (err: any) => {
              handleCameraError(err, capabilities);
            }
          );
        } else {
          setError("No se pudo acceder a la API de cámara. Tu navegador podría no soportar esta funcionalidad.");
        }
      } catch (err) {
        handleCameraError(err as Error, capabilities);
      }
    } else {
      setError("Tu navegador no soporta acceso a la cámara. Por favor, actualiza a una versión más reciente o usa Chrome, Firefox, Safari o Edge.");
    }
  }, [capabilities, handleCameraError]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraReady(false);
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // startCamera and stopCamera are memoized

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // stopCamera is memoized

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isCameraReady) {
      setError("La cámara no está lista o no se pudo acceder al lienzo de captura.");
      return;
    }

      const video = videoRef.current;
      const canvas = canvasRef.current;
    
    // Verificar que el video tenga dimensiones válidas
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError("El video no está completamente cargado. Espera un momento e intenta nuevamente.");
      return;
    }

    try {
      // Set canvas dimensions to video's actual dimensions to maintain aspect ratio
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (!context) {
        setError("No se pudo obtener el contexto del canvas. Tu navegador podría no soportar esta funcionalidad.");
        return;
      }

      // Detectar si es cámara frontal para aplicar efecto espejo
      const videoTrack = stream?.getVideoTracks()[0];
      const settings = videoTrack?.getSettings();
      const isFrontCamera = settings?.facingMode === 'user' || 
                           settings?.facingMode === 'front' ||
                           (settings?.facingMode === undefined && videoTrack?.getCapabilities().facingMode?.includes('user'));

      // Aplicar transformaciones si es necesario
      if (isFrontCamera) {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }

      // Dibujar la imagen en el canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convertir a data URL con calidad optimizada
      const quality = 0.85; // Balance entre calidad y tamaño
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      
      // Verificar que la imagen se generó correctamente
      if (dataUrl === 'data:,') {
        setError("Error al generar la imagen. Intenta nuevamente.");
        return;
      }

      // Verificar tamaño de la imagen (máximo 10MB)
      const sizeInBytes = (dataUrl.length * 3) / 4;
      if (sizeInBytes > 10 * 1024 * 1024) {
        setError("La imagen es demasiado grande. Intenta con una resolución menor.");
        return;
      }

      onCapture(dataUrl);
      onClose();
    } catch (error) {
      console.error("Error during capture:", error);
      setError("Error al capturar la imagen. Intenta nuevamente.");
    }
  }, [isCameraReady, stream, onCapture, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">{template?.label || 'Capturar Foto'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <p className="text-sm text-gray-600 mb-4">{template?.description}</p>

        {/* Mostrar información de compatibilidad */}
        {capabilities && !capabilitiesLoading && (
          (() => {
            const compatibilityMessage = getCompatibilityMessage();
            if (!compatibilityMessage) return null;
            
            const isError = compatibilityMessage.type === 'error';
            const isWarning = compatibilityMessage.type === 'warning';
            
            return (
              <div className={`mb-4 p-3 rounded-md flex items-start ${
                isError 
                  ? 'bg-red-100 border border-red-400 text-red-700' 
                  : 'bg-yellow-100 border border-yellow-400 text-yellow-700'
              }`}>
                <AlertCircleIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"/>
                <div className="flex-1">
                  <span className="block font-medium">{compatibilityMessage.title}</span>
                  <span className="block text-sm mt-1">{compatibilityMessage.message}</span>
                  {compatibilityMessage.browsers.length > 0 && (
                    <div className="mt-2 text-sm">
                      <p className="font-medium">Navegadores compatibles:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {compatibilityMessage.browsers.map((browser, index) => (
                          <li key={index}>{browser}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        )}

        {/* Mostrar errores de cámara */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-start">
            <AlertCircleIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"/>
            <div className="flex-1">
              <span className="block">{error}</span>
            </div>
          </div>
        )}

        <div className="relative w-full aspect-video bg-gray-900 rounded-md overflow-hidden mb-4 border border-gray-300">
  <video 
    ref={videoRef} 
    autoPlay 
    playsInline 
    className={`w-full h-full object-cover ${isCameraReady ? 'block' : 'hidden'}`}
  ></video>
          
        {isCameraReady && template?.guidanceImage && (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative" style={{ 
        width: 'min(90vw, 90%)', 
        height: 'min(90vh, 90%)',
        aspectRatio: 'auto'
      }}>
        <Image
          src={template.guidanceImage}
          alt={`${template.label} guidance`}
          className="opacity-40 pointer-events-none object-contain w-full h-full"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  )}

          {!isCameraReady && !error && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                <p className="mt-3 text-lg">Iniciando cámara...</p>
            </div>
          )}
           {!isCameraReady && error && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4">
                <AlertCircleIcon className="w-16 h-16 mb-2"/>
                <p className="mt-1 text-lg text-center">No se pudo iniciar la cámara.</p>
                <p className="text-sm text-center">Verifica los permisos y la conexión.</p>
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden"></canvas>
        
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
           <button
            onClick={startCamera}
            disabled={!error && isCameraReady}
            className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Reintentar Cámara
          </button>
          <button
            onClick={handleCapture}
            disabled={!isCameraReady || !!error}
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Camera className="w-5 h-5 mr-2" />
            Tomar Foto
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;

/*
// hooks/useInactivityTimer.ts
import { useEffect, useState } from 'react';

export const useInactivityTimer = (logoutCallback: () => void, timeoutMinutes: number = 5) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [warningTimeoutId, setWarningTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const warningTime = 1 * 60 * 1000; // 1 minuto de advertencia
  const logoutTime = timeoutMinutes * 60 * 1000;

  const resetTimer = () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (warningTimeoutId) clearTimeout(warningTimeoutId);
    
    setShowWarning(false);
    
    const newWarningTimeout = setTimeout(() => {
      setShowWarning(true);
      
      const newLogoutTimeout = setTimeout(() => {
        logoutCallback();
      }, warningTime);
      
      setWarningTimeoutId(newLogoutTimeout);
    }, logoutTime - warningTime);
    
    setTimeoutId(newWarningTimeout);
  };

  const extendSession = () => {
    setShowWarning(false);
    resetTimer();
  };

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    
    const handleActivity = () => resetTimer();

    events.forEach(event => window.addEventListener(event, handleActivity));
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timeoutId) clearTimeout(timeoutId);
      if (warningTimeoutId) clearTimeout(warningTimeoutId);
    };
  }, []);

  return { showWarning, extendSession };
};


/////////////////////////////////////

// components/inactivity-modal.tsx
'use client';

import { useEffect } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';

export function InactivityModal({
  showWarning,
  onExtend,
  onLogout,
}: {
  showWarning: boolean;
  onExtend: () => void;
  onLogout: () => void;
}) {
  return (
    <Dialog open={showWarning} onOpenChange={(open) => !open && onExtend()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sesión inactiva</DialogTitle>
          <DialogDescription>
            Su sesión se cerrará automáticamente en 1 minuto debido a inactividad.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onLogout}>
            Cerrar sesión
          </Button>
          <Button onClick={onExtend}>Permanecer conectado</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
////////
// app/layout.tsx
import { useRouter } from 'next/navigation';
import { useInactivityTimer } from '@/hooks/useInactivityTimer';
import { InactivityModal } from '@/components/inactivity-modal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  
  const handleLogout = () => {
    // Implementa tu lógica de logout aquí
    console.log('Cerrando sesión por inactividad');
    router.push('/login');
  };

  const { showWarning, extendSession } = useInactivityTimer(handleLogout, 5);

  return (
    <html lang="es">
      <body>*/
//        {/* Todos tus providers y wrappers existentes */
/*        <YourProviders>
          <YourOtherWrappers>
            {children}
          </YourOtherWrappers>
        </YourProviders>
        
        {/* El modal de inactividad (fuera de cualquier wrapper) */
/*        <InactivityModal 
          showWarning={showWarning}
          onExtend={extendSession}
          onLogout={handleLogout}
        />
      </body>
    </html>
  );
}
*/

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PhotoTemplate } from '@/types/camara';
import Image from 'next/image';
import { 
  Camera, 
  AlertCircleIcon
} from 'lucide-react';


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

  const startCamera = useCallback(async () => {
    setError(null);
    setIsCameraReady(false);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "environment", // Usa la cámara trasera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
             setIsCameraReady(true);
          }
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (err instanceof Error) {
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                 setError("Permiso de cámara denegado. Por favor, habilita el acceso a la cámara en la configuración de tu navegador.");
            } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError"){
                 setError("No se encontró ninguna cámara. Asegúrate de que una cámara esté conectada y habilitada.");
            } else {
                 setError(`Error al acceder a la cámara: ${err.message}`);
            }
        } else {
            setError("Ocurrió un error desconocido al acceder a la cámara.");
        }
      }
    } else {
      setError("La API de MediaDevices no es compatible con este navegador.");
    }
  }, []);

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

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      // Set canvas dimensions to video's actual dimensions to maintain aspect ratio
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Flip horizontally for a mirror effect if using front camera
        if(stream?.getVideoTracks()[0]?.getSettings().facingMode === 'user'){
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9); // Use JPEG for smaller size, adjust quality
        onCapture(dataUrl);
        onClose();
      }
    } else {
        setError("La cámara no está lista o no se pudo acceder al lienzo de captura.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">{template?.label || 'Capturar Foto'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <p className="text-sm text-gray-600 mb-4">{template?.description}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
            <AlertCircleIcon className="w-5 h-5 mr-2"/>
            <span>{error}</span>
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
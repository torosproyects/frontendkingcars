'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuctionStore } from '@/lib/store/auctions-store';

interface AuctionCountdownProps {
  endTime: Date;
  auctionId: string;
  onTimeUp?: () => void;
  className?: string;
}

export function AuctionCountdown({ endTime, auctionId, onTimeUp, className }: AuctionCountdownProps) {
  const { updateAuctionStatus, addNotification } = useAuctionStore();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const handleTimeUp = useCallback(() => {
    // Actualizar estado de la subasta
    updateAuctionStatus(auctionId, 'ended');
    
    // Agregar notificación
    addNotification({
      type: 'auction_ended',
      title: 'Subasta finalizada',
      message: 'La subasta ha terminado',
      auctionId,
      priority: 'medium'
    });
    
    onTimeUp?.();
  }, [auctionId, updateAuctionStatus, addNotification, onTimeUp]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(endTime).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        handleTimeUp();
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, handleTimeUp]);

  const isUrgent = !timeLeft.isExpired && 
    timeLeft.days === 0 && 
    timeLeft.hours === 0 && 
    timeLeft.minutes < 30;

  // Notificar cuando quedan 5 minutos
  useEffect(() => {
    if (!timeLeft.isExpired && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 5 && timeLeft.seconds === 0) {
      addNotification({
        type: 'auction_ending',
        title: '¡Solo 5 minutos!',
        message: 'La subasta termina en 5 minutos',
        auctionId,
        priority: 'medium'
      });
    }
  }, [timeLeft, auctionId, addNotification]);

  if (timeLeft.isExpired) {
    return (
      <Card className={cn("border-red-200 bg-red-50/50", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">Subasta Finalizada</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "transition-all duration-300",
      isUrgent 
        ? "border-red-200 bg-gradient-to-r from-red-50 to-orange-50 shadow-md animate-pulse" 
        : "border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50",
      className
    )}>
      <CardContent className="p-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Clock className={cn(
              "h-5 w-5",
              isUrgent ? "text-red-500" : "text-blue-500"
            )} />
            <span className="font-semibold text-gray-700">
              {isUrgent ? "¡Últimos minutos!" : "Tiempo restante"}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Días', value: timeLeft.days },
              { label: 'Horas', value: timeLeft.hours },
              { label: 'Min', value: timeLeft.minutes },
              { label: 'Seg', value: timeLeft.seconds },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={cn(
                  "text-2xl font-bold tabular-nums transition-colors duration-200",
                  isUrgent ? "text-red-600" : "text-blue-600"
                )}>
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {isUrgent && (
            <div className="mt-3 text-sm font-medium text-red-600 animate-pulse">
              ¡Apúrate antes de que termine!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface CountdownTimerProps {
  duration: number; // in seconds
  onComplete: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      <span>Reenviar en {formatTime(timeLeft)}</span>
    </div>
  );
};

export default CountdownTimer;
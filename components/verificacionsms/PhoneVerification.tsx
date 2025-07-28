'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RotateCcw, CheckCircle, X } from 'lucide-react';
import CountdownTimer from '@/components/verificacionsms/CountdownTimer';

interface PhoneVerificationProps {
  phone: string;
  onVerified: () => void;
  onPhoneChange: () => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ 
  phone, 
  onVerified,
  onPhoneChange
}) => {
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [canResend, setCanResend] = useState(false);

  const sendVerificationCode = async () => {
    setIsLoading(true);
    try {
     
       
       await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verification/send-code`, {
         method: 'POST',
         body: JSON.stringify({ phone }),
         headers: {
          'Content-Type': 'application/json',
          },
         credentials: 'include',
         
       });
      
      setVerificationSent(true);
      setRemainingAttempts(5);
      setCanResend(false);
      toast({
        title: "Código enviado",
        description: `Se ha enviado un código a ${phone}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el código. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    setIsResending(true);
    try {
      await sendVerificationCode();
    } finally {
      setIsResending(false);
    }
  };

  const verifyCode = async () => {
    if (!code || code.length < 4) {
      toast({
        title: "Código inválido",
        description: "Ingresa un código válido",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      
       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verification/verify-code`, {
         method: 'POST',
         body: JSON.stringify({ phone, code }),
         headers: { 'Content-Type': 'application/json' }
       });
      
      // Simular éxito (en producción verificar response.ok)
      if(response)
      toast({
        title: "Verificación exitosa",
        description: "Tu número de teléfono ha sido verificado"
      });
      onVerified();
    } catch (error) {
      setRemainingAttempts(prev => prev - 1);
      setVerificationStatus('error');
      
      if (remainingAttempts <= 1) {
        toast({
          title: "Límite de intentos alcanzado",
          description: "Has excedido el número máximo de intentos",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Verificación fallida",
          description: `Te quedan ${remainingAttempts - 1} intentos`,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!verificationSent ? (
        <div className="space-y-2">
          <Label>Número de teléfono</Label>
          <div className="flex gap-2">
            <Input value={phone} disabled />
            <Button 
              onClick={sendVerificationCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Verificar número"
              )}
            </Button>
          </div>
        </div>
      ) : verificationStatus === 'success' ? (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          <span>Número verificado</span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Código de verificación</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ingresa el código de 6 dígitos"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />
              <Button 
                onClick={verifyCode}
                disabled={isLoading || remainingAttempts <= 0}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Verificar"
                )}
              </Button>
            </div>
            {remainingAttempts < 5 && (
              <p className="text-sm text-muted-foreground">
                Intentos restantes: {remainingAttempts}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={resendCode}
              disabled={!canResend || isResending}
              size="sm"
            >
              {isResending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reenviar código
                </>
              )}
            </Button>

            {!canResend && (
              <CountdownTimer 
                duration={60} 
                onComplete={() => setCanResend(true)} 
              />
            )}

            <Button
              variant="link"
              onClick={() => {
                setVerificationSent(false);
                onPhoneChange();
              }}
              size="sm"
            >
              <X className="h-4 w-4 mr-2" />
              Cambiar número
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneVerification;
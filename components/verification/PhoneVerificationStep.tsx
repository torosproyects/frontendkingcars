'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  RotateCcw, 
  X,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CountdownTimer from '@/components/verificacionsms/CountdownTimer';
import { ValidationLabel } from './ValidationLabel';

interface PhoneVerificationStepProps {
  phone: string;
  onPhoneChange: (phone: string) => void;
  onVerified: () => void;
  isVerified: boolean;
}

type VerificationState = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'error';

export function PhoneVerificationStep({ 
  phone, 
  onPhoneChange, 
  onVerified, 
  isVerified 
}: PhoneVerificationStepProps) {
  const { toast } = useToast();
  const [verificationState, setVerificationState] = useState<VerificationState>('idle');
  const [code, setCode] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [canResend, setCanResend] = useState(false);

  const sendVerificationCode = async () => {
    if (!phone || phone.length < 9) {
      toast({
        title: "Número inválido",
        description: "Ingresa un número de teléfono válido",
        variant: "destructive"
      });
      return;
    }

    setVerificationState('sending');
    
    // Por ahora, simular envío exitoso sin llamar al backend
    setTimeout(() => {
      setVerificationState('sent');
      setRemainingAttempts(5);
      setCanResend(false);
      toast({
        title: "Código enviado",
        description: `Se ha enviado un código SMS a ${phone}`
      });
    }, 1000);
  };

  const resendCode = async () => {
    setCanResend(false);
    await sendVerificationCode();
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

    setVerificationState('verifying');
    
    // Por ahora, simular verificación exitosa sin validar el código
    setTimeout(() => {
      setVerificationState('verified');
      toast({
        title: "Verificación exitosa",
        description: "Tu número de teléfono ha sido verificado"
      });
      onVerified();
    }, 1000);
  };

  const resetVerification = () => {
    setVerificationState('idle');
    setCode('');
    setCanResend(false);
    onPhoneChange('');
  };

  const getStateIcon = () => {
    switch (verificationState) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'sending':
      case 'verifying':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
      default:
        return <Phone className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStateText = () => {
    switch (verificationState) {
      case 'verified':
        return 'Teléfono verificado';
      case 'sending':
        return 'Enviando código...';
      case 'sent':
        return 'Código enviado';
      case 'verifying':
        return 'Verificando código...';
      case 'error':
        return 'Error en verificación';
      default:
        return 'Verificar teléfono';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center px-4">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Verificación de Teléfono</h2>
        <p className="text-sm md:text-base text-gray-600">
          Necesitamos verificar tu número de teléfono para completar el registro
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStateIcon()}
            {getStateText()}
          </CardTitle>
          <CardDescription>
            {verificationState === 'verified' 
              ? 'Tu número de teléfono ha sido verificado exitosamente'
              : 'Ingresa tu número de teléfono para recibir un código de verificación'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {verificationState === 'idle' && (
            <div className="space-y-4">
              <div>
                <ValidationLabel 
                  show={!phone || phone.length < 9} 
                  message="Teléfono requerido" 
                />
                <Label htmlFor="phone">Número de Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+34 123 456 789"
                  value={phone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Formato: +34 seguido del número (ej: +34 612 345 678)
                </p>
              </div>
              
              <Button 
                onClick={sendVerificationCode}
                disabled={!phone || phone.length < 9}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Código de Verificación
              </Button>
            </div>
          )}

          {(verificationState === 'sent' || verificationState === 'verifying' || verificationState === 'error') && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  Código enviado a: <strong>{phone}</strong>
                </p>
              </div>
              
              <div>
                <ValidationLabel 
                  show={!code || code.length < 4} 
                  message="Código requerido" 
                />
                <Label htmlFor="code">Código de Verificación</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="1234"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1 text-center text-lg tracking-widest"
                  maxLength={6}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Ingresa el código de 4-6 dígitos que recibiste por SMS
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={verifyCode}
                  disabled={!code || code.length < 4 || verificationState === 'verifying'}
                  className="flex-1 order-2 sm:order-1"
                >
                  {verificationState === 'verifying' ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Verificar Código
                </Button>
                
                <Button
                  variant="outline"
                  onClick={resendCode}
                  disabled={!canResend}
                  size="sm"
                  className="order-1 sm:order-2"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reenviar
                </Button>
              </div>
              
              {!canResend && verificationState === 'sent' && (
                <div className="text-center">
                  <CountdownTimer 
                    duration={60} 
                    onComplete={() => setCanResend(true)} 
                  />
                </div>
              )}
              
              <Button
                variant="ghost"
                onClick={resetVerification}
                size="sm"
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Cambiar Número
              </Button>
            </div>
          )}

          {verificationState === 'verified' && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-medium">
                ¡Teléfono verificado exitosamente!
              </p>
              <p className="text-sm text-green-700 mt-1">
                Número: {phone}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

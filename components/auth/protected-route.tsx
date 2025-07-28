"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { UserRole, VerificationRequirement } from '@/lib/types/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, ArrowLeft, User, Shield, Crown, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresLogin?: boolean;
  requiresAuth?: boolean;
  requiredRoles?: UserRole[];
  feature?: string;
  fallbackPath?: string;
  showFallback?: boolean;
  customMessage?: string;
}

export function ProtectedRoute({ 
  children, 
  requiresLogin = false,
  requiresAuth = false,
  requiredRoles = [], 
  feature,
  fallbackPath,
  showFallback = true,
  customMessage
}: ProtectedRouteProps) {
  const router = useRouter();
  const { checkAccess, user, getUserStatus, getVerificationProgress } = useAuthStore();

  // Construir requirements basado en props
  const requirements: VerificationRequirement = {
    requiresLogin,
    requiresAuth,
    requiredRoles,
    feature,
  };

  // Verificar acceso
  const accessResult = checkAccess(requirements);

  // Si tiene acceso, mostrar contenido
  if (accessResult.hasAccess) {
    return <>{children}</>;
  }

  // Si no debe mostrar fallback, redirigir
  if (!showFallback && accessResult.actionPath) {
    router.push(fallbackPath || accessResult.actionPath);
    return null;
  }

  // Obtener información del usuario para mostrar contexto
  const userStatus = getUserStatus();
  const progress = getVerificationProgress();

  // Función para obtener el icono según el tipo de restricción
  const getRestrictionIcon = () => {
    switch (accessResult.reason) {
      case 'not_logged':
        return <User className="h-6 w-6 text-blue-600" />;
      case 'not_verified':
        return <Shield className="h-6 w-6 text-orange-600" />;
      case 'insufficient_role':
        return <Crown className="h-6 w-6 text-purple-600" />;
      default:
        return <ShieldAlert className="h-6 w-6 text-destructive" />;
    }
  };

  // Función para obtener el color del badge según el estado
  const getStatusBadge = () => {
    switch (userStatus) {
      case 'visitante':
        return <Badge variant="outline">Visitante</Badge>;
      case 'logueado':
        return <Badge variant="secondary">Cuenta Creada</Badge>;
      case 'verificado':
        return <Badge variant="default">Verificado</Badge>;
      default:
        return null;
    }
  };

  // Función para obtener información adicional según el estado
  const getAdditionalInfo = () => {
    if (userStatus === 'logueado' && accessResult.reason === 'not_verified') {
      return (
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Verificación Pendiente</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-orange-700">
              <span>Progreso de verificación</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-orange-700 mt-2">
            Completa tu verificación para acceder a todas las funcionalidades de la plataforma.
          </p>
        </div>
      );
    }

    if (userStatus === 'verificado' && accessResult.reason === 'insufficient_role') {
      return (
        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Permisos Insuficientes</span>
          </div>
          <p className="text-xs text-purple-700">
            Tu cuenta está verificada pero no tienes los permisos necesarios para esta funcionalidad.
          </p>
          {user?.role && (
            <p className="text-xs text-purple-600 mt-1">
              Rol actual: <span className="font-medium capitalize">{user.role}</span>
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            {getRestrictionIcon()}
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <CardTitle>Acceso Restringido</CardTitle>
            {getStatusBadge()}
          </div>
          <CardDescription>
            {customMessage || accessResult.message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Información adicional según el estado */}
          {getAdditionalInfo()}

          {/* Botones de acción */}
          <div className="space-y-3">
            {accessResult.actionPath && accessResult.actionText && (
              <Button 
                onClick={() => router.push(accessResult.actionPath!)} 
                className="w-full"
              >
                {accessResult.reason === 'not_logged' && <User className="h-4 w-4 mr-2" />}
                {accessResult.reason === 'not_verified' && <Shield className="h-4 w-4 mr-2" />}
                {accessResult.reason === 'insufficient_role' && <Crown className="h-4 w-4 mr-2" />}
                {accessResult.actionText}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => router.back()} 
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>

          {/* Información del usuario actual */}
          {user && (
            <div className="pt-4 border-t">
              <div className="text-center text-sm text-muted-foreground">
                <p>Conectado como: <span className="font-medium">{user.name}</span></p>
                <p className="text-xs">{user.email}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
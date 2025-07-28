"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, Settings, LogOut, Shield, Car, 
  BarChart3, Users, Heart, FileText, 
  Gavel, Plus, Edit, Key, 
  CheckCircle, Clock, ShieldAlert
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type UserStatus = 'logueado' | 'verificado' | 'visitante';

const UserStatusIndicator = ({ status }: { status: UserStatus }) => {
  const statusConfig = {
    logueado: {
      badge: <Badge variant="secondary" className="text-xs">Verificación Pendiente</Badge>,
      icon: <Clock className="h-3 w-3 text-orange-500" />,
      color: 'text-orange-600'
    },
    verificado: {
      badge: <Badge variant="default" className="text-xs">Verificado</Badge>,
      icon: <CheckCircle className="h-3 w-3 text-green-500" />,
      color: 'text-green-600'
    },
    visitante: {
      badge: <Badge variant="outline" className="text-xs">Visitante</Badge>,
      icon: <User className="h-3 w-3 text-gray-500" />,
      color: 'text-gray-600'
    }
  };

  const config = statusConfig[status] || statusConfig.visitante;

  return (
    <div className="flex items-center justify-between">
      {config.badge}
      {config.icon}
    </div>
  );
};

const UserAvatar = ({ 
  user, 
  status 
}: { 
  user: { name: string; avatar?: string }; 
  status: UserStatus 
}) => {
  const getInitials = (name: string) => {
    return `${name.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="relative">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      {status === 'logueado' && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full border-2 border-background" />
      )}
    </div>
  );
};

const UserInfoSection = ({ 
  user, 
  status, 
  progress 
}: { 
  user: { name: string; email: string; avatar?: string; role?: string };
  status: UserStatus;
  progress: number;
}) => (
  <div className="flex flex-col space-y-3">
    <div className="flex items-center space-x-3">
      <Avatar className="h-12 w-12">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm font-medium leading-none truncate">{user.name}</p>
        <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
          {user.email}
        </p>
      </div>
    </div>
    
    <div className="space-y-2">
      <UserStatusIndicator status={status} />
      
      {status === 'logueado' && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progreso de verificación</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      {status === 'verificado' && user.role && (
        <div className="text-xs text-muted-foreground">
          Rol: <span className="font-medium capitalize">{user.role}</span>
        </div>
      )}
    </div>
  </div>
);

const MenuItem = ({ 
  href, 
  icon: Icon, 
  children,
  className,
  onClick 
}: {
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const content = (
    <>
      <Icon className="mr-2 h-4 w-4" />
      <span>{children}</span>
    </>
  );

  return href ? (
    <DropdownMenuItem asChild className={className}>
      <Link href={href} className="w-full">
        {content}
      </Link>
    </DropdownMenuItem>
  ) : (
    <DropdownMenuItem className={className} onClick={onClick}>
      {content}
    </DropdownMenuItem>
  );
};

export function UserMenu() {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    user, 
    logout, 
    getUserStatus, 
    getVerificationProgress,
    isAdmin, 
    isDealer, 
    isCustomer
  } = useAuthStore();

  if (!user) return null;

  const userStatus = getUserStatus() as UserStatus;
  const progress = getVerificationProgress();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
      router.push('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al cerrar sesión.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Botón de verificación destacado solo para usuarios logueados */}
      {userStatus === 'logueado' && (
        <Button 
          variant="default" 
          size="sm"
          className={cn(
            "hidden sm:flex gap-2 items-center",
            "bg-orange-600 hover:bg-orange-700 text-white",
            "animate-pulse hover:animate-none transition-all"
          )}
          asChild
        >
          <Link href="/profile/verification">
            <ShieldAlert className="h-4 w-4" />
            <span>Verificar Cuenta</span>
          </Link>
        </Button>
      )}
      
      {/* Menú desplegable */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-10 w-10 rounded-full hover:bg-accent/80 transition-colors"
            aria-label="Menú de usuario"
          >
            <UserAvatar user={user} status={userStatus} />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-80" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <UserInfoSection 
              user={user} 
              status={userStatus} 
              progress={progress} 
            />
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <MenuItem href="/profile" icon={User}>Mi Perfil</MenuItem>
          <MenuItem href="/profile/edit" icon={Edit}>Editar Perfil</MenuItem>
          <MenuItem href="/profile/change-password" icon={Key}>Cambiar Contraseña</MenuItem>
          
          {/* Opciones para usuarios verificados */}
          {userStatus === 'verificado' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Funcionalidades
              </DropdownMenuLabel>
              
              {isCustomer() && (
                <>
                  <MenuItem href="/favorites" icon={Heart}>Mis Favoritos</MenuItem>
                  <MenuItem href="/inquiries" icon={FileText}>Mis Consultas</MenuItem>
                </>
              )}
              
              <MenuItem href="/auctions" icon={Gavel}>Ver Subastas</MenuItem>
              <MenuItem href="/my-auctions" icon={BarChart3}>Mis Subastas</MenuItem>
              <MenuItem href="/create-auction" icon={Plus}>Crear Subasta</MenuItem>
              
              {isDealer() && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Vendedor
                  </DropdownMenuLabel>
                  <MenuItem href="/dealer/inventory" icon={Car}>Mi Inventario</MenuItem>
                  <MenuItem href="/dealer/leads" icon={Users}>Clientes Potenciales</MenuItem>
                </>
              )}
              
              {isAdmin() && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Administración
                  </DropdownMenuLabel>
                  <MenuItem href="/admin/dashboard" icon={BarChart3}>Panel de Control</MenuItem>
                  <MenuItem href="/admin/users" icon={Users}>Gestión de Usuarios</MenuItem>
                </>
              )}
            </>
          )}
          
          <DropdownMenuSeparator />
          <MenuItem href="/settings" icon={Settings}>Configuración</MenuItem>
          <DropdownMenuSeparator />
          <MenuItem 
            icon={LogOut} 
            className="text-destructive focus:text-destructive"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </MenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User, Settings, LogOut, ShieldAlert, Shield,
  Car, BarChart3, Users, Heart, FileText, Gavel,
  Plus, Edit, Key, CheckCircle, Clock,
  Wrench,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type UserStatus = "logueado" | "verificado" | "visitante";

const STATUS_CONFIG = {
  logueado: {
    badge: <Badge variant="secondary" className="text-xs">Verificación Pendiente</Badge>,
    icon: <Clock className="h-3 w-3 text-orange-500" />,
  },
  verificado: {
    badge: <Badge variant="default" className="text-xs">Verificado</Badge>,
    icon: <CheckCircle className="h-3 w-3 text-green-500" />,
  },
  visitante: {
    badge: <Badge variant="outline" className="text-xs">Visitante</Badge>,
    icon: <User className="h-3 w-3 text-gray-500" />,
  },
};

const UserStatusIndicator = ({ status }: { status: UserStatus }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.visitante;
  return (
    <div className="flex items-center justify-between">
      {config.badge}
      {config.icon}
    </div>
  );
};

const UserAvatar = ({
  user,
  status,
}: {
  user: { name: string; avatar?: string };
  status: UserStatus;
}) => {
  const getInitials = (name?: string) => name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className="relative">
      <Avatar className="h-10 w-10">
        {user.avatar ? (
          <AvatarImage src={user.avatar} alt={user.name} />
        ) : (
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        )}
      </Avatar>
      {status === "logueado" && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full border-2 border-background" />
      )}
    </div>
  );
};

const UserInfoSection = ({
  user,
  status,
  progress,
}: {
  user: { name: string; email: string; avatar?: string; role?: string };
  status: UserStatus;
  progress: number;
}) => (
  <div className="flex flex-col space-y-2">
    <div className="flex items-center space-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="text-xs">{user?.name?.charAt(0)?.toUpperCase() ?? 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        {user?.name && ( 
          <p className="text-sm font-medium leading-none truncate" title={user.name}>
            {user.name}
          </p>
        )}
        <p
          className="text-xs leading-none text-muted-foreground mt-1 truncate"
          title={user.email}
        >
          {user.email}
        </p>
      </div>
    </div>

    <div className="space-y-1">
      <UserStatusIndicator status={status} />

      {status === "logueado" && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progreso</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}

      {status === "verificado" && user.role && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium capitalize">{user.role}</span>
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
  onClick,
}: {
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const content = Icon ? (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </div>
  ) : (
    <div className="text-sm">
      {children}
    </div>
  );

  return href ? (
    <DropdownMenuItem asChild className={className}>
      <Link href={href} className="w-full py-2">
        {content}
      </Link>
    </DropdownMenuItem>
  ) : (
    <DropdownMenuItem onClick={onClick} className={cn("py-2", className)}>
      {content}
    </DropdownMenuItem>
  );
};

export function UserMenu() {
  const router = useRouter();
  const { toast } = useToast();
  const [loggingOut, setLoggingOut] = useState(false);

  const {
    user,
    logout,
    getUserStatus,
    getVerificationProgress,
    isAdmin,
    isDealer,
    isCustomer,
    isLoading,
  } = useAuthStore();

  if (isLoading || !user) return null;

  const userStatus = getUserStatus() as UserStatus;
  const progress = getVerificationProgress();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al cerrar sesión.",
        variant: "destructive",
      });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
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

        <DropdownMenuContent
          className="w-80 max-w-[calc(100vw-2rem)] max-h-[80vh] overflow-y-auto"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <UserInfoSection user={user} status={userStatus} progress={progress} />
          </DropdownMenuLabel>

          <DropdownMenuSeparator />
          
          {userStatus === "logueado" && (
            <DropdownMenuItem asChild className="bg-orange-50 text-orange-700 hover:bg-orange-100 focus:bg-orange-100">
              <Link href="/profile/verification" className="w-full py-2">
                <div className="flex items-center gap-2 text-sm">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Verificar Cuenta</span>
                  <Badge variant="secondary" className="text-xs ml-auto">
                    Pendiente
                  </Badge>
                </div>
              </Link>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Perfil
          </DropdownMenuLabel>
          <MenuItem href="/profile" icon={User}>Mi Perfil</MenuItem>
          <MenuItem href="/profile/edit" icon={Edit}>Editar Perfil</MenuItem>
          <MenuItem href="/profile/change-password" icon={Key}>Cambiar Contraseña</MenuItem>

          {userStatus === "verificado" && (
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
                  <MenuItem href="/taller" icon={Wrench}>Taller</MenuItem>
                </>
              )}

              {isAdmin() && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Administración
                  </DropdownMenuLabel>
                  <MenuItem href="/admin" icon={BarChart3}>Panel de Control</MenuItem>
                  <MenuItem href="/admin/vehiculos" icon={Users}>Gestión de Usuarios</MenuItem>
                </>
              )}
            </>
          )}

          <DropdownMenuSeparator />
          <MenuItem href="/settings" icon={Settings}>Configuración</MenuItem>
          <DropdownMenuSeparator />
          <MenuItem
            icon={LogOut}
            className="text-destructive focus:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <div className="flex items-center gap-2 text-sm">
              <LogOut className="h-4 w-4" />
              <span>{loggingOut ? "Cerrando..." : "Cerrar Sesión"}</span>
              {loggingOut && (
                <div className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
              )}
            </div>
          </MenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

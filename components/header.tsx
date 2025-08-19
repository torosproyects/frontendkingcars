"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, User, Upload, Gavel, Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth-store";
import { UserMenu } from "@/components/auth/user-menu";
import Image from 'next/image'; // Importar Image de Next.js
import logo from '@/public/logoisocol.png'; // Importar el logo

export default function Header() {
  const pathname = usePathname();
  const { 
    seLogueo, 
    user, 
    getUserStatus, 
    getVerificationProgress,
    isAdmin, 
    isDealer,
    canAccessFeature 
  } = useAuthStore();
  const userStatus = getUserStatus();
  const progress = getVerificationProgress();

  // Estado para controlar el Sheet de forma explícita
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  // Función para cerrar el Sheet
  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  // Manejador para enlaces dentro del Sheet
  const handleSheetLinkClick = () => {
    // Pequeño retraso para asegurar navegación antes de cerrar
    setTimeout(closeSheet, 100);
  };

  // Función para mostrar indicador de verificación pendiente
  const VerificationIndicator = () => {
    if (userStatus === 'logueado') {
      return (
        <Badge variant="secondary" className="ml-2 text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Verificación Pendiente
        </Badge>
      );
    }
    return null;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Menú Hamburguesa Controlado */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Menú">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  Navegación Principal
                  <VerificationIndicator />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  onClick={handleSheetLinkClick} // Cerrar al hacer clic
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Inicio
                </Link>
                <Link
                  href="/catalog"
                  onClick={handleSheetLinkClick} // Cerrar al hacer clic
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/catalog" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Catálogo
                </Link>
                {/* Opciones que requieren verificación */}
                {canAccessFeature('upload-car') ? (
                  <Link
                    href="/upload-car"
                    onClick={handleSheetLinkClick} // Cerrar al hacer clic
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === "/upload-car" ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    Subir Mi Auto
                  </Link>
                ) : userStatus === 'logueado' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-muted-foreground">Subir Mi Auto</span>
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Requiere Verificación
                    </Badge>
                  </div>
                ) : null}
                {/* Subastas */}
                {canAccessFeature('auctions') ? (
                  <>
                    <Link
                      href="/auctions"
                      onClick={handleSheetLinkClick} // Cerrar al hacer clic
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname.startsWith("/auctions") ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      Subastas
                    </Link>
                    <Link
                      href="/my-auctions"
                      onClick={handleSheetLinkClick} // Cerrar al hacer clic
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname === "/my-auctions" ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      Mis Subastas
                    </Link>
                  </>
                ) : userStatus === 'logueado' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-muted-foreground">Subastas</span>
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Requiere Verificación
                    </Badge>
                  </div>
                ) : null}
                {/* Enlaces específicos por rol - Solo para usuarios verificados */}
                {userStatus === 'verificado' && isAdmin() && (
                  <Link
                    href="/admin/dashboard"
                    onClick={handleSheetLinkClick} // Cerrar al hacer clic
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    Panel de Admin
                  </Link>
                )}
                {userStatus === 'verificado' && isDealer() && (
                  <Link
                    href="/dealer/inventory"
                    onClick={handleSheetLinkClick} // Cerrar al hacer clic
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname.startsWith("/dealer") ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    Mi Inventario
                  </Link>
                )}
                <Link
                  href="/about"
                  onClick={handleSheetLinkClick} // Cerrar al hacer clic
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/about" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Acerca de
                </Link>
                <Link
                  href="/contact"
                  onClick={handleSheetLinkClick} // Cerrar al hacer clic
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/contact" ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Contacto
                </Link>
                {/* Indicador de verificación en móvil */}
                {userStatus === 'logueado' && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">Verificación Pendiente</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-orange-700">
                        <span>Progreso</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-orange-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <Button asChild size="sm" className="w-full mt-2">
                      <Link href="/profile/verification" onClick={handleSheetLinkClick}> {/* Cerrar al hacer clic */}
                        Completar Verificación
                      </Link>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          
          {/* Logo Desktop */}
          <Link href="/" className="hidden sm:flex items-center gap-2">
            <Image 
              src={logo} 
              alt="CarsKing Logo" 
              width={60} 
              height={60}
              className="object-contain"
            />
            
          </Link>
          
          {/* Logo Móvil */}
          <Link href="/" className="sm:hidden flex items-center gap-1">
            <Image 
              src={logo} 
              alt="CarsKing Logo" 
              width={30} 
              height={30}
              className="object-contain"
            />
           
          </Link>
          
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Inicio
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Catálogo</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/catalog"
                        >
                          {/* Logo en el menú desplegable de Catálogo */}
                          <Image 
                            src={logo} 
                            alt="CarsKing Logo" 
                            width={150}
                            height={150}
                            className="object-contain"
                          />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Todos los Vehículos
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Explora nuestra colección completa de vehículos de calidad
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link href="/catalog/category/nuevo" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Autos Nuevos</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Últimos modelos con características de vanguardia
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/catalog/category/usado" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Autos Usados</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Vehículos usados de calidad a excelentes precios
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/catalog/category/reparado"legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Colección de Lujo</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Vehículos premium para el comprador exigente
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Subir auto - Solo si tiene acceso */}
              {canAccessFeature('upload-car') && (
                <NavigationMenuItem>
                  <Link href="/upload-car" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Subir Auto
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}

              {/* Menú de Subastas - Solo si tiene acceso */}
              {/*canAccessFeature('auctions') && solo para pruebassssssssssssssssssss*/ (
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Subastas</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/auctions"
                          >
                            {/* Logo en el menú desplegable de Subastas */}
                            <Image 
                              src={logo} 
                              alt="CarsKing Logo" 
                              width={150}
                              height={150}
                              className="h-6 w-6 object-contain"
                            />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Todas las Subastas
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Explora subastas activas y encuentra ofertas únicas
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <Link href="/my-auctions" legacyBehavior passHref>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Mis Subastas</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Gestiona tus subastas activas y historial
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link href="/auctions/create" legacyBehavior passHref>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Crear Subasta</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Pon tu vehículo en subasta al mejor precio
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link href="/auctions/active" legacyBehavior passHref>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Subastas Activas</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Participa en subastas que están en curso
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )}
              {/* Enlaces específicos por rol en el menú principal - Solo para verificados */}
              {userStatus === 'verificado' && isAdmin() && (
                <NavigationMenuItem>
                  <Link href="/admin/dashboard" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Administración
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
              {userStatus === 'verificado' && isDealer() && (
                <NavigationMenuItem>
                  <Link href="/dealer/inventory" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Mi Inventario
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Acerca de
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contacto
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-2">
          {/* Indicador de verificación en desktop */}
          {userStatus === 'logueado' && (
            <div className="hidden md:flex items-center gap-2 mr-2">
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Verificación Pendiente
              </Badge>
            </div>
          )}
          <ModeToggle />
          {/* Mostrar menú de usuario si está autenticado, sino mostrar botones de login/registro */}
          {seLogueo? (
            <UserMenu />
          ) : (
            <>
              <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                <Link href="/auth/login">
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Link>
              </Button>
              <Button size="sm" asChild className="hidden sm:flex">
                <Link href="/auth/register">Registrarse</Link>
              </Button>
              {/* Botón de cuenta móvil */}
              <Button variant="ghost" size="icon" asChild className="sm:hidden">
                <Link href="/auth/login" aria-label="Cuenta">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
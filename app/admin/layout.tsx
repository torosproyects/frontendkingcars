"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store"; // Ajusta si tu store está en otra ruta
import {
  Home,
  Users,
  Car,
  Wrench,
  BarChart2,
  Shield,
  Settings,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// === Layout base ===
export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, seLogueo, isLoading } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  // 🔐 Protege ruta: solo admin
  useEffect(() => {
    if (!isLoading && (!seLogueo)) {
      router.push("/login");
    }
  }, [seLogueo, isLoading,router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col border-r bg-white dark:bg-gray-800">
        <Sidebar router={router} />
      </aside>

      {/* Sidebar Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Fondo oscuro */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="relative flex w-64 flex-col bg-white dark:bg-gray-800 p-4">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-300"
            >
              <X size={20} />
            </button>
            <Sidebar router={router} onClickItem={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between h-16 px-4 border-b bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-2">
            {/* Botón hamburguesa (solo móvil) */}
            <button
              className="md:hidden text-gray-700 dark:text-gray-300"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
            <h2 className="text-lg font-semibold">Panel Administrativo</h2>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            
          </div>
        </header>

        {/* Children */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}

// === Sidebar ===
function Sidebar({
  router,
  onClickItem,
}: {
  router: any;
  onClickItem?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-2 mt-6">
      <SidebarItem icon={<Home size={18} />} label="Dashboard" href="/admin" router={router} onClickItem={onClickItem}/>
      <SidebarItem icon={<Users size={18} />} label="Usuarios" href="/admin/usuarios" router={router} onClickItem={onClickItem}/>
      <SidebarItem icon={<Car size={18} />} label="Vehículos" href="/admin/vehiculos" router={router} onClickItem={onClickItem}/>
      <SidebarItem icon={<Wrench size={18} />} label="Talleres" href="/admin/talleres" router={router} onClickItem={onClickItem}/>
      <SidebarItem icon={<BarChart2 size={18} />} label="Revisiones" href="/admin/revisiones" router={router} onClickItem={onClickItem}/>
      <SidebarItem icon={<Settings size={18} />} label="Tablas" href="/admin/tablas" router={router} onClickItem={onClickItem}/>
      <SidebarItem icon={<Shield size={18} />} label="Seguridad" href="/admin/seguridad" router={router} onClickItem={onClickItem}/>
      <SidebarItem icon={<HelpCircle size={18} />} label="Soporte" href="/admin/soporte" router={router} onClickItem={onClickItem}/>
    </nav>
  );
}

// === SidebarItem ===
function SidebarItem({
  icon,
  label,
  href,
  router,
  onClickItem,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  router: any;
  onClickItem?: () => void;
}) {
  const isActive =
    typeof window !== "undefined" && window.location.pathname === href;

  return (
    <button
      onClick={() => {
        router.push(href);
        onClickItem?.();
      }}
      className={cn(
        "flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-white"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      )}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}

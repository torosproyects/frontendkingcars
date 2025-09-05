"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, BarChart2, Wrench } from "lucide-react";

export default function AdminDashboard() {
  // 🔹 Datos mockeados (conecta luego a tu API)
  const stats = [
    {
      title: "Usuarios Activos",
      value: "1,245",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: "Vehículos Pendientes",
      value: "37",
      icon: <Car className="h-6 w-6 text-primary" />,
    },
    {
      title: "Ventas del Mes",
      value: "$58,900",
      icon: <BarChart2 className="h-6 w-6 text-primary" />,
    },
    {
      title: "Talleres Activos",
      value: "12",
      icon: <Wrench className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Título */}
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-sm text-muted-foreground">
        Resumen general de la actividad en la plataforma
      </p>

      {/* KPIs en grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sección extra (ejemplo) */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Últimos Vehículos Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Toyota Corolla 2020</span>
                <span className="text-muted-foreground">Pendiente</span>
              </li>
              <li className="flex justify-between">
                <span>Ford Ranger 2019</span>
                <span className="text-muted-foreground">Pendiente</span>
              </li>
              <li className="flex justify-between">
                <span>Tesla Model 3 2022</span>
                <span className="text-muted-foreground">Pendiente</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-medium">Juan Pérez</span> publicó un{" "}
                <span className="italic">Hyundai Tucson 2021</span>
              </li>
              <li>
                <span className="font-medium">María López</span> se registró en
                la plataforma
              </li>
              <li>
                <span className="font-medium">Carlos Gómez</span> completó una
                venta
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

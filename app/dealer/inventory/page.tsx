"use client";

import React from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Plus, Edit, Eye, TrendingUp } from 'lucide-react';

function DealerInventoryContent() {
  return (
    <div className="container py-8 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Mi Inventario</h1>
          <p className="text-muted-foreground max-w-3xl">
            Gestiona tu inventario de vehículos, actualiza precios y monitorea el rendimiento de ventas.
          </p>
        </div>
        <Button className="mt-4 md:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Vehículo
        </Button>
      </div>

      {/* Estadísticas del vendedor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mis Vehículos</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +2 agregados esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +3 desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Activas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +4 nuevas esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$485K</div>
            <p className="text-xs text-muted-foreground">
              +22% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de vehículos */}
      <Card>
        <CardHeader>
          <CardTitle>Vehículos en Inventario</CardTitle>
          <CardDescription>
            Gestiona tu inventario personal de vehículos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Ejemplo de vehículo */}
            {[
              { make: 'BMW', model: 'M4 Competition', year: 2023, price: 84700, status: 'Disponible', inquiries: 5 },
              { make: 'Mercedes-Benz', model: 'Clase S', year: 2022, price: 109800, status: 'Reservado', inquiries: 8 },
              { make: 'Audi', model: 'e-tron GT', year: 2023, price: 102400, status: 'Disponible', inquiries: 3 },
              { make: 'Porsche', model: '911 Carrera', year: 2023, price: 114000, status: 'Vendido', inquiries: 12 },
            ].map((vehicle, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-12 bg-muted rounded-md flex items-center justify-center">
                    <Car className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                    <p className="text-sm text-muted-foreground">${vehicle.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge 
                      variant={
                        vehicle.status === 'Disponible' ? 'default' :
                        vehicle.status === 'Reservado' ? 'secondary' : 'outline'
                      }
                    >
                      {vehicle.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {vehicle.inquiries} consultas
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DealerInventoryPage() {
  return (
    <ProtectedRoute requiredRoles={['Administrador']}>
      <DealerInventoryContent />
    </ProtectedRoute>
  );
}
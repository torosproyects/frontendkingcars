"use client";

import React from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Car, Calendar, Gauge, Fuel } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function FavoritesContent() {
  // Simulamos algunos vehículos favoritos
  const favoriteVehicles = [
    {
      id: 1,
      make: 'BMW',
      model: 'M4 Competition',
      year: 2023,
      price: 84700,
      mileage: 0,
      fuelType: 'Gasolina',
      image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
    },
    {
      id: 3,
      make: 'Audi',
      model: 'e-tron GT',
      year: 2023,
      price: 102400,
      mileage: 5000,
      fuelType: 'Eléctrico',
      image: 'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg',
    },
  ];

  return (
    <div className="container py-8 px-4 md:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Mis Vehículos Favoritos</h1>
        <p className="text-muted-foreground max-w-3xl">
          Aquí puedes ver todos los vehículos que has marcado como favoritos para revisarlos más tarde.
        </p>
      </div>

      {favoriteVehicles.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">No tienes favoritos aún</CardTitle>
            <CardDescription className="mb-6">
              Explora nuestro catálogo y marca los vehículos que te interesen como favoritos.
            </CardDescription>
            <Button asChild>
              <Link href="/catalog">Explorar Catálogo</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full">
                <Image
                  src={vehicle.image}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background/90"
                >
                  <Heart className="h-4 w-4 fill-red-500 stroke-red-500" />
                </Button>
              </div>
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold mb-1">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-xl font-semibold mb-3">
                  ${vehicle.price.toLocaleString()}
                </p>
                <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{vehicle.year}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Gauge className="h-4 w-4" />
                    <span>{vehicle.mileage.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground col-span-2">
                    <Fuel className="h-4 w-4" />
                    <span>{vehicle.fuelType}</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/catalog/${vehicle.id}`}>Ver Detalles</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <ProtectedRoute requiredRoles={['Administrador', 'Usuario', 'Taller']}>
      <FavoritesContent />
    </ProtectedRoute>
  );
}
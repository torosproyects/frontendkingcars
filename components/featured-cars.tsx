"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Fuel, Gauge, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "@/lib/motion";
import { useCarsStore } from "@/lib/store/cars-store";

export function FeaturedCars() {
  const { loading, error, getFeaturedCars } = useCarsStore();
  
  const featuredCars = getFeaturedCars();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Cargando vehículos destacados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (featuredCars.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-muted-foreground">No hay vehículos destacados disponibles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredCars.map((car, index) => (
        <motion.div
          key={car.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src={car.imagen}
                alt={`${car.marca} ${car.modelo}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              {car.isNew && (
                <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                  Nueva Llegada
                </Badge>
              )}
            </div>
            <CardContent className="flex-grow pt-6">
              <h3 className="text-xl font-bold mb-1">
                {car.marca} {car.modelo}
              </h3>
              <p className="text-2xl font-semibold mb-3">
                ${car.precio.toLocaleString()}
              </p>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{car.year}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Gauge className="h-4 w-4" />
                  <span>{car.kilometraje.toLocaleString()} km</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground col-span-2">
                  <Fuel className="h-4 w-4" />
                  <span>{car.categoria}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-4">
              <Link
                href={`/catalog/${car.id}`}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full group"
                )}
              >
                Ver Detalles
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
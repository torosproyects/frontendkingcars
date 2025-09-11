"use client";

import React, { memo, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Fuel, Gauge, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "@/lib/motion";
import { useCarsStore } from "@/lib/store/cars-store";

export const FeaturedCars = memo(function FeaturedCars() {
  // Usar selectores específicos de Zustand para mejor optimización con memo
  const allCars = useCarsStore(state => state.allCars);
  const loading = useCarsStore(state => state.loading);
  const error = useCarsStore(state => state.error);
  const fetchCars = useCarsStore(state => state.fetchCars);
  const getFeaturedCars = useCarsStore(state => state.getFeaturedCars);
  
  // Memoizar featuredCars para evitar recálculos innecesarios
  const featuredCars = useMemo(() => getFeaturedCars(), [allCars]);
  
  // Debug: Log cuando cambian los carros
  console.log('FeaturedCars render:', { loading, allCarsLength: allCars.length, featuredCarsLength: featuredCars.length });

  // Mostrar loading solo si está cargando Y no hay carros
  if (loading && allCars.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-48 w-full rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
              <div className="bg-gray-200 h-6 w-1/2 rounded"></div>
              <div className="bg-gray-200 h-3 w-full rounded"></div>
              <div className="bg-gray-200 h-3 w-2/3 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Si hay carros pero están cargando, mostrar carros con skeleton de imágenes
  if (loading && allCars.length > 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredCars.map((car, index) => (
          <Card key={car.id} className="overflow-hidden h-full flex flex-col">
            <div className="relative h-48 w-full bg-gray-200 animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-400">Cargando imagen...</span>
              </div>
            </div>
            <CardContent className="flex-grow pt-6">
              <h3 className="text-xl font-bold mb-1">{car.marca} {car.modelo}</h3>
              <p className="text-2xl font-semibold mb-3">${car.precio.toLocaleString()}</p>
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
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-destructive">Error: {error}</p>
          <button 
            onClick={() => fetchCars(true)}
            className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (featuredCars.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-muted-foreground">No hay vehículos destacados disponibles.</p>
          <button 
            onClick={() => fetchCars(true)}
            className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Cargar vehículos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredCars.map((car, index) => (
        <motion.div
          key={car.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full bg-gray-100">
              <Image
                src={car.imagen}
                alt={`${car.marca} ${car.modelo}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
                quality={30}
                priority={false}
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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
});
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "@/lib/motion";

export function HeroBanner() {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Imagen de fondo del hero */}
      <div className="absolute inset-0">
        <Image
          src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg"
          alt="Auto de lujo"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/30"></div>
      </div>

      {/* Contenido del hero */}
      <div className="relative h-full container flex flex-col justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Descubre Tu Conducción Perfecta
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-md md:max-w-lg">
            Explora nuestra selección premium de vehículos seleccionados por rendimiento, comodidad y estilo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/catalog">Explorar Catálogo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contáctanos</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
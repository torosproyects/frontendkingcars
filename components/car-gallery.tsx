"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "@/lib/motion";

interface CarGalleryProps {
  images: string[];
  carName: string;
  isNew?: boolean;
}

export function CarGallery({ images, carName, isNew = false }: CarGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "Escape") setIsFullscreen(false);
  };

  // Calcular las imágenes visibles en la galería de miniaturas
  const getVisibleThumbnails = () => {
    const maxVisible = 6;
    if (images.length <= maxVisible) return images;
    
    const start = Math.max(0, Math.min(currentImageIndex - 2, images.length - maxVisible));
    return images.slice(start, start + maxVisible);
  };

  const visibleThumbnails = getVisibleThumbnails();
  const thumbnailStartIndex = images.indexOf(visibleThumbnails[0]);

  return (
    <>
      {/* Galería Principal */}
      <div className="space-y-4">
        {/* Imagen Principal */}
        <div className="relative group">
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden bg-muted">
            <Image
              src={images[currentImageIndex]}
              alt={`${carName} - Vista ${currentImageIndex + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            
            {/* Badge de Nueva Llegada */}
            {isNew && (
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                Nueva Llegada
              </Badge>
            )}

            {/* Controles de Navegación */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background/90"
              onClick={prevImage}
              disabled={images.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Imagen anterior</span>
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background/90"
              onClick={nextImage}
              disabled={images.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Imagen siguiente</span>
            </Button>

            {/* Botón de Pantalla Completa */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background/90"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize2 className="h-4 w-4" />
              <span className="sr-only">Ver en pantalla completa</span>
            </Button>

            {/* Indicador de Imagen */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 rounded-full px-3 py-1 text-sm font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>

        {/* Galería de Miniaturas */}
        {images.length > 1 && (
          <div className="relative">
            <div className="flex gap-2 overflow-hidden">
              {visibleThumbnails.map((image, index) => {
                const actualIndex = thumbnailStartIndex + index;
                return (
                  <motion.button
                    key={actualIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => goToImage(actualIndex)}
                    className={cn(
                      "relative h-16 w-24 md:h-20 md:w-32 rounded-md overflow-hidden border-2 transition-all duration-200 flex-shrink-0",
                      actualIndex === currentImageIndex
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${carName} - Miniatura ${actualIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                    {actualIndex === currentImageIndex && (
                      <div className="absolute inset-0 bg-primary/10" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Indicadores de más imágenes */}
            {thumbnailStartIndex > 0 && (
              <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-background to-transparent flex items-center">
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            {thumbnailStartIndex + visibleThumbnails.length < images.length && (
              <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent flex items-center justify-end">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Pantalla Completa */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Imagen en Pantalla Completa */}
            <div className="relative max-w-7xl max-h-full">
              <Image
                src={images[currentImageIndex]}
                alt={`${carName} - Vista ${currentImageIndex + 1}`}
                width={1200}
                height={800}
                className="object-contain max-w-full max-h-full"
                quality={95}
              />
            </div>

            {/* Controles de Pantalla Completa */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 bg-background/80 hover:bg-background/90"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar pantalla completa</span>
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background/90"
              onClick={prevImage}
              disabled={images.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Imagen anterior</span>
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background/90"
              onClick={nextImage}
              disabled={images.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Imagen siguiente</span>
            </Button>

            {/* Indicador de Imagen en Pantalla Completa */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 rounded-full px-4 py-2 text-sm font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Miniaturas en Pantalla Completa */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-md overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={cn(
                    "relative h-12 w-16 rounded border-2 overflow-hidden flex-shrink-0 transition-all",
                    index === currentImageIndex
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-white/30 hover:border-white/60"
                  )}
                >
                  <Image
                    src={image}
                    alt={`Miniatura ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
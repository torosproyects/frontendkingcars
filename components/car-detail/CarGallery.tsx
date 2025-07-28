'use client';

import { useState, useEffect , useMemo} from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
}

interface CarGalleryProps {
  images: GalleryImage[] | null | undefined;
  carName: string;
  isNew?: boolean;
  primaryImageUrl?: string;
}

const isValidUrl = (url?: string) => {
  if (!url) return false;
  try {
    new URL(url); // Intenta crear un objeto URL
    return true;
  } catch {
    return false;
  }
};

export function CarGallery({
  images = [],
  carName,
  isNew = false,
  primaryImageUrl
}: CarGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  

  // Handle empty images array
  const galleryImages: GalleryImage[] = useMemo(() => {
    const validImages = (images || []).filter(img => isValidUrl(img.url));
    
    // Si hay imágenes válidas, usarlas
    if (validImages.length > 0) return validImages;
    
    
    if (isValidUrl(primaryImageUrl)) {
      return [{ id: 'primary', url: primaryImageUrl!, alt: `Imagen principal de ${carName}` }];
    }
    
    
    return [];
  }, [images, primaryImageUrl, carName]);

  
  useEffect(() => {
    setCurrentImageIndex(0);
    setIsLoading(true);
  }, [galleryImages]);
  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
    setIsLoading(true);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
    setIsLoading(true);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsLoading(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      handleNext();
    }

    if (touchStart - touchEnd < -50) {
      handlePrev();
    }
  };

  if (!galleryImages.length) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No hay imágenes disponibles</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Badge for new car */}
      {isNew && (
        <div className="mb-2">
          <Badge variant="secondary" className="text-sm">
            Nuevo
          </Badge>
        </div>
      )}

      {/* Main Image Container */}
      <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
        {isLoading && (
          <Skeleton className="w-full h-full absolute inset-0" />
        )}
        
        <div 
          className={`relative w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={galleryImages[currentImageIndex].url}
            alt={galleryImages[currentImageIndex].alt || `${carName} - Imagen ${currentImageIndex + 1}`}
            fill
            className={`object-cover ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            priority={currentImageIndex === 0}
            quality={85}
            onLoadingComplete={() => setIsLoading(false)}
            onClick={() => setIsZoomed(!isZoomed)}
          />
          
          {/* Zoom indicator */}
          <button 
            className="absolute bottom-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
            onClick={() => setIsZoomed(!isZoomed)}
            aria-label={isZoomed ? 'Reducir imagen' : 'Ampliar imagen'}
          >
            <ZoomIn size={20} />
          </button>
        </div>

        {/* Navigation arrows */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image counter */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {galleryImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails Gallery */}
      {galleryImages.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {galleryImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${currentImageIndex === index ? 'border-primary ring-2 ring-primary/50' : 'border-transparent hover:border-gray-300'}`}
              aria-label={`Ver imagen ${index + 1} de ${carName}`}
            >
              <Image
                src={image.url}
                alt={image.alt || `${carName} - Miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 20vw, 10vw"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
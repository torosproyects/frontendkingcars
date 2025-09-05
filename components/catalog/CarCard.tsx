// components/catalog/CarCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Carro } from '@/types/carro';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CarCardProps {
  car: Carro;
}

export function CarCard({ car }: CarCardProps) {
 
  const estadoNormalizado = car.estado?.trim().toLowerCase();
  const estaEnRevision = [
    'revisionadmin',
    'en revision',
    ].includes(estadoNormalizado);

  return (
    <div className="bg-card rounded-lg shadow overflow-hidden border hover:shadow-md transition-shadow relative">
      {/* Imagen con badge y overlay si está en revisión */}
      <div className="relative h-48 w-full">
        <Image
          src={car.imagen || '/placeholder-car.jpg'}
          alt={`${car.marca} ${car.modelo}`}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-t-lg transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badge: Nuevo (solo si no está en revisión) */}
        {car.isNew && !estaEnRevision && (
          <Badge className="absolute top-2 left-2 bg-green-600 text-white z-10">
            Nuevo
          </Badge>
        )}

        {/* Badge: En Revisión */}
        {estaEnRevision && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1 font-medium z-10"
          >
            ⚠️ <span className="hidden sm:inline">En Revisión</span>
          </Badge>
        )}

        {/* Overlay oscuro semitransparente cuando está en revisión */}
        {estaEnRevision && (
          <div className="absolute inset-0 bg-black bg-opacity-30 z-20 rounded-t-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm text-center px-2">
              No disponible temporalmente
            </span>
          </div>
        )}
      </div>

      {/* Contenido del card */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{car.marca} {car.modelo}</h3>
        <p className="text-muted-foreground text-sm mb-2">
          {car.year} • {car.categoria}
        </p>
        <p className="font-bold text-xl mb-4">${car.precio?.toLocaleString()}</p>

        {/* Botón condicional */}
        <Button
          asChild
          className="w-full"
          disabled={estaEnRevision}
        >
          {estaEnRevision ? (
            <span className="pointer-events-none text-sm">No disponible</span>
          ) : (
            <Link href={`/catalog/car/${car.id}`}>Ver Detalles</Link>
          )}
        </Button>
      </div>

      {/* Si está en revisión, bloquea cualquier clic en todo el card */}
      {estaEnRevision && (
        <div className="absolute inset-0 pointer-events-none z-30 rounded-lg"></div>
      )}
    </div>
  );
}

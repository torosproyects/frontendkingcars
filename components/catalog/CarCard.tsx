// components/catalog/CarCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Carro } from '@/types/carro';
import { Badge } from '@/components/ui/badge'; // Si usas Shadcn/UI
import { Button } from '@/components/ui/button';

interface CarCardProps {
  car: Carro;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <div className="bg-card rounded-lg shadow overflow-hidden border hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={car.imagen || '/placeholder-car.jpg'}
          alt={`${car.marca} ${car.modelo}`}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-t-lg"
        />
        {car.isNew && (
          <Badge className="absolute top-2 left-2 bg-green-600 text-white">Nuevo</Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{car.marca} {car.modelo}</h3>
        <p className="text-muted-foreground text-sm mb-2">{car.year} • {car.categoria}</p>
        <p className="font-bold text-xl mb-3">${car.precio?.toLocaleString()}</p>
        <Button asChild className="w-full">
          <Link href={`/catalog/car/${car.id}`}>Ver Detalles</Link>
        </Button>
      </div>
    </div>
  );
}

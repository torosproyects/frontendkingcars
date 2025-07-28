import Link from 'next/link';
import Image from 'next/image';
import { Carro } from '@/types/carro';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CarFront, Fuel, Gauge, Users } from 'lucide-react';

interface CarCardProps {
  car: Carro;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Imagen con badge */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={car.imagen || '/placeholder-car.jpg'}
          alt={`${car.marca} ${car.modelo}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          quality={85}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {car.isNew ? (
            <Badge className="bg-green-600 hover:bg-green-700">Nuevo</Badge>
          ) : (
            <Badge variant="secondary">Usado</Badge>
          )}
          {car.categoria && (
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
              {car.categoria}
            </Badge>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg leading-tight">
              {car.marca} {car.modelo}
            </h3>
            <p className="text-sm text-gray-500">{car.year}</p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
            ${car.precio?.toLocaleString()}
          </span>
        </div>

        {/* Especificaciones */}
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-5">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-blue-600" />
            <span>{car.kilometraje?.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-blue-600" />
            <span>{car.colorExterior}</span>
          </div>
          <div className="flex items-center gap-2">
            <CarFront className="h-4 w-4 text-blue-600" />
            <span>{car.placa}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span>{car.serial_motor?.slice(0, 6)}...</span>
          </div>
        </div>

        {/* Botón */}
        <Button asChild className="w-full">
          <Link href={`/catalog/car/${car.id}`} className="flex items-center justify-center">
            Ver detalles
          </Link>
        </Button>
      </div>
    </div>
  );
}
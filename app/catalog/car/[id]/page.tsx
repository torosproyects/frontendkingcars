'use client'; 

import { useCarsStore } from '@/lib/store/cars-store';
import { CarGallery } from '@/components/car-detail/CarGallery';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Gauge, Fuel, Cog, Share2, Printer, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function SimilarCarsSection() {
  // Esta sección puede usar `getFeaturedCars` del store o lógica personalizada
  // Por ahora, se deja como en tu ejemplo.
  return (
    <div className="bg-card rounded-lg shadow-sm p-6">
      <h3 className="font-semibold text-lg mb-4">Vehículos Similares</h3>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Link href={`/catalog/${i}`} key={i} className="block">
            <div className="flex gap-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
              <div className="relative h-16 w-24 rounded overflow-hidden">
                <Image
                  src={`https://images.pexels.com/photos/${1545743 + i * 100}/pexels-photo-${1545743 + i * 100}.jpeg`}
                  alt="Auto similar"
                  className="w-full h-full object-cover"
                   width={500}  // Obligatorio: define el ancho máximo esperado
                   height={500} // Obligatorio: define el alto máximo esperado
                   priority={true}
                />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium text-sm">BMW M3 Competition</h4>
                <p className="text-sm text-muted-foreground">2023 • 0 km</p>
                <p className="font-semibold text-sm">$82,500</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function CarDetailPage({ params }: { params: { id: string } }) {
  
  const car = useCarsStore((state) => state.getCarById(params.id));

  if (!car) {
    return (
      <div className="container py-8 px-4 md:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vehículo no encontrado</h1>
          <p className="text-muted-foreground mb-6">
            El vehículo que buscas no existe o ha sido removido.
          </p>
          <Button asChild>
            <Link href="/catalog">Volver al Catálogo</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/catalog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Catálogo
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">
            {car.year} {car.marca} {car.modelo}
          </h1>
          <p className="text-muted-foreground">{car.categoria} • Stock #A{params.id}12345</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Galería de Imágenes del Carro */}
      <div className="mb-10">
        <CarGallery
          images={ car.images }
          carName={`${car.marca} ${car.modelo}`}
          isNew={car.isNew}
          primaryImageUrl={car.imagen}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda - Detalles del Carro */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">
                ${car.precio?.toLocaleString()}
              </h2>
              <Button size="lg" className="mt-4 sm:mt-0">Contactar Distribuidor</Button>
            </div>
            
            {/* Información Principal */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 text-sm mb-6">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Año</span>
                <div className="flex items-center gap-1 font-medium">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{car.year}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Kilometraje</span>
                <div className="flex items-center gap-1 font-medium">
                  <Gauge className="h-4 w-4 text-primary" />
                  <span>{car.kilometraje?.toLocaleString() || '0'} km</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Tipo de Combustible</span>
                <div className="flex items-center gap-1 font-medium">
                  <Fuel className="h-4 w-4 text-primary" />
                  <span>{car.kilometraje}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Transmisión</span>
                <div className="flex items-center gap-1 font-medium">
                  <Cog className="h-4 w-4 text-primary" />
                  <span>{car.serial_carroceria}</span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Pestañas */}
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="specs">Especificaciones</TabsTrigger>
                <TabsTrigger value="features">Características</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Descripción</h3>
                  <p className="text-muted-foreground">{car.serial_carroceria}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Destacados</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span>Historial de servicio completo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span>Sin historial de accidentes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span>Un propietario anterior</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span>Garantía del fabricante</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="specs" className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Motor y Rendimiento</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Motor</p>
                      <p className="font-medium">{car.serial_motor}</p>
                    </div>
                    {car.serial_carroceria && (
                      <div>
                        <p className="text-sm text-muted-foreground">Caballos de Fuerza</p>
                        <p className="font-medium">{car.serial_carroceria} hp</p>
                      </div>
                    )}
                    {car.colorExterior && (
                      <div>
                        <p className="text-sm text-muted-foreground">0-100 km/h</p>
                        <p className="font-medium">{car.colorExterior} seg</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Transmisión</p>
                      <p className="font-medium">{"manual"}</p>
                    </div>
                    {car.marca && (
                      <div>
                        <p className="text-sm text-muted-foreground">Tracción</p>
                        <p className="font-medium">4X4</p>
                      </div>
                    )}
                    {car.marca && (
                      <div>
                        <p className="text-sm text-muted-foreground">Economía de Combustible</p>
                        <p className="font-medium">Gasolina</p>
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-3">Colores y Apariencia</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Color Exterior</p>
                      <div className="flex items-center gap-2 mt-1">
                        {/* Aquí puedes usar un componente de muestra de color real si tienes códigos hex */}
                        <div className="w-5 h-5 rounded-full bg-gray-300 border"></div> 
                        <p className="font-medium">{car.colorExterior}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Color Interior</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-5 h-5 rounded-full bg-gray-800"></div>
                        <p className="font-medium">{car.colorExterior}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              
            </Tabs>
          </div>
        </div>

        {/* Columna Derecha - Contacto y Carros Similares */}
        <div>
          <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">¿Interesado en este auto?</h3>
            <Button className="w-full mb-4">Agendar Prueba de Manejo</Button>
            <Button variant="outline" className="w-full">Solicitar Más Información</Button>
            <div className="mt-4 text-center">
              <p className="text-muted-foreground text-sm">
                O llámanos al <span className="text-foreground font-medium">+52 (55) 5123-4567</span>
              </p>
            </div>
          </div>
          
          <SimilarCarsSection /> {/* Componente separado o inline */}
        </div>
      </div>
    </div>
  );
}

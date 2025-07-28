import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FeaturedCars } from '@/components/featured-cars';
import { HeroBanner } from '@/components/hero-banner';
import { SearchFilters } from '@/components/search-filters';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Sección Hero */}
      <HeroBanner />
      
      {/* Sección de Búsqueda y Filtros */}
      <section className="w-full py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Encuentra Tu Auto Perfecto</h2>
          <SearchFilters />
        </div>
      </section>
      
      {/* Autos Destacados */}
      <section className="w-full py-12 px-4 md:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Vehículos Destacados</h2>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link href="/catalog">Ver Todos</Link>
            </Button>
          </div>
          <FeaturedCars />
        </div>
      </section>
      
      {/* Sección de Subir Auto */}
      <section className="w-full py-16 px-4 md:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Tienes un Auto para Vender?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Publica tu vehículo en nuestra plataforma y llega a miles de compradores potenciales. 
            Proceso simple, rápido y seguro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/upload-car">Subir Mi Auto</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/catalog">Ver Catálogo</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Por Qué Elegirnos */}
      <section className="w-full py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">¿Por Qué Elegir Nuestra Plataforma?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Listados Verificados</h3>
              <p className="text-muted-foreground">Todos nuestros listados están completamente verificados para garantizar autenticidad y precisión.</p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ahorro de Tiempo</h3>
              <p className="text-muted-foreground">Nuestros filtros avanzados te ayudan a encontrar el auto perfecto en minutos, no horas.</p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Soporte Experto</h3>
              <p className="text-muted-foreground">Nuestro equipo de expertos automotrices está disponible para ayudarte con cualquier pregunta.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Llamada a la Acción */}
      <section className="w-full py-16 px-4 md:px-6 lg:px-8 bg-muted">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Listo para Encontrar el Auto de Tus Sueños?</h2>
          <p className="max-w-2xl mx-auto mb-8">Únete a miles de clientes satisfechos que encontraron sus vehículos perfectos a través de nuestra plataforma.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/catalog">Explorar Catálogo</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/auth/register">Crear Cuenta</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
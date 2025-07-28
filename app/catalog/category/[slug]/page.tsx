'use client';

import { useEffect } from 'react';
import { useCarsStore } from '@/lib/store/cars-store';
import CatalogPageContent from '../../page';

const CATEGORY_SLUG_MAP: Record<string, string> = {
  'sedan': 'Sedán',
  'suv': 'SUV',
  'coupe': 'Coupé',
  'hatchback': 'Hatchback',
  'convertible': 'Convertible',
  'pickup': 'Pickup',
   
};

export default function CatalogByCategoryPage({ params }: { params: { slug: string } }) {
  const categorySlug = params.slug.toLowerCase(); // Normalizar el slug
  const { applyFilters, resetFilters, allCars } = useCarsStore();

  useEffect(() => {
    console.log(`[CatalogByCategoryPage] Intentando aplicar filtro para slug: ${categorySlug}`);

    
    let filterToApply: { categoria?: string; nuevo?: boolean } | null = null;

    if (categorySlug === 'new') {
      filterToApply = { nuevo: true };
     
    } else if (CATEGORY_SLUG_MAP[categorySlug]) {
     const categoryName = CATEGORY_SLUG_MAP[categorySlug];
      filterToApply = { categoria: categoryName };
      console.log(`[CatalogByCategoryPage] Aplicando filtro mapeado: categoria = ${categoryName}`);
    } else {
      const normalizedCategories = allCars.map(c => c.categoria?.toLowerCase()).filter(Boolean);
      if (normalizedCategories.includes(categorySlug)) {
        filterToApply = { categoria: categorySlug };  console.log(`[CatalogByCategoryPage] Aplicando filtro directo (coincidencia): categoria = ${categorySlug}`); } 
    else {
       filterToApply = null;
        console.log(`[CatalogByCategoryPage] Slug '${categorySlug}' no corresponde a una categoría conocida.`);
      }
    }

    if (filterToApply) {
      applyFilters(filterToApply);
    } else {
        console.log(`[CatalogByCategoryPage] Slug no válido. Mostrando todo o mensaje de error.`);
      // resetFilters(); // Opción 1
    }

    // Cleanup: Resetear filtros al salir (opcional, depende de la UX deseada)
    // return () => {
    //   console.log(`[CatalogByCategoryPage] Reseteando filtros al salir de /catalog/category/${categorySlug}`);
    //   resetFilters();
    // };
  }, [categorySlug, applyFilters, resetFilters, allCars]); // Dependencias del efecto

  // --- Validación de Categoría ---
  // Verificar si la categoría solicitada es válida
  const isValidSlug = categorySlug === 'new' || 
                      CATEGORY_SLUG_MAP.hasOwnProperty(categorySlug) || 
                      allCars.some(c => c.categoria?.toLowerCase() === categorySlug);

  // Si no es válida, mostramos un mensaje
  if (!isValidSlug) {
    const validSlugs = Object.keys(CATEGORY_SLUG_MAP);
    console.log(`[CatalogByCategoryPage] Categoría '${categorySlug}' no encontrada. Slugs válidos:`, validSlugs);
    return (
      <div className="container py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Categoría no encontrada</h1>
        <p className="text-muted-foreground mb-2">
          Lo sentimos, la categoría &quot;{categorySlug}&quot; no existe.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          {/* Puedes listar categorías válidas aquí si lo deseas */}
          {/* Categorías disponibles: {validSlugs.join(', ')} */}
        </p>
        {/* <Button asChild> // Si tienes Button importado
          <Link href="/catalog">Volver al Catálogo</Link>
        </Button> */}
        <a href="/catalog" className="text-primary hover:underline">
          Volver al Catálogo
        </a>
      </div>
    );
  }
  // -----------------------------

  // Si el slug es válido, renderiza el contenido del catálogo.
  // Los filtros ya han sido aplicados por el useEffect.
  return <CatalogPageContent />;
}
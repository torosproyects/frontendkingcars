// components/catalog/CatalogFilters.tsx
import { useState, useEffect } from 'react';
import { useCarsStore } from '@/lib/store/cars-store';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

export function CatalogFilters() {
  const { allCars, filters, applyFilters } = useCarsStore();
  
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  // Obtener valores únicos para selects
  const makes = Array.from(new Set(allCars.map(car => car.marca))).filter(Boolean);
  const models = Array.from(new Set(allCars.map(car => car.modelo))).filter(Boolean);
  const categories = Array.from(new Set(allCars.map(car => car.categoria))).filter(Boolean);
  const colors = Array.from(new Set(allCars.flatMap(car => [car.colorExterior, car.colorExterior]))).filter(Boolean);

  const handleApplyFilters = () => {
    applyFilters(tempFilters);
  };

  return (
    <div className="space-y-6">
      {/* Marca */}
      <div>
        <Label htmlFor="make">Marca</Label>
        <Select
          // --- Corrección aquí ---
          value={tempFilters.make || "Todas las Marcas"} // Usa el valor del filtro o un valor por defecto
          // ---------------------
          onValueChange={(value) => setTempFilters({...tempFilters, make: value === "Todas las Marcas" ? undefined : value})}
        >
          <SelectTrigger id="make">
            <SelectValue placeholder="Seleccionar Marca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas las Marcas">Todas las Marcas</SelectItem>
            {makes.map(make => (
              <SelectItem key={make} value={make}>{make}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Modelo */}
      <div>
        <Label htmlFor="model">Modelo</Label>
        <Input
          id="model"
          type="text"
          placeholder="Buscar modelo..."
          value={tempFilters.model || ''} // Esto ya estaba bien
          onChange={(e) => setTempFilters({...tempFilters, model: e.target.value})}
        />
      </div>

      {/* Año */}
      <div>
        <Label>Año</Label>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            placeholder="Min"
            value={tempFilters.minYear || ''} // Esto ya estaba bien
            onChange={(e) => setTempFilters({...tempFilters, minYear: e.target.value ? parseInt(e.target.value) : undefined})}
            className="w-full"
          />
          <span>-</span>
          <Input
            type="number"
            placeholder="Max"
            value={tempFilters.maxYear || ''} // Esto ya estaba bien
            onChange={(e) => setTempFilters({...tempFilters, maxYear: e.target.value ? parseInt(e.target.value) : undefined})}
            className="w-full"
          />
        </div>
      </div>

      {/* Precio */}
      <div>
        <Label>Precio</Label>
        <Slider
          min={0}
          max={200000}
          step={1000}
          // --- Corrección aquí ---
          value={[tempFilters.minPrice || 0, tempFilters.maxPrice || 200000]} // Valores por defecto
          // ---------------------
          onValueChange={([min, max]) => setTempFilters({...tempFilters, minPrice: min, maxPrice: max})}
          className="my-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${(tempFilters.minPrice || 0).toLocaleString()}</span>
          <span>${(tempFilters.maxPrice || 200000).toLocaleString()}</span>
        </div>
      </div>

      {/* Categoría */}
      <div>
        <Label htmlFor="categoria">Categoría</Label>
        <Select
          // --- Corrección aquí ---
          value={tempFilters.categoria || "Todos las categorias"} // Proporciona un valor por defecto
          // ---------------------
          onValueChange={(value) => setTempFilters({...tempFilters, categoria: value === "Todos las categorias" ? undefined : value})}
        >
          <SelectTrigger id="categoria">
            <SelectValue placeholder="Seleccionar Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos las categorias">Todos las categorías</SelectItem>
            {categories
            .filter((cat): cat is string => !!cat)
            .map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color */}
      <div>
        <Label htmlFor="color">Color</Label>
        <Select
          // --- Corrección aquí ---
          value={tempFilters.color || "Todos los Colores"} // Usa el valor del filtro o un valor por defecto
          // ---------------------
          onValueChange={(value) => setTempFilters({...tempFilters, color: value === "Todos los Colores" ? undefined : value})}
        >
          <SelectTrigger id="color">
            <SelectValue placeholder="Seleccionar Color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos los Colores">Todos los Colores</SelectItem>
            {colors.map(color => (
              <SelectItem key={color} value={color}>{color}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Nuevo/Usado */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="nuevo"
          // --- Corrección aquí (aunque Checkbox debería manejar boolean | "indeterminate") ---
          checked={!!tempFilters.nuevo} // Convierte a boolean explícitamente
          // ---------------------
          onCheckedChange={(checked) => setTempFilters({...tempFilters, nuevo: checked as boolean})}
        />
        <Label htmlFor="nuevo">Mostrar solo vehículos nuevos</Label>
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-2">
        <Button onClick={handleApplyFilters} className="flex-grow">Aplicar Filtros</Button>
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect , useCallback} from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Search, X } from "lucide-react";
import { useCarsStore } from "@/lib/store/cars-store";
import { debounce } from "lodash";

interface FilterState {
  make?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  categoria?: string;
  color?: string;
  isNew?: boolean;
  searchTerm?: string;
}

const searchSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minYear: z.number().optional(),
  maxYear: z.number().optional(),
  bodyType: z.string().optional(),
  categoria: z.string().optional(),
  fuelType: z.string().optional(),
  searchTerm: z.string().optional(),
  color: z.string().optional(),
});

type SearchValues = z.infer<typeof searchSchema>;

const currentYear = new Date().getFullYear();
const yearRange = Array.from(
  { length: 30 },
  (_, i) => currentYear - i
);

const makeOptions = [
  { value: "all", label: "Todas las Marcas" },
  { value: "Audi", label: "Audi" },
  { value: "BMW", label: "BMW" },
  { value: "Ford", label: "Ford" },
  { value: "Honda", label: "Honda" },
  { value: "Lexus", label: "Lexus" },
  { value: "Mercedes-Benz", label: "Mercedes-Benz" },
  { value: "Porsche", label: "Porsche" },
  { value: "Tesla", label: "Tesla" },
  { value: "Toyota", label: "Toyota" },
  { value: "Volkswagen", label: "Volkswagen" },
];

const bodyTypeOptions = [
  { value: "all", label: "Todos los Tipos" },
  { value: "Sedán", label: "Sedán" },
  { value: "SUV", label: "SUV" },
  { value: "Coupé", label: "Coupé" },
  { value: "Convertible", label: "Convertible" },
  { value: "Hatchback", label: "Hatchback" },
  { value: "Familiar", label: "Familiar" },
  { value: "Camioneta", label: "Camioneta" },
  { value: "Van", label: "Van" },
];

const fuelTypeOptions = [
  { value: "all", label: "Todos los Combustibles" },
  { value: "Gasolina", label: "Gasolina" },
  { value: "Diésel", label: "Diésel" },
  { value: "Híbrido", label: "Híbrido" },
  { value: "Eléctrico", label: "Eléctrico" },
  { value: "Híbrido Enchufable", label: "Híbrido Enchufable" },
];

export function SearchFilters() {
  const { filters, applyFilters, resetFilters } = useCarsStore();
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 200000
  ]);

  const form = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      make: filters.make || "all",
      model: filters.model || "all",
      minPrice: filters.minPrice || 0,
      maxPrice: filters.maxPrice || 200000,
      minYear: filters.minYear || yearRange[yearRange.length - 1],
      maxYear: filters.maxYear || currentYear,
      categoria: filters.categoria || "all",
      color: filters.color || "all",
      searchTerm: filters.searchTerm || "",
    },
  });
   const debouncedApplyFilters = useCallback(
    debounce((filters: Partial<FilterState>) => {
      applyFilters(filters);
    }, 500),
    [applyFilters]
  );

   // Actualizar el formulario cuando los filtros cambian externamente
  useEffect(() => {
    form.reset({
      make: filters.make || "all",
      model: filters.model || "",
      minPrice: filters.minPrice || 0,
      maxPrice: filters.maxPrice || 200000,
      minYear: filters.minYear || yearRange[yearRange.length - 1],
      maxYear: filters.maxYear || currentYear,
      categoria: filters.categoria || "all",
      color: filters.color || "all",
      searchTerm: filters.searchTerm || "",
    });
    setPriceRange([
      filters.minPrice || 0,
      filters.maxPrice || 200000
    ]);
  }, []);
  const handleFieldChange = (fieldName: keyof SearchValues, value: any) => {
    form.setValue(fieldName, value);
    
    const currentValues = form.getValues();
    const filtersToApply = {
      make: currentValues.make === "all" ? undefined : currentValues.make,
      model: currentValues.model || undefined,
      minPrice: currentValues.minPrice,
      maxPrice: currentValues.maxPrice,
      minYear: currentValues.minYear,
      maxYear: currentValues.maxYear,
      categoria: currentValues.categoria === "all" ? undefined : currentValues.categoria,
      color: currentValues.color === "all" ? undefined : currentValues.color,
      searchTerm: currentValues.searchTerm || undefined,
    };
    
    debouncedApplyFilters(filtersToApply);
  };
  const handleClearFilters = () => {
    resetFilters();
    form.reset({
      make: "all",
      model: "",
      minPrice: 0,
      maxPrice: 200000,
      minYear: yearRange[yearRange.length - 1],
      maxYear: currentYear,
      categoria: "all",
      color: "all",
      searchTerm: "",
    });
    setPriceRange([0, 200000]);
  };

  const hasActiveFilters = Object.values(filters).some(
    value => value !== undefined && value !== "" && value !== 0
  );

  return (
    <Form {...form}>
      <form className="w-full">
        {/* Búsqueda General */}
        <div className="mb-4">
          <FormField
            control={form.control}
            name="searchTerm"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="searchTerm">Búsqueda General</Label>
                <div className="relative">
                  <FormControl>
                    <Input
                      id="searchTerm"
                      placeholder="Buscar por marca, modelo, tipo..."
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("searchTerm", e.target.value);
                      }}
                      className="pl-10"
                    />
                  </FormControl>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="make">Marca</Label>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleFieldChange("make", value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger id="make">
                      <SelectValue placeholder="Seleccionar marca" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {makeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="model">Modelo</Label>
                <FormControl>
                  <Input
                    id="model"
                    placeholder="Cualquier modelo"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minYear"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="minYear">Año Mínimo</Label>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString() || yearRange[yearRange.length - 1].toString()}
                >
                  <FormControl>
                    <SelectTrigger id="minYear">
                      <SelectValue placeholder="Año Mínimo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {yearRange.map((year) => (
                      <SelectItem key={`min-${year}`} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
                className="px-3"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Limpiar filtros</span>
              </Button>
            )}
          </div>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="advanced-filters" className="border-none">
            <AccordionTrigger className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Filtros Avanzados
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                <div className="space-y-2">
                  <Label>Rango de Precio (USD)</Label>
                  <div className="pt-6 px-2">
                    <Slider
                      value={priceRange}
                      max={200000}
                      step={1000}
                      minStepsBetweenThumbs={1}
                      onValueChange={(value) => {
                        setPriceRange(value as [number, number]);
                        form.setValue("minPrice", value[0], { shouldDirty: true });
                        form.setValue("maxPrice", value[1], { shouldDirty: true });
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0].toLocaleString()}</span>
                    <span>${priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
                              
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}
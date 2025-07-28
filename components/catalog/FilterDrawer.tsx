// components/catalog/FilterDrawer.tsx
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { CatalogFilters } from '@/components/catalog/CatalogFilters';
import { Button } from '@/components/ui/button';
import { useCarsStore } from '@/lib/store/cars-store';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { resetFilters } = useCarsStore();

  const handleResetAndClose = () => {
    resetFilters();
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Filtros</DrawerTitle>
            <DrawerDescription>Refina tu búsqueda de vehículos.</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <CatalogFilters />
          </div>
          <DrawerFooter>
            <Button onClick={onClose}>Ver Resultados</Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={handleResetAndClose}>Limpiar Filtros</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

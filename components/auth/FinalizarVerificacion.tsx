'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore} from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';

export function FinalizarVerificacion() {
  const router = useRouter();
  const { toast } = useToast();
 const refreshUser = useAuthStore((state) => state.refreshUser);

  const handleFinalizar = async () => {
    
    toast({
      title: 'Verificando...',
      description: 'Actualizando tu perfil. Por favor espera...',
    });

    try {
      await refreshUser();

      await new Promise((resolve) => {
        router.refresh();
        setTimeout(resolve, 100); // delay para evitar transición vacía
      });

      toast({
        title: '¡Verificación completada!',
        description: 'Tu cuenta ha sido actualizada exitosamente.',
      });

      router.push('/');
    } catch (error) {
      
      toast({
        title: 'Error al verificar',
        description: 'Ocurrió un error al actualizar tu sesión.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button onClick={handleFinalizar} className="mt-6 w-full">
      Finalizar verificación
    </Button>
  );
} 
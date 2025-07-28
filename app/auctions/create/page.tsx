'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Gavel } from 'lucide-react';
import { CreateAuctionForm } from '@/components/auction/create-auction-form';

export default function CreateAuctionPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    // Redirigir después de 3 segundos
    setTimeout(() => {
      router.push('/auctions');
    }, 3000);
  };

  const handleCancel = () => {
    router.back();
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Subasta creada exitosamente!
            </h2>
            <p className="text-gray-600 mb-6">
              Tu subasta ha sido publicada y ya está disponible para los compradores.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/auctions')}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600"
              >
                Ver todas las subastas
              </Button>
              <Button 
                onClick={() => router.push('/profile/auctions')}
                variant="outline"
                className="w-full"
              >
                Ver mis subastas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex items-center gap-2 hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <Gavel className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Crear Nueva Subasta
            </h1>
          </div>

          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Form */}
        {user ? (
        <CreateAuctionForm
          currentUser={{ id: user.id, name: user.name }}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
        ) : (
            <div>Por favor inicia sesión</div>
        )}
      </div>
    </div>
  );
}
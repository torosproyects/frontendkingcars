'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gavel, TrendingUp, AlertCircle } from 'lucide-react';
import { Auction } from '@/lib/types/auction';
import { useAuctionStore } from '@/lib/store/auctions-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from "next/navigation"

interface BidFormProps {
  auction: Auction;
  onBidSuccess?: () => void;
}

export function BidForm({ auction, onBidSuccess }: BidFormProps) {
   const router = useRouter()
  const { placeBid, loading, error } = useAuctionStore();
  const { user , seLogueo} = useAuthStore();
  const [bidAmount, setBidAmount] = useState('');
  const [localError, setLocalError] = useState('');

  const minBidAmount = auction.currentBid + 100; // Incremento mínimo de $100
  const suggestedBids = [
    minBidAmount,
    minBidAmount + 500,
    minBidAmount + 1000,
    minBidAmount + 2000,
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!seLogueo) {
      setLocalError('Debes iniciar sesión para pujar');
      return;
    }

    const amount = parseInt(bidAmount);
    
    if (isNaN(amount) || amount < minBidAmount) {
      setLocalError(`La puja mínima es $${minBidAmount.toLocaleString()}`);
      return;
    }
    if(user)
    if (auction.highestBidder === user.id) {
      setLocalError('Ya eres el mejor postor en esta subasta');
      return;
    }

    setLocalError('');

    try {
      if(user){
       await placeBid(auction.id, amount, user.id, user.name);
       setBidAmount('');
       onBidSuccess?.();
    }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Error al procesar la puja');
    }
  };

  const handleSuggestedBid = (amount: number) => {
    setBidAmount(amount.toString());
    setLocalError('');
  };

  if (!seLogueo) {
    return (
      <Card className="border-orange-200 bg-orange-50/50">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg text-gray-900 mb-2">
            Inicia sesión para pujar
          </h3>
          <p className="text-gray-600 mb-4">
            Necesitas tener una cuenta para participar en las subastas
          </p>
          <Button 
            onClick={() => router.push('/auth/login')}
            className="bg-orange-500 hover:bg-orange-600 text-white">
            Iniciar Sesión
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (auction.status !== 'active') {
    return (
      <Card className="border-gray-200 bg-gray-50/50">
        <CardContent className="p-6 text-center">
          <Gavel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-lg text-gray-900 mb-2">
            {auction.status === 'ended' ? 'Subasta Finalizada' : 'Subasta Próxima'}
          </h3>
          <p className="text-gray-600">
            {auction.status === 'ended' 
              ? 'Esta subasta ha terminado' 
              : 'Esta subasta aún no ha comenzado'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50/50 to-blue-50/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
          <Gavel className="h-5 w-5 text-green-600" />
          Realizar Puja
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Bid Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Puja actual</p>
              <p className="text-2xl font-bold text-green-600">
                ${auction.currentBid.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Puja mínima</p>
              <p className="text-lg font-semibold text-gray-900">
                ${minBidAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Bid Buttons */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Pujas sugeridas
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {suggestedBids.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedBid(amount)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
              >
                ${amount.toLocaleString()}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Bid Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bidAmount" className="text-sm font-medium text-gray-700">
              O ingresa tu puja personalizada
            </Label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">$</span>
              </div>
              <Input
                id="bidAmount"
                type="number"
                value={bidAmount}
                onChange={(e) => {
                  setBidAmount(e.target.value);
                  setLocalError('');
                }}
                placeholder={minBidAmount.toString()}
                min={minBidAmount}
                className="pl-8 text-lg font-semibold"
                disabled={loading}
              />
            </div>
          </div>

          {(localError || error) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{localError || error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            disabled={loading || !bidAmount}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Procesando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Pujar ${bidAmount ? parseInt(bidAmount).toLocaleString() : '0'}
              </div>
            )}
          </Button>
        </form>

        {/* Warning */}
        <div className="text-xs text-gray-500 text-center">
          Al pujar, aceptas nuestros términos y condiciones de subasta
        </div>
      </CardContent>
    </Card>
  );
}
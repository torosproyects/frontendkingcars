'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Car, 
  Calendar, 
  Gauge, 
  Palette,
  FileText,
  Crown,
  Users,
  TrendingUp,
  Clock
} from 'lucide-react';
import { AuctionCountdown } from '@/components/auction/auction-countdown';
import { BidForm } from '@/components/auction/bid-form';
import { BidHistory } from '@/components/auction/bid-history';
import { useAuctionStore, useAuctionWebSocket } from '@/lib/store/auctions-store';
import { useAuthStore} from '@/lib/store/auth-store';
import { Auction, Bid } from '@/lib/types/auction';
import { ApiService } from '@/lib/service/api-service';


export default function AuctionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, seLogueo } = useAuthStore();
  const { 
    currentAuction, 
    fetchAuction, 
    joinAuction,
    leaveAuction,
    toggleWatch, 
    loading, 
    error
  } = useAuctionStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Conectar WebSocket
  const { connectionStatus } = useAuctionWebSocket(user?.id);

  const auctionId = params.id as string;

  useEffect(() => {
    if (auctionId) {
      fetchAuction(auctionId);
      
      // Unirse a la subasta para recibir actualizaciones en tiempo real
      if (seLogueo) {
        joinAuction(auctionId);
      }
      
      // Cleanup: salir de la subasta al desmontar
      return () => {
        if (seLogueo) {
          leaveAuction(auctionId);
        }
      };
    }
  }, [auctionId, fetchAuction, joinAuction, leaveAuction, seLogueo]);

  const handleWatchToggle = useCallback(async () => {
    if (!currentAuction || !seLogueo) return;
    
    try {
        if(user)
         await toggleWatch(currentAuction.id, user.id);
    } catch (error) {
      console.error('Error toggling watch:', error);
    }
  }, [currentAuction, toggleWatch, user, seLogueo]);

  const handleBidSuccess = useCallback(() => {
    // Refrescar datos de la subasta después de una puja exitosa
    if (auctionId) {
      fetchAuction(auctionId);
    }
  }, [auctionId, fetchAuction]);

  const handleAuctionEnd = useCallback(() => {
    // Refrescar datos cuando termine la subasta
    if (auctionId) {
      fetchAuction(auctionId);
    }
  }, [auctionId, fetchAuction]);

  if (loading || !currentAuction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cargando subasta...</h3>
            <p className="text-gray-600">Por favor espera un momento</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => fetchAuction(auctionId)}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { car } = currentAuction;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Subastas
          </Button>

          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWatchToggle}
              className="flex items-center gap-2 hover:bg-white/50"
            >
              <Heart
                className={
                  currentAuction.isWatched 
                    ? 'h-4 w-4 fill-red-500 text-red-500' 
                    : 'h-4 w-4 text-gray-600'
                }
              />
              {currentAuction.isWatched ? 'Observando' : 'Observar'}
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-white/50">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Connection Status */}
          {connectionStatus !== 'connected' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-yellow-800 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                {connectionStatus === 'connecting' ? 'Conectando...' : 'Modo offline - Datos pueden no estar actualizados'}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-white/20">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={car.images[selectedImageIndex] || car.images[0]}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-96 object-cover"
                  />
                  <Badge 
                    className={`absolute top-4 left-4 ${
                      currentAuction.status === 'active' 
                        ? 'bg-green-500' 
                        : currentAuction.status === 'upcoming'
                        ? 'bg-blue-500'
                        : 'bg-gray-500'
                    } text-white`}
                  >
                    {currentAuction.status === 'active' && 'Subasta Activa'}
                    {currentAuction.status === 'upcoming' && 'Próximamente'}
                    {currentAuction.status === 'ended' && 'Finalizada'}
                  </Badge>
                </div>

                {car.images.length > 1 && (
                  <div className="p-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {car.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImageIndex === index
                              ? 'border-blue-500'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Vista ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Car Details */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Car className="h-6 w-6 text-blue-600" />
                  {car.year} {car.make} {car.model}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Detalles</TabsTrigger>
                    <TabsTrigger value="description">Descripción</TabsTrigger>
                    <TabsTrigger value="history">Historial</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-gray-600">Año</div>
                          <div className="font-semibold">{car.year}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                        <Gauge className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="text-sm text-gray-600">Kilometraje</div>
                          <div className="font-semibold">{car.mileage.toLocaleString()} km</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                        <Palette className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="text-sm text-gray-600">Color</div>
                          <div className="font-semibold capitalize">{car.color}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                        <Crown className="h-5 w-5 text-yellow-600" />
                        <div>
                          <div className="text-sm text-gray-600">Condición</div>
                          <div className="font-semibold capitalize">{car.condition}</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="description" className="mt-4">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-gray-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Descripción del Vehículo</h4>
                        <p className="text-gray-700 leading-relaxed">{car.description}</p>
                        <div className="mt-4 p-3 bg-blue-50/50 rounded-lg">
                          <div className="text-sm text-blue-700 font-medium">Valor Estimado</div>
                          <div className="text-xl font-bold text-blue-800">
                            ${car.estimatedValue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">Historial de la Subasta</h4>
                      </div>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg">
                          <span>Subasta iniciada</span>
                          <span>{new Date(currentAuction.startTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg">
                          <span>Precio inicial</span>
                          <span className="font-semibold">${currentAuction.startPrice.toLocaleString()}</span>
                        </div>
                        {currentAuction.reservePrice && (
                          <div className="flex justify-between items-center p-3 bg-yellow-50/50 rounded-lg">
                            <span>Precio de reserva</span>
                            <span className="font-semibold text-yellow-700">
                              ${currentAuction.reservePrice.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Countdown */}
            {currentAuction.status === 'active' && (
              <AuctionCountdown
                endTime={currentAuction.endTime}
                auctionId={currentAuction.id}
                onTimeUp={handleAuctionEnd}
              />
            )}

            {/* Current Bid Info */}
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Estado Actual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Puja más alta</div>
                  <div className="text-3xl font-bold text-green-600">
                    ${currentAuction.currentBid.toLocaleString()}
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{currentAuction.bidCount} pujas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{currentAuction.watchers} observando</span>
                  </div>
                </div>

                {currentAuction.highestBidderName && (
                  <div className="p-3 bg-white/60 rounded-lg">
                    <div className="text-sm text-gray-600">Mejor postor actual</div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      {currentAuction.highestBidder === user?.id 
                        ? 'Tú' 
                        : currentAuction.highestBidderName}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bid Form */}
            <BidForm
              auction={currentAuction}
              onBidSuccess={handleBidSuccess}
            />

            {/* Bid History */}
            <BidHistory
              bids={currentAuction.bids}
              currentUserId={user?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
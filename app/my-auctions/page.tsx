'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Plus, 
  Car, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Eye,
  Gavel,
  Calendar,
  Users
} from 'lucide-react';
import { useAuctionStore } from '@/lib/store/auctions-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { Auction } from '@/lib/types/auction';
import { cn } from '@/lib/utils';

export default function MyAuctionsPage() {
  const router = useRouter();
  const { auctions, getUserAuctions } = useAuctionStore();
  const { user, seLogueo } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState('all');
  const [userAuctions, setUserAuctions] = useState<Auction[]>([]);

  // Verificar autenticación y cargar subastas del usuario
  useEffect(() => {
    if (!seLogueo) {
      router.push('/auth/login');
    } else if (user) {
      setUserAuctions(getUserAuctions(user.id));
    }
  }, [seLogueo, router, user, getUserAuctions]);

  if (!seLogueo) {
    return null; // Evitar flash de contenido
  }

  const getStatusColor = (status: Auction['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 text-white';
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'ended':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: Auction['status']) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'upcoming':
        return 'Próxima';
      case 'ended':
        return 'Finalizada';
      default:
        return status;
    }
  };

  const filterAuctions = (status?: string) => {
    if (!status || status === 'all') return userAuctions;
    return userAuctions.filter((auction: Auction) => auction.status === status);
  };

  const getTabCounts = () => {
    return {
      all: userAuctions.length,
      active: userAuctions.filter((a: Auction) => a.status === 'active').length,
      upcoming: userAuctions.filter((a: Auction) => a.status === 'upcoming').length,
      ended: userAuctions.filter((a: Auction) => a.status === 'ended').length,
    };
  };

  const tabCounts = getTabCounts();

  const getTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Finalizada';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }

    return `${hours}h ${minutes}m`;
  };

  const getTotalEarnings = () => {
    return userAuctions
      .filter((auction: Auction) => auction.status === 'ended' && auction.currentBid > (auction.reservePrice || 0))
      .reduce((total: number, auction: Auction) => total + auction.currentBid, 0);
  };

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
            Volver
          </Button>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <Gavel className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Mis Subastas
            </h1>
          </div>

          <Button
            onClick={() => router.push('/auctions/create')}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Subasta
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Car className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{tabCounts.all}</div>
              <div className="text-sm text-gray-600">Total Subastas</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{tabCounts.active}</div>
              <div className="text-sm text-gray-600">Activas</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{tabCounts.upcoming}</div>
              <div className="text-sm text-gray-600">Próximas</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                ${getTotalEarnings().toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Ganancias</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="all" className="flex items-center gap-2">
              Todas
              <Badge variant="secondary" className="ml-1 text-xs">
                {tabCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              Activas
              <Badge variant="secondary" className="ml-1 text-xs bg-green-100 text-green-700">
                {tabCounts.active}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Próximas
              <Badge variant="secondary" className="ml-1 text-xs">
                {tabCounts.upcoming}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="ended">
              Finalizadas
              <Badge variant="secondary" className="ml-1 text-xs">
                {tabCounts.ended}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {['all', 'active', 'upcoming', 'ended'].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              <div className="space-y-4">
                {filterAuctions(tab).map((auction: Auction) => (
                  <Card key={auction.id} className="bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Car Image */}
                        <div className="relative">
                          <img
                            src={auction.car.images[0]}
                            alt={`${auction.car.make} ${auction.car.model}`}
                            className="w-full md:w-32 h-32 object-cover rounded-lg"
                          />
                          <Badge className={cn("absolute top-2 left-2", getStatusColor(auction.status))}>
                            {getStatusText(auction.status)}
                          </Badge>
                        </div>

                        {/* Auction Info */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {auction.car.year} {auction.car.make} {auction.car.model}
                            </h3>
                            <p className="text-gray-600">
                              {auction.car.mileage.toLocaleString()} km • {auction.car.color}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Precio inicial</p>
                              <p className="font-semibold">${auction.startPrice.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Puja actual</p>
                              <p className="font-semibold text-green-600">
                                ${auction.currentBid.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Pujas</p>
                              <p className="font-semibold flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {auction.bidCount}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Observadores</p>
                              <p className="font-semibold flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {auction.watchers}
                              </p>
                            </div>
                          </div>

                          {auction.status === 'active' && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-orange-500" />
                              <span className="text-orange-600 font-medium">
                                Termina en: {getTimeRemaining(auction.endTime)}
                              </span>
                            </div>
                          )}

                          {auction.status === 'upcoming' && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="text-blue-600 font-medium">
                                Inicia: {new Date(auction.startTime).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => router.push(`/auctions/${auction.id}`)}
                            variant="outline"
                            size="sm"
                          >
                            Ver Detalles
                          </Button>
                          {auction.status === 'active' && (
                            <Button
                              onClick={() => router.push(`/auctions/${auction.id}`)}
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-green-600"
                            >
                              Monitorear
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filterAuctions(tab).length === 0 && (
                  <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                    <CardContent className="p-12 text-center">
                      <Gavel className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No tienes subastas {tab === 'all' ? '' : tab === 'active' ? 'activas' : tab === 'upcoming' ? 'próximas' : 'finalizadas'}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {tab === 'all' 
                          ? 'Crea tu primera subasta para comenzar a vender tus carros'
                          : `No hay subastas ${tab === 'active' ? 'activas' : tab === 'upcoming' ? 'próximas' : 'finalizadas'} en este momento`}
                      </p>
                      {tab === 'all' && (
                        <Button
                          onClick={() => router.push('/auctions/create')}
                          className="bg-gradient-to-r from-green-600 to-blue-600 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Crear Primera Subasta
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
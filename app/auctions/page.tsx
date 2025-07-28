'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  SortDesc, 
  Car, 
  Clock, 
  TrendingUp,
  Eye,
  Gavel
} from 'lucide-react';
import { AuctionCard } from '@/components/auction/auction-card';
import { useAuctionStore, useAuctionWebSocket } from '@/lib/store/auctions-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { Auction } from '@/lib/types/auction';
import { useRouter } from 'next/navigation';

export default function AuctionsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    auctions, 
    watchedAuctions, 
    fetchAuctions, 
    isLoading, 
    error,
    connectionStatus
  } = useAuctionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  
  // Conectar WebSocket
  useAuctionWebSocket(user?.id);

  useEffect(() => {
    // Cargar datos iniciales
    fetchAuctions();
  }, [fetchAuctions]);

  const filterAuctions = (auctions: Auction[], status?: string) => {
    let filtered = auctions;

    if (status && status !== 'all') {
      if (status === 'watched') {
        filtered = auctions.filter(auction => watchedAuctions.includes(auction.id));
      } else {
        filtered = auctions.filter(auction => auction.status === status);
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(auction =>
        auction.car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.car.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const handleViewAuctionDetails = useCallback((auction: Auction) => {
    router.push(`/auctions/${auction.id}`);
  }, [router]);

  const getTabCounts = () => {
    return {
      all: auctions.length,
      active: auctions.filter(a => a.status === 'active').length,
      upcoming: auctions.filter(a => a.status === 'upcoming').length,
      ended: auctions.filter(a => a.status === 'ended').length,
      watched: auctions.filter(a => watchedAuctions.includes(a.id)).length,
    };
  };

  const tabCounts = getTabCounts();

  // Loading state
  if (isLoading && auctions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cargando subastas...</h3>
            <p className="text-gray-600">Obteniendo las mejores ofertas para ti</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Error Alert */}
        {error && (
          <Card className="border-red-200 bg-red-50/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{error}</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={fetchAuctions}
                  className="ml-auto"
                >
                  Reintentar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connection Status */}
        {connectionStatus !== 'connected' && (
          <Card className="border-yellow-200 bg-yellow-50/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-800 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                {connectionStatus === 'connecting' ? '🔄 Conectando en tiempo real...' : '📡 Modo offline - Actualizaciones limitadas'}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full">
              <Gavel className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Subastas de Carros
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra los mejores carros en subasta y participa para conseguir el tuyo al mejor precio
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Car className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{auctions.length}</div>
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
              <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{tabCounts.watched}</div>
              <div className="text-sm text-gray-600">Observando</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por marca o modelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-white/50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline" size="sm" className="bg-white/50">
                  <SortDesc className="h-4 w-4 mr-2" />
                  Ordenar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/50"
                  onClick={fetchAuctions}
                  disabled={isLoading}
                >
                  {isLoading ? 'Actualizando...' : 'Actualizar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
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
            <TabsTrigger value="watched">
              Observando
              <Badge variant="secondary" className="ml-1 text-xs bg-purple-100 text-purple-700">
                {tabCounts.watched}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {['all', 'active', 'upcoming', 'ended', 'watched'].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterAuctions(auctions, tab).map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    onViewDetails={handleViewAuctionDetails}
                  />
                ))}
              </div>

              {filterAuctions(auctions, tab).length === 0 && (
                <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                  <CardContent className="p-12 text-center">
                    <Gavel className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No hay subastas disponibles
                    </h3>
                    <p className="text-gray-600">
                      {tab === 'watched' 
                        ? 'No tienes subastas en observación'
                        : `No hay subastas ${tab === 'all' ? '' : tab === 'active' ? 'activas' : tab === 'upcoming' ? 'próximas' : 'finalizadas'} en este momento`}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
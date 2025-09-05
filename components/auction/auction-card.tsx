'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Heart, Car, DollarSign } from 'lucide-react';
import { Auction } from '@/lib/types/auction';
import { useAuctionStore } from '@/lib/store/auctions-store';
import { cn } from '@/lib/utils';

interface AuctionCardProps {
  auction: Auction;
  onViewDetails: (auction: Auction) => void;
}

export function AuctionCard({ auction, onViewDetails }: AuctionCardProps) {
  const { watchAuction, unwatchAuction } = useAuctionStore();
  const [imageLoaded, setImageLoaded] = useState(false);
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

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(auction.endTime);
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

  const handleWatchToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (auction.isWatched) {
      unwatchAuction(auction.id);
    } else {
      watchAuction(auction.id);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white/80 backdrop-blur-sm border border-white/20">
      <div className="relative">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <Image
        src={auction.car.imagen || 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800'}
        alt={`${auction.car.make} ${auction.car.model}`}
        fill
        className={cn(
          'object-cover transition-all duration-500',
          imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
        )}
        onLoadingComplete={() => setImageLoaded(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Status Badge */}
        <Badge className={cn("absolute top-3 left-3", getStatusColor(auction.status))}>
          {auction.status === 'active' && 'Activa'}
          {auction.status === 'upcoming' && 'Próxima'}
          {auction.status === 'ended' && 'Finalizada'}
        </Badge>

        {/* Watch Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
          onClick={handleWatchToggle}
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-colors',
              auction.isWatched ? 'fill-red-500 text-red-500' : 'text-gray-600'
            )}
          />
        </Button>

        {/* Time Remaining */}
        {auction.status === 'active' && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-900">
            <Clock className="h-3 w-3" />
            {getTimeRemaining()}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Car Info */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {auction.car.year} {auction.car.make} {auction.car.model}
            </h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Car className="h-3 w-3" />
                {auction.car.mileage.toLocaleString()} km
              </div>
              <span className="text-gray-400">•</span>
              <span className="capitalize">{auction.car.condition}</span>
            </div>
          </div>

          {/* Bidding Info */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <DollarSign className="h-3 w-3" />
                <span>Puja actual</span>
              </div>
              <div className="font-bold text-xl text-green-600">
                ${auction.currentBid.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">{auction.bidCount} pujas</div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Eye className="h-3 w-3" />
                {auction.watchers} observando
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => onViewDetails(auction)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md transition-all duration-200"
            disabled={auction.status === 'ended'}
          >
            {auction.status === 'ended' ? 'Ver Resultado' : 'Pujar Ahora'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
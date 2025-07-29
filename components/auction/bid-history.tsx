'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, Crown, TrendingUp } from 'lucide-react';
import { Bid } from '@/lib/types/auction';
import { cn } from '@/lib/utils';

interface BidHistoryProps {
  bids: Bid[];
  currentUserId?: string;
}

export function BidHistory({ bids, currentUserId }: BidHistoryProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `hace ${days}d`;
    if (hours > 0) return `hace ${hours}h`;
    if (minutes > 0) return `hace ${minutes}m`;
    return 'hace un momento';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (bids.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Historial de Pujas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aún no hay pujas en esta subasta</p>
            <p className="text-sm">¡Sé el primero en pujar!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Historial de Pujas ({bids.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {bids.map((bid, index) => (
            <div
              key={bid.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg border transition-all duration-200',
                index === 0
                  ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-sm'
                  : 'bg-gray-50/50 border-gray-200',
                bid.userId === currentUserId
                  ? 'ring-2 ring-blue-200 bg-blue-50/50'
                  : ''
              )}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={cn(
                      'text-xs font-semibold',
                      index === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    )}>
                      {getInitials(bid.userName || "sinnom")}
                    </AvatarFallback>
                  </Avatar>
                  {index === 0 && (
                    <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 fill-yellow-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'font-medium',
                      bid.userId === currentUserId ? 'text-blue-700' : 'text-gray-900'
                    )}>
                      {bid.userId === currentUserId ? 'Tú' : bid.userName}
                    </span>
                    {index === 0 && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        Mejor Puja
                      </Badge>
                    )}
                    {bid.userId === currentUserId && (
                      <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">
                        Tu Puja
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(bid.timestamp)}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={cn(
                  'font-bold text-lg',
                  index === 0 ? 'text-green-600' : 'text-gray-900'
                )}>
                  ${bid.amount.toLocaleString()}
                </div>
                {index > 0 && (
                  <div className="text-xs text-gray-500">
                    +${(bid.amount - bids[index - 1]?.amount || 0).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {bids.length > 5 && (
          <div className="text-center mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Mostrando las últimas {Math.min(bids.length, 10)} pujas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import { ApiService } from '@/lib/service/api-service';

export async function generateStaticParams() {
  try {
    // Intentar obtener subastas de la API
    const auctions = await ApiService.getAuctions();
    return auctions.map((auction: any) => ({
      id: auction.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Fallback a IDs estáticos si la API falla
    return [
      { id: 'auction-1' },
      { id: 'auction-2' },
      { id: 'auction-3' },
      { id: 'auction-4' },
      { id: 'auction-5' },
      { id: 'auction-1753114493115' },
    ];
  }
}

export default function AuctionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
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
    return []
    ;
  }
}

export default function AuctionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
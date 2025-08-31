'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gavel } from 'lucide-react';
import { CreateAuctionForm } from '@/components/auction/create-auction-form';
import { useAuctionStore } from '@/lib/store/auctions-store';
import { useEffect } from 'react';

export default function CreateAuctionPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { loadUserCars } = useAuctionStore();

    useEffect(() => {
        if (user) {
            loadUserCars(user.id);
        }
    }, [user, loadUserCars]);

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" onClick={handleCancel} className="flex items-center gap-2 hover:bg-white/50">
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
                    <div className="w-20" />
                </div>
                {user ? (
                    <CreateAuctionForm currentUser={{ id: user.id, name: user.name }} />
                ) : (
                    <div className="text-center p-8">Por favor inicia sesión</div>
                )}
            </div>
        </div>
    );
}
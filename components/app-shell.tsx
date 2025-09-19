"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isDealer } = useAuthStore();
  const isTaller = isDealer();
  const isTallerRoute = pathname?.startsWith('/taller');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      {!(isTaller || isTallerRoute) && <Footer />}
    </div>
  );
}



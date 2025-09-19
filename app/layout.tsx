import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import  CarsProvider  from '@/components/providers/cars-provider';
import AppShell from '@/components/app-shell';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CarsKing - Catálogo Premium de Autos',
  description: 'Descubre el auto de tus sueños en nuestro catálogo premium. Compra, vende y encuentra tu vehículo ideal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
        <CarsProvider>
          <AuthProvider>
              <AppShell>
                {children}
              </AppShell>
              <Toaster />
           </AuthProvider>
         </CarsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
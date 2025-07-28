import Link from "next/link";
import { Car, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Image from 'next/image';
import logo from '@/public/logonegr.png';

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
  <Image 
    src={logo} 
    alt="CarsKing Logo" 
    width={80}
    height={80}
    className="object-contain"
  />
  
</div>
            <p className="text-muted-foreground mb-4">
              Descubre tu vehículo perfecto con nuestra selección premium de autos.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-base mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-muted-foreground hover:text-primary">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  Acerca de Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contacto
                </Link>
              </li>
              
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-base mb-4">Categorías de Vehículos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog/category/sedan" className="text-muted-foreground hover:text-primary">
                  Sedanes
                </Link>
              </li>
              <li>
                <Link href="/catalog/category/SUV" className="text-muted-foreground hover:text-primary">
                  SUVs
                </Link>
              </li>
              <li>
                <Link href="/catalog/category/truck" className="text-muted-foreground hover:text-primary">
                  Camionetas
                </Link>
              </li>
              <li>
                <Link href="/catalog/category/coupe" className="text-muted-foreground hover:text-primary">
                  Lujo
                </Link>
              </li>
              <li>
                <Link href="/catalog/category/pickup" className="text-muted-foreground hover:text-primary">
                  Eléctricos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-base mb-4">Contacto</h3>
            <address className="not-italic text-muted-foreground space-y-2">
              <p>Av. La Rambla 123</p>
              <p>Ciudad de Madrid, CA 12345</p>
              <p>España</p>
              <p className="pt-2">
                <a href="tel:+345551234567" className="hover:text-primary">
                  (34) 5123-4567
                </a>
              </p>
              <p>
                <a href="mailto:info@CarsKing.com" className="hover:text-primary">
                  info@CarsKing.com
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} CarsKing. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm">
              Política de Privacidad
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary text-sm">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
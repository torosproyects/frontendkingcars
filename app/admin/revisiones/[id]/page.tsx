"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { approveCar, rejectCar } from "@/lib/api/carroapi";
import { Carro } from "@/types/carro";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, CheckCircle, ArrowLeft, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function CarroDetallesPage() {
  const router = useRouter();
  const [car, setCar] = useState<Carro | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      try {
        const storedCars = localStorage.getItem("pendingCars");
        if (storedCars) {
          const cars: Carro[] = JSON.parse(storedCars);
                    
          const foundCar = cars.find((c) => c.id.toString() === id);
          if (foundCar) {
            setCar(foundCar);
          } else {
            setError("Vehículo no encontrado en la lista.");
          }
        } else {
          setError("No se pudo cargar la lista de vehículos. Intente volver a la página de revisiones.");
        }
      } catch (err) {
        console.error("Error retrieving car from localStorage:", err);
        setError("Error al cargar los datos del vehículo.");
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  const handleAction = async (action: "accept" | "reject") => {
    setIsProcessing(true);
    setError(null);
    try {
      if (action === "accept") {
        await approveCar(id as string);
        alert("Vehículo aceptado con éxito.");
      } else {
        await rejectCar(id as string);
        alert("Vehículo rechazado con éxito.");
      }
      router.push("/admin/revisiones");
    } catch (err: any) {
      console.error(`Error ${action}ing car:`, err);
      setError(`Error al procesar la solicitud: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
    // Deshabilitar scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Habilitar scroll del body cuando el modal se cierra
    document.body.style.overflow = 'auto';
    
    // Pequeño delay para permitir que la animación se complete
    setTimeout(() => {
      setModalImage(null);
    }, 300);
  };

  // Cerrar modal con la tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 animate-pulse">Cargando detalles del vehículo...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-500 font-medium">{error || "Vehículo no encontrado."}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin/revisiones" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6 font-medium">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver a Revisiones
        </Link>
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {car.marca} {car.modelo}
              </h1>
              <Badge className="capitalize mt-2" variant="secondary">
                {car.estado}
              </Badge>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sección de Imágenes */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Imágenes del Vehículo</h2>
              <div className="grid grid-cols-2 gap-4">
                {(car.imagenes || []).map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-video rounded-lg overflow-hidden shadow-md cursor-pointer group"
                    onClick={() => openModal(image.url)}
                  >
                    <Image
                      src={image.url}
                      alt={`Imagen del ${car.marca} ${car.modelo}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                      <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección de Detalles */}
            <div className="space-y-6">
              <Card className="shadow-none border-dashed border-2">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-700">Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <p className="text-gray-500">Placa:</p>
                    <p className="font-medium text-gray-900">{car.placa}</p>
                    <p className="text-gray-500">Año:</p>
                    <p className="font-medium text-gray-900">{car.year}</p>
                    <p className="text-gray-500">Kilometraje:</p>
                    <p className="font-medium text-gray-900">{car.kilometraje.toLocaleString()} km</p>
                    <p className="text-gray-500">Precio:</p>
                    <p className="font-medium text-gray-900">${car.precio.toLocaleString()}</p>
                    <p className="text-gray-500">Color Exterior:</p>
                    <p className="font-medium text-gray-900">{car.colorExterior}</p>
                    <p className="text-gray-500">Condición:</p>
                    <p className="font-medium text-gray-900">{car.isNew ? "Nuevo" : "Usado"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none border-dashed border-2">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-700">Números de Identificación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-500">Serial del Motor:</p>
                    <p className="font-mono text-gray-900 bg-gray-50 p-2 rounded-md">{car.serial_motor}</p>
                    <p className="text-gray-500">Serial de Carrocería:</p>
                    <p className="font-mono text-gray-900 bg-gray-50 p-2 rounded-md">{car.serial_carroceria}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 mt-6 border-t">
                <Button
                  onClick={() => handleAction("reject")}
                  variant="destructive"
                  disabled={isProcessing}
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  {isProcessing ? "Rechazando..." : "Rechazar"}
                </Button>
                <Button
                  onClick={() => handleAction("accept")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isProcessing}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {isProcessing ? "Aceptando..." : "Aceptar"}
                </Button>
              </div>
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para la imagen grande */}
      {modalImage && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
            isModalOpen 
              ? 'bg-black bg-opacity-90 opacity-100' 
              : 'bg-opacity-0 opacity-0 pointer-events-none'
          }`}
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-6xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10 p-2 rounded-full"
              aria-label="Cerrar"
            >
              <X className="h-8 w-8" />
            </button>
            
            <div className="relative w-full h-full flex items-center justify-center">
              <TransformWrapper 
                initialScale={1}
                minScale={0.5}
                maxScale={8}
                centerOnInit
                wheel={{ step: 0.1 }}
                pinch={{ step: 0.1 }}
                doubleClick={{ disabled: true }}
              >
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                  <>
                    <div className="absolute top-4 left-4 z-10 flex gap-2 bg-black/70 rounded-lg p-2">
                      <button 
                        onClick={() => zoomIn()} 
                        className="text-white p-2 hover:bg-white/20 rounded"
                        aria-label="Acercar"
                      >
                        <ZoomIn className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => zoomOut()} 
                        className="text-white p-2 hover:bg-white/20 rounded"
                        aria-label="Alejar"
                      >
                        <ZoomOut className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => resetTransform()} 
                        className="text-white p-2 hover:bg-white/20 rounded"
                        aria-label="Restablecer"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <TransformComponent
                      wrapperStyle={{ width: "100%", height: "80vh" }}
                    >
                      <Image
                        src={modalImage}
                        alt="Imagen en vista grande"
                        width={1200}
                        height={800}
                        className="object-contain rounded-lg"
                        priority
                      />
                    </TransformComponent>
                  </>
                )}
              </TransformWrapper>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPendingCars } from "@/lib/api/carroapi";
import { Carro } from "@/types/carro";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 6;

export default function RevisionesPage() {
  const [cars, setCars] = useState<Carro[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
   getPendingCars()
        .then(data => {
          setCars(data);
          console.log(JSON.stringify(data))
          console.log("enrevisiones")
           localStorage.setItem("pendingCars", JSON.stringify(data));
        })
        .catch((err) => console.error("Error fetching pending cars:", err))
        .finally(() => setLoading(false));
  }, []);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCars = cars.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(cars.length / ITEMS_PER_PAGE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (loading) return <p className="p-8 text-center text-lg">Cargando...</p>;

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4 text-xl md:text-2xl font-bold text-gray-800">
        <Car className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
        <h1>Carros Pendientes de Revisión</h1>
      </div>

      {cars.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          🎉 ¡No hay carros pendientes por revisar!
        </p>
      ) : (
        <>
          {/* Vista de tabla para pantallas grandes */}
          <div className="hidden md:block bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Imagen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Placa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marca / Modelo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Año
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedCars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-100 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Image
                          src={car.imagen || "/placeholder-car.jpg"}
                          alt={`Imagen de ${car.marca} ${car.modelo}`}
                          width={80}
                          height={56}
                          className="rounded-md object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        <Badge variant="outline" className="text-sm font-semibold">
                          {car.placa}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-semibold">{car.marca}</div>
                        <div className="text-gray-500">{car.modelo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {car.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/admin/revisiones/${car.id}`} passHref>
                          <Button variant="link" className="text-blue-600 hover:text-blue-800">
                            Ver Detalle
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vista de tarjetas para pantallas pequeñas */}
          <div className="md:hidden grid gap-4">
            {paginatedCars.map((car) => (
              <div key={car.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={car.imagen || "/placeholder-car.jpg"}
                      alt={`Imagen de ${car.marca} ${car.modelo}`}
                      width={80}
                      height={56}
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className="text-sm font-semibold mb-2">
                          {car.placa}
                        </Badge>
                        <h3 className="font-semibold text-lg">{car.marca} {car.modelo}</h3>
                        <p className="text-gray-500">Año: {car.year}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Link href={`/admin/revisiones/${car.id}`} passHref>
                        <Button size="sm" className="w-full">
                          Ver Detalle
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {pageNumbers.map((page) => (
            <Button
              key={page}
              onClick={() => setCurrentPage(page)}
              variant={currentPage === page ? "default" : "outline"}
              className="w-10 h-10"
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
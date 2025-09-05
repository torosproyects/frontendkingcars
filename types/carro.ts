export interface BackendCar {
  placa: string;
  year: number;
  kilometraje: number;
  precio: string;
  categoria: string;
  colorExterior: string;
  serial_motor: string;
  imagen: string;
  serial_carroceria: string;
  isNew: number;
  marca: string;
  modelo: string;
  imagenes: Array<{ id: string; url: string }>;
  estado:string;
}

export interface Carro {
  id: string;
  marca: string;
  modelo: string;
  year: number;
  precio: number;
  imagenes: CarImage[];
  placa: string;
  kilometraje: number;
  categoria?: string;
  colorExterior: string;
  isNew: boolean;
  serial_motor: string;
  imagen: string;
  serial_carroceria: string;
  estado:string;
}

export interface CarImage {
  id: string;
  url: string;
}

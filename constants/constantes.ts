import { PhotoTemplate } from '@/types/camara';

export const PHOTO_TEMPLATES: PhotoTemplate[] = [{
    id: 1,
    label: 'Vista Frontal',
    description: 'Toma la foto desde el frente del vehículo, asegúrate de capturar toda la parte delantera',
    referenceImage: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 2,
    label: 'Vista Trasera',
    description: 'Fotografía la parte trasera completa del vehículo',
    referenceImage: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 3,
    label: 'Lado Izquierdo',
    description: 'Captura el perfil izquierdo completo del vehículo',
    referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 4,
    label: 'Lado Derecho',
    description: 'Fotografía el perfil derecho completo del vehículo',
    referenceImage: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 5,
    label: 'Interior Delantero',
    description: 'Toma una foto del tablero y asientos delanteros',
    referenceImage: 'https://images.pexels.com/photos/6894428/pexels-photo-6894428.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 6,
    label: 'Interior Trasero',
    description: 'Fotografía los asientos traseros y espacio interior',
    referenceImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 7,
    label: 'Motor',
    description: 'Abre el capó y fotografía el motor',
    referenceImage: 'https://images.pexels.com/photos/1231643/pexels-photo-1231643.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 8,
    label: 'Maletero/Cajuela',
    description: 'Abre y fotografía el espacio de carga',
    referenceImage: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 9,
    label: 'Ruedas/Llantas',
    description: 'Toma una foto cercana de las ruedas y llantas',
    referenceImage: 'https://images.pexels.com/photos/2676096/pexels-photo-2676096.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 10,
    label: 'Tablero/Odometro',
    description: 'Fotografía el tablero mostrando el kilometraje',
    referenceImage: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  }
   
];
/*
const photoGuides: PhotoGuide[] = [
  {
    id: 1,
    label: 'Vista Frontal',
    description: 'Toma la foto desde el frente del vehículo, asegúrate de capturar toda la parte delantera',
    referenceImage: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 2,
    label: 'Vista Trasera',
    description: 'Fotografía la parte trasera completa del vehículo',
    referenceImage: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 3,
    label: 'Lado Izquierdo',
    description: 'Captura el perfil izquierdo completo del vehículo',
    referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 4,
    label: 'Lado Derecho',
    description: 'Fotografía el perfil derecho completo del vehículo',
    referenceImage: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 5,
    label: 'Interior Delantero',
    description: 'Toma una foto del tablero y asientos delanteros',
    referenceImage: 'https://images.pexels.com/photos/6894428/pexels-photo-6894428.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 6,
    label: 'Interior Trasero',
    description: 'Fotografía los asientos traseros y espacio interior',
    referenceImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 7,
    label: 'Motor',
    description: 'Abre el capó y fotografía el motor',
    referenceImage: 'https://images.pexels.com/photos/1231643/pexels-photo-1231643.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 8',
    label: 'Maletero/Cajuela',
    description: 'Abre y fotografía el espacio de carga',
    referenceImage: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 9,
    label: 'Ruedas/Llantas',
    description: 'Toma una foto cercana de las ruedas y llantas',
    referenceImage: 'https://images.pexels.com/photos/2676096/pexels-photo-2676096.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  },
  {
    id: 10,
    label: 'Tablero/Odómetro',
    description: 'Fotografía el tablero mostrando el kilometraje',
    referenceImage: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
    required: true,
    guidanceImage: "/assets/png-transparent.png",
    aspectRatio: "4/3"
  }
];

{ id: 1, label: "Frontal",
    description: "Toma una foto de frente, mirando directamente a la cámara.", 
    required: true,referenceImage: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg', guidanceImage: "/assets/png-frontal.png" },
  { id: 2, label: "Perfil Izquierdo",referenceImage: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',description: "Toma una foto de tu perfil izquierdo.", required: true, guidanceImage: "/assets/png-frontal.png" },
  { id: 3, label: "Perfil Derecho", referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg', description: "Toma una foto de tu perfil derecho.", required: true, guidanceImage: "/assets/png-frontal.png" },
  { id: 4, label: "Ojos Cerrados", referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg', description: "Toma una foto con los ojos cerrados.", required: true, guidanceImage: "/assets/png-transparent.png" }, // Reusamos la frontal como guía general de posición
  { id: 5, label: "Sonriendo",  referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg',description: "Toma una foto sonriendo ampliamente.", required: true, guidanceImage: "/assets//assets/parteTrasera.png" }, // Reusamos la frontal
  { id: 6, label: "Expresión Seria",  referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg',description: "Toma una foto con una expresión facial seria y neutra.", required: true, guidanceImage: "/assets/png-transparent.png" }, // Reusamos la frontal
  { id: 7, label: "Hombro Izquierdo (3/4)",  referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg',description: "Foto 3/4 vista sobre el hombro izquierdo.", required: true, guidanceImage: "/assets//assets/parteTrasera.png" },
  { id: 8, label: "Hombro Derecho (3/4)",  referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg',description: "Foto 3/4 vista sobre el hombro derecho.", required: true, guidanceImage: "/assets//assets/parteTrasera.png" },
  { id: 9, label: "Picado Ligero", referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg', description: "Toma una foto desde un ángulo ligeramente elevado.", required: true, guidanceImage: "/assets/parteTrasera.png" },
  { id: 10, label: "Contrapicado Ligero", referenceImage: 'https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg', description: "Toma una foto desde un ángulo ligeramente bajo.", required: true, guidanceImage: "/assets/png-transparent.png"}

*/
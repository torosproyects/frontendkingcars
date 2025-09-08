import { Carro } from './carro';

// Evaluación de Taller - Interfaces principales
export interface EvaluacionTaller {
  id: string;
  carro: Carro; // Usar la interfaz existente
  tallerId: string;
  estadoTaller: "en_evaluacion" | "evaluado" | "en_reparacion" | "reparado";
  evaluacionEntrada: EvaluacionEntrada;
  pruebasTecnicas: PruebasTecnicas;
  evaluacionFinal: EvaluacionFinal;
  reparacionesRecomendadas: ReparacionRecomendada[];
  fechaEvaluacion: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// Evaluación inicial al recibir el vehículo
export interface EvaluacionEntrada {
  id: string;
  fechaEntrada: string;
  kilometrajeEntrada: number;
  estadoExterior: EstadoExterior;
  estadoInterior: EstadoInterior;
  observacionesGenerales: string;
  fotosEntrada: FotoEvaluacion[];
  tecnicoResponsable: string;
}

// Pruebas técnicas realizadas
export interface PruebasTecnicas {
  id: string;
  fechaPruebas: string;
  motor: PruebaMotor;
  frenos: PruebaFrenos;
  suspension: PruebaSuspension;
  direccion: PruebaDireccion;
  luces: PruebaLuces;
  neumaticos: PruebaNeumaticos;
  sistemaElectrico: PruebaSistemaElectrico;
  transmision: PruebaTransmision;
  aireAcondicionado: PruebaAireAcondicionado;
  liquidos: PruebaLiquidos;
  observacionesTecnicas: string;
  fotosPruebas: FotoEvaluacion[];
}

// Evaluación final y recomendaciones
export interface EvaluacionFinal {
  id: string;
  fechaEvaluacion: string;
  resumenHallazgos: string;
  prioridadReparaciones: "critico" | "importante" | "preventivo";
  tiempoEstimadoReparacion: number; // en días
  observacionesFinales: string;
  fotosFinales: FotoEvaluacion[];
  tecnicoEvaluador: string;
}

// Reparaciones recomendadas con montos
export interface ReparacionRecomendada {
  id: string;
  nombre: string;
  descripcion: string;
  prioridad: "critico" | "importante" | "preventivo";
  montoEstimado: number;
  tiempoEstimado: number; // en horas
  categoria: "mecanica" | "electrico" | "carroceria" | "neumaticos" | "mantenimiento";
  estado: "pendiente" | "en_proceso" | "completada" | "cancelada";
}

// Fotos durante la evaluación
export interface FotoEvaluacion {
  id: string;
  url: string;
  descripcion: string;
  tipo: "entrada" | "prueba" | "problema" | "solucion" | "final";
  fechaCaptura: string;
  tecnico: string;
}

// Estados específicos de cada área
export interface EstadoExterior {
  carroceria: "excelente" | "bueno" | "regular" | "malo";
  pintura: "excelente" | "bueno" | "regular" | "malo";
  neumaticos: "excelente" | "bueno" | "regular" | "malo";
  luces: "excelente" | "bueno" | "regular" | "malo";
  observaciones: string;
}

export interface EstadoInterior {
  asientos: "excelente" | "bueno" | "regular" | "malo";
  tablero: "excelente" | "bueno" | "regular" | "malo";
  aireAcondicionado: "excelente" | "bueno" | "regular" | "malo";
  radio: "excelente" | "bueno" | "regular" | "malo";
  observaciones: string;
}

// Interfaces para cada prueba técnica
export interface PruebaMotor {
  arranque: "excelente" | "bueno" | "regular" | "malo";
  ruidos: "excelente" | "bueno" | "regular" | "malo";
  humo: "excelente" | "bueno" | "regular" | "malo";
  temperatura: "excelente" | "bueno" | "regular" | "malo";
  observaciones: string;
}

export interface PruebaFrenos {
  eficiencia: "excelente" | "bueno" | "regular" | "malo";
  ruidos: "excelente" | "bueno" | "regular" | "malo";
  liquidoFrenos: "excelente" | "bueno" | "regular" | "malo";
  observaciones: string;
}

export interface PruebaSuspension {
  amortiguadores: "excelente" | "bueno" | "regular" | "malo";
  estabilidad: "excelente" | "bueno" | "regular" | "malo";
  observaciones: string;
}

export interface PruebaDireccion {
  alineacion: "excelente" | "bueno" | "regular" | "malo";
  ruidos: "excelente" | "bueno" | "regular" | "malo";
  respuesta: "excelente" | "bueno" | "regular" | "malo";
  observaciones: string;
}

export interface PruebaLuces {
  funcionamiento: "excelente" | "bueno" | "regular" | "malo";
  alineacion: "excelente" | "bueno" | "regular" | "malo";
  observaciones: string;
}

export interface PruebaNeumaticos {
  desgaste: "excelente" | "bueno" | "regular" | "malo";
  presion: "excelente" | "bueno" | "regular" | "malo";
  estado: "excelente" | "bueno" | "regular" | "malo";
  observaciones: string;
}

export interface PruebaSistemaElectrico {
  bateria: "excelente" | "bueno" | "regular" | "malo";
  alternador: "excelente" | "bueno" | "regular" | "malo";
  luces: "excelente" | "bueno" | "regular" | "malo";
  observaciones: string;
}

export interface PruebaTransmision {
  cambios: "excelente" | "bueno" | "regular" | "malo";
  ruidos: "excelente" | "bueno" | "regular" | "malo";
  fluidos: "excelente" | "bueno" | "regular" | "malo";
  observaciones: string;
}

export interface PruebaAireAcondicionado {
  funcionamiento: "excelente" | "bueno" | "regular" | "malo";
  filtros: "excelente" | "bueno" | "regular" | "malo";
  observaciones: string;
}

export interface PruebaLiquidos {
  aceite: "excelente" | "bueno" | "regular" | "malo";
  refrigerante: "excelente" | "bueno" | "regular" | "malo";
  frenos: "excelente" | "bueno" | "regular" | "malo";
  direccion: "excelente" | "bueno" | "regular" | "malo";
  observaciones: string;
}

// Horarios del taller
export interface HorarioTaller {
  id: string;
  tallerId: string;
  diaSemana: "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo";
  horaApertura: string;
  horaCierre: string;
  descanso?: {
    horaInicio: string;
    horaFin: string;
  };
  activo: boolean;
  fechaCreacion: string;
}

// Citas del taller (para futuro)
export interface CitaTaller {
  id: string;
  tallerId: string;
  vehiculoId: string;
  clienteId: string;
  fecha: string;
  hora: string;
  estado: "pendiente" | "confirmada" | "en_proceso" | "completada" | "cancelada";
  descripcion: string;
  observaciones?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// Tipos para formularios
export interface CreateEvaluacionEntradaData {
  carroId: string;
  kilometrajeEntrada: number;
  estadoExterior: EstadoExterior;
  estadoInterior: EstadoInterior;
  observacionesGenerales: string;
  fotosEntrada: File[];
  tecnicoResponsable: string;
}

export interface CreatePruebasTecnicasData {
  evaluacionId: string;
  motor: PruebaMotor;
  frenos: PruebaFrenos;
  suspension: PruebaSuspension;
  direccion: PruebaDireccion;
  luces: PruebaLuces;
  neumaticos: PruebaNeumaticos;
  sistemaElectrico: PruebaSistemaElectrico;
  transmision: PruebaTransmision;
  aireAcondicionado: PruebaAireAcondicionado;
  liquidos: PruebaLiquidos;
  observacionesTecnicas: string;
  fotosPruebas: File[];
}

export interface CreateEvaluacionFinalData {
  evaluacionId: string;
  resumenHallazgos: string;
  prioridadReparaciones: "critico" | "importante" | "preventivo";
  tiempoEstimadoReparacion: number;
  observacionesFinales: string;
  fotosFinales: File[];
  tecnicoEvaluador: string;
  reparacionesRecomendadas: Omit<ReparacionRecomendada, "id" | "estado">[];
}

export interface CreateHorarioTallerData {
  diaSemana: "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo";
  horaApertura: string;
  horaCierre: string;
  descanso?: {
    horaInicio: string;
    horaFin: string;
  };
  activo: boolean;
}

// Tipos para respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count: number;
}

export interface EvaluacionesApiResponse extends ApiResponse<EvaluacionTaller[]> {
  taller_id: string;
}

export interface CitasApiResponse extends ApiResponse<CitaTaller[]> {
  filters?: any;
}

export interface HorariosApiResponse extends ApiResponse<HorarioTaller[]> {
  taller_id: string;
}

  observaciones: string;

}



export interface PruebaLuces {

  funcionamiento: "excelente" | "bueno" | "regular" | "malo";

  alineacion: "excelente" | "bueno" | "regular" | "malo";

  observaciones: string;

}



export interface PruebaNeumaticos {

  desgaste: "excelente" | "bueno" | "regular" | "malo";

  presion: "excelente" | "bueno" | "regular" | "malo";

  estado: "excelente" | "bueno" | "regular" | "malo";

  observaciones: string;

}



export interface PruebaSistemaElectrico {

  bateria: "excelente" | "bueno" | "regular" | "malo";

  alternador: "excelente" | "bueno" | "regular" | "malo";

  luces: "excelente" | "bueno" | "regular" | "malo";

  observaciones: string;

}



export interface PruebaTransmision {

  cambios: "excelente" | "bueno" | "regular" | "malo";

  ruidos: "excelente" | "bueno" | "regular" | "malo";

  fluidos: "excelente" | "bueno" | "regular" | "malo";

  observaciones: string;

}



export interface PruebaAireAcondicionado {

  funcionamiento: "excelente" | "bueno" | "regular" | "malo";

  filtros: "excelente" | "bueno" | "regular" | "malo";

  observaciones: string;

}



export interface PruebaLiquidos {

  aceite: "excelente" | "bueno" | "regular" | "malo";

  refrigerante: "excelente" | "bueno" | "regular" | "malo";

  frenos: "excelente" | "bueno" | "regular" | "malo";

  direccion: "excelente" | "bueno" | "regular" | "malo";

  observaciones: string;

}



// Horarios del taller

export interface HorarioTaller {

  id: string;

  tallerId: string;

  diaSemana: "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo";

  horaApertura: string;

  horaCierre: string;

  descanso?: {

    horaInicio: string;

    horaFin: string;

  };

  activo: boolean;

  fechaCreacion: string;

}



// Citas del taller (para futuro)

export interface CitaTaller {

  id: string;

  tallerId: string;

  vehiculoId: string;

  clienteId: string;

  fecha: string;

  hora: string;

  estado: "pendiente" | "confirmada" | "en_proceso" | "completada" | "cancelada";

  descripcion: string;

  observaciones?: string;

  fechaCreacion: string;

  fechaActualizacion: string;

}



// Tipos para formularios

export interface CreateEvaluacionEntradaData {

  carroId: string;

  kilometrajeEntrada: number;

  estadoExterior: EstadoExterior;

  estadoInterior: EstadoInterior;

  observacionesGenerales: string;

  fotosEntrada: File[];

  tecnicoResponsable: string;

}



export interface CreatePruebasTecnicasData {

  evaluacionId: string;

  motor: PruebaMotor;

  frenos: PruebaFrenos;

  suspension: PruebaSuspension;

  direccion: PruebaDireccion;

  luces: PruebaLuces;

  neumaticos: PruebaNeumaticos;

  sistemaElectrico: PruebaSistemaElectrico;

  transmision: PruebaTransmision;

  aireAcondicionado: PruebaAireAcondicionado;

  liquidos: PruebaLiquidos;

  observacionesTecnicas: string;

  fotosPruebas: File[];

}



export interface CreateEvaluacionFinalData {

  evaluacionId: string;

  resumenHallazgos: string;

  prioridadReparaciones: "critico" | "importante" | "preventivo";

  tiempoEstimadoReparacion: number;

  observacionesFinales: string;

  fotosFinales: File[];

  tecnicoEvaluador: string;

  reparacionesRecomendadas: Omit<ReparacionRecomendada, "id" | "estado">[];

}



export interface CreateHorarioTallerData {

  diaSemana: "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo";

  horaApertura: string;

  horaCierre: string;

  descanso?: {

    horaInicio: string;

    horaFin: string;

  };

  activo: boolean;

}

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

// NUEVO: Horarios por día específico
export interface HorarioDia {
  id: string;
  tallerId: string;
  fecha: string; // YYYY-MM-DD
  horarios: HorarioHora[];
  bloqueado: boolean;
  motivoBloqueo?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface HorarioHora {
  hora: string; // HH:MM (ej: "08:00", "09:00")
  activo: boolean;
  capacidad: number; // default: 1, ilimitado: -1
  citasAgendadas: number;
}

// Nuevos tipos para la gestión de horarios mejorada
export interface HorarioConfig {
  hora: string;
  disponible: boolean;
  capacidadMaxima: number;
  capacidadActual: number;
}

export interface DiaHorario {
  fecha: string;
  horarios: HorarioConfig[];
  bloqueado: boolean;
  motivoBloqueo?: string;
}

export interface HorarioRango {
  horaInicio: string;
  horaFin: string;
  capacidad: number;
}

export interface PlantillaHorario {
  id: string;
  nombre: string;
  descripcion: string;
  horarios: HorarioRango[];
}

// Horarios del taller (LEGACY - mantener para compatibilidad)
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

// Citas del taller
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

// NUEVO: Tipos para horarios por día
export interface CreateHorarioDiaData {
  fecha: string; // YYYY-MM-DD
  horarios: Omit<HorarioHora, 'citasAgendadas'>[];
  bloqueado: boolean;
  motivoBloqueo?: string;
}

export interface UpdateHorarioDiaData {
  horarios: Omit<HorarioHora, 'citasAgendadas'>[];
  bloqueado: boolean;
  motivoBloqueo?: string;
}

// Constantes para horarios
export const HORARIOS_DISPONIBLES = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
] as const;

export const DIAS_SEMANA = [
  "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"
] as const;

// Plantillas predefinidas de horarios
export const PLANTILLAS_HORARIO: PlantillaHorario[] = [
  {
    id: "mañana",
    nombre: "Mañana Completa",
    descripcion: "8:00 - 12:00",
    horarios: [
      { horaInicio: "08:00", horaFin: "12:00", capacidad: 1 }
    ]
  },
  {
    id: "tarde",
    nombre: "Tarde Completa", 
    descripcion: "14:00 - 18:00",
    horarios: [
      { horaInicio: "14:00", horaFin: "18:00", capacidad: 1 }
    ]
  },
  {
    id: "dia_completo",
    nombre: "Día Completo",
    descripcion: "8:00 - 18:00",
    horarios: [
      { horaInicio: "08:00", horaFin: "18:00", capacidad: 1 }
    ]
  },
  {
    id: "medio_dia",
    nombre: "Medio Día",
    descripcion: "8:00 - 13:00",
    horarios: [
      { horaInicio: "08:00", horaFin: "13:00", capacidad: 1 }
    ]
  }
];



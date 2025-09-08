import { create } from 'zustand';
import { 
  EvaluacionTaller, 
  HorarioTaller, 
  CitaTaller,
  CreateEvaluacionEntradaData,
  CreatePruebasTecnicasData,
  CreateEvaluacionFinalData,
  CreateHorarioTallerData,
  EvaluacionesApiResponse,
  CitasApiResponse,
  HorariosApiResponse
} from '@/types/evaluaciontaller';
import { 
  HorarioDia, 
  CreateHorarioDiaData, 
  UpdateHorarioDiaData,
  DiaHorario 
} from '@/types/evaluacion-taller';
import { evaluacionTallerAPI } from '@/lib/api/evaluacion-taller';

interface EvaluacionTallerState {
  // Estado
  evaluaciones: EvaluacionTaller[];
  horarios: HorarioTaller[];
  horariosDia: HorarioDia[];
  citas: CitaTaller[];
  citasHoy: CitaTaller[];
  isLoading: boolean;
  error: string | null;
  currentEvaluacion: EvaluacionTaller | null;

  // Acciones de Evaluaciones
  fetchEvaluaciones: (tallerId: string) => Promise<void>;
  fetchEvaluacion: (id: string) => Promise<void>;
  createEvaluacionEntrada: (data: CreateEvaluacionEntradaData) => Promise<boolean>;
  updatePruebasTecnicas: (data: CreatePruebasTecnicasData) => Promise<boolean>;
  createEvaluacionFinal: (data: CreateEvaluacionFinalData) => Promise<boolean>;
  
  // Acciones de Horarios (Legacy)
  fetchHorarios: (tallerId: string) => Promise<void>;
  createHorario: (data: CreateHorarioTallerData) => Promise<boolean>;
  updateHorario: (id: string, data: Partial<CreateHorarioTallerData>) => Promise<boolean>;
  deleteHorario: (id: string) => Promise<boolean>;
  
  // Acciones de Horarios Diarios
  fetchHorariosPorMes: (tallerId: string, año: number, mes: number) => Promise<void>;
  createHorarioDia: (tallerId: string, data: CreateHorarioDiaData) => Promise<boolean>;
  updateHorarioDia: (tallerId: string, fecha: string, data: UpdateHorarioDiaData) => Promise<boolean>;
  deleteHorarioDia: (tallerId: string, fecha: string) => Promise<boolean>;
  copiarHorariosDia: (tallerId: string, fechaOrigen: string, fechaDestino: string) => Promise<boolean>;
  
  // Acciones de Citas
  fetchCitas: (tallerId: string) => Promise<void>;
  fetchCitasHoy: (tallerId: string) => Promise<void>;
  updateEstadoCita: (id: string, estado: string) => Promise<boolean>;
  
  // Utilidades
  clearError: () => void;
  setCurrentEvaluacion: (evaluacion: EvaluacionTaller | null) => void;
  getEvaluacionesPorEstado: (estado: string) => EvaluacionTaller[];
  getCitasPorEstado: (estado: string) => CitaTaller[];
}

export const useEvaluacionTallerStore = create<EvaluacionTallerState>((set, get) => ({
  // Estado inicial
  evaluaciones: [],
  horarios: [],
  horariosDia: [],
  citas: [],
  citasHoy: [],
  isLoading: false,
  error: null,
  currentEvaluacion: null,

  // Acciones de Evaluaciones
  fetchEvaluaciones: async (tallerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await evaluacionTallerAPI.getEvaluaciones(tallerId);
      console.log(response)
      // Manejar tanto objeto con data como array directo
      const responseData = response as unknown;
      const evaluaciones = (responseData as EvaluacionesApiResponse)?.data || (responseData as EvaluacionTaller[]) || [];
      const evaluacionesArray = Array.isArray(evaluaciones) ? evaluaciones : [];
      set({ evaluaciones: evaluacionesArray, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
        evaluaciones: [] // Asegurar array vacío en caso de error
      });
    }
  },

  fetchEvaluacion: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const evaluacion = await evaluacionTallerAPI.getEvaluacion(id);
      set({ currentEvaluacion: evaluacion, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false 
      });
    }
  },

  createEvaluacionEntrada: async (data: CreateEvaluacionEntradaData) => {
    set({ isLoading: true, error: null });
    try {
      const nuevaEvaluacion = await evaluacionTallerAPI.createEvaluacionEntrada(data);
      set(state => ({
        evaluaciones: [...state.evaluaciones, nuevaEvaluacion],
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false 
      });
      return false;
    }
  },

  updatePruebasTecnicas: async (data: CreatePruebasTecnicasData) => {
    set({ isLoading: true, error: null });
    try {
      const evaluacionActualizada = await evaluacionTallerAPI.updatePruebasTecnicas(data);
      set(state => ({
        evaluaciones: state.evaluaciones.map(e => 
          e.id === evaluacionActualizada.id ? evaluacionActualizada : e
        ),
        currentEvaluacion: evaluacionActualizada,
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false 
      });
      return false;
    }
  },

  createEvaluacionFinal: async (data: CreateEvaluacionFinalData) => {
    set({ isLoading: true, error: null });
    try {
      const evaluacionFinalizada = await evaluacionTallerAPI.createEvaluacionFinal(data);
      set(state => ({
        evaluaciones: state.evaluaciones.map(e => 
          e.id === evaluacionFinalizada.id ? evaluacionFinalizada : e
        ),
        currentEvaluacion: evaluacionFinalizada,
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false 
      });
      return false;
    }
  },

  // Acciones de Horarios
  fetchHorarios: async (tallerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const horarios = await evaluacionTallerAPI.getHorarios(tallerId);
      console.log(horarios + "151store")
      set({ horarios, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false 
      });
    }
  },

  createHorario: async (data: CreateHorarioTallerData) => {
    set({ isLoading: true, error: null });
    try {
      const nuevoHorario = await evaluacionTallerAPI.createHorario(data);
      set(state => ({
        horarios: [...state.horarios, nuevoHorario],
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false 
      });
      return false;
    }
  },

  updateHorario: async (id: string, data: Partial<CreateHorarioTallerData>) => {
    set({ isLoading: true, error: null });
    try {
      const horarioActualizado = await evaluacionTallerAPI.updateHorario(id, data);
      set(state => ({
        horarios: state.horarios.map(h => 
          h.id === id ? horarioActualizado : h
        ),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false 
      });
      return false;
    }
  },

  deleteHorario: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await evaluacionTallerAPI.deleteHorario(id);
      set(state => ({
        horarios: state.horarios.filter(h => h.id !== id),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false 
      });
      return false;
    }
  },

  // Acciones de Horarios Diarios
  fetchHorariosPorMes: async (tallerId: string, año: number, mes: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await evaluacionTallerAPI.getHorariosPorMes(tallerId, año, mes);
      const horariosDia = Array.isArray(response) ? response : [];
      set({ horariosDia, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
        horariosDia: []
      });
    }
  },

  createHorarioDia: async (tallerId: string, data: CreateHorarioDiaData) => {
    set({ isLoading: true, error: null });
    try {
      const nuevoHorario = await evaluacionTallerAPI.createHorarioDia(tallerId, data);
      set(state => ({
        horariosDia: [...(Array.isArray(state.horariosDia) ? state.horariosDia : []), nuevoHorario],
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false 
      });
      return false;
    }
  },

  updateHorarioDia: async (tallerId: string, fecha: string, data: UpdateHorarioDiaData) => {
    set({ isLoading: true, error: null });
    try {
      const horarioActualizado = await evaluacionTallerAPI.updateHorarioDia(tallerId, fecha, data);
      set(state => ({
        horariosDia: Array.isArray(state.horariosDia) 
          ? state.horariosDia.map(h => h.fecha === fecha ? horarioActualizado : h)
          : [],
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false 
      });
      return false;
    }
  },

  deleteHorarioDia: async (tallerId: string, fecha: string) => {
    set({ isLoading: true, error: null });
    try {
      await evaluacionTallerAPI.deleteHorarioDia(tallerId, fecha);
      set(state => ({
        horariosDia: Array.isArray(state.horariosDia) 
          ? state.horariosDia.filter(h => h.fecha !== fecha)
          : [],
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false 
      });
      return false;
    }
  },

  copiarHorariosDia: async (tallerId: string, fechaOrigen: string, fechaDestino: string) => {
    set({ isLoading: true, error: null });
    try {
      const horarioCopiado = await evaluacionTallerAPI.copiarHorariosDia(tallerId, fechaOrigen, fechaDestino);
      set(state => ({
        horariosDia: Array.isArray(state.horariosDia) 
          ? state.horariosDia.map(h => h.fecha === fechaDestino ? horarioCopiado : h)
          : [],
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false 
      });
      return false;
    }
  },

  // Acciones de Citas
  fetchCitas: async (tallerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await evaluacionTallerAPI.getCitas(tallerId);
      // Manejar tanto objeto con data como array directo
      const responseData = response as unknown;
      const citas = (responseData as CitasApiResponse)?.data || (responseData as CitaTaller[]) || [];
      const citasArray = Array.isArray(citas) ? citas : [];
      set({ citas: citasArray, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
        citas: [] // Asegurar array vacío en caso de error
      });
    }
  },

  fetchCitasHoy: async (tallerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await evaluacionTallerAPI.getCitasHoy(tallerId);
      // Manejar tanto objeto con data como array directo
      const responseData = response as unknown;
      const citasHoy = (responseData as CitasApiResponse)?.data || (responseData as CitaTaller[]) || [];
      const citasHoyArray = Array.isArray(citasHoy) ? citasHoy : [];
      set({ citasHoy: citasHoyArray, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
        citasHoy: [] // Asegurar array vacío en caso de error
      });
    }
  },

  updateEstadoCita: async (id: string, estado: string) => {
    set({ isLoading: true, error: null });
    try {
      const citaActualizada = await evaluacionTallerAPI.updateEstadoCita(id, estado);
      set(state => ({
        citas: state.citas.map(c => 
          c.id === id ? citaActualizada : c
        ),
        citasHoy: state.citasHoy.map(c => 
          c.id === id ? citaActualizada : c
        ),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false 
      });
      return false;
    }
  },

  // Utilidades
  clearError: () => set({ error: null }),
  setCurrentEvaluacion: (evaluacion) => set({ currentEvaluacion: evaluacion }),
  
  getEvaluacionesPorEstado: (estado: string) => {
    const evaluaciones = get().evaluaciones;
    return Array.isArray(evaluaciones) ? evaluaciones.filter(e => e.estadoTaller === estado) : [];
  },
  
  getCitasPorEstado: (estado: string) => {
    const citas = get().citas;
    return Array.isArray(citas) ? citas.filter(c => c.estado === estado) : [];
  },
}));
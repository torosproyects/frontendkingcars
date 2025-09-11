import { 
  EvaluacionTaller, 
  CreateEvaluacionEntradaData, 
  CreatePruebasTecnicasData, 
  CreateEvaluacionFinalData,
  HorarioTaller,
  CreateHorarioTallerData,
  HorarioDia,
  CreateHorarioDiaData,
  UpdateHorarioDiaData,
  CitaTaller
} from '@/types/evaluacion-taller';
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  class EvaluacionTallerAPI {
    private baseUrl: string;
  
    constructor() {
      this.baseUrl = `${API_BASE_URL}/taller`;
    }
  
    // Evaluaciones
    async getEvaluaciones(tallerId: string): Promise<EvaluacionTaller[]> {
      const response = await fetch(`${this.baseUrl}/evaluaciones/${tallerId}`);
      if (!response.ok) throw new Error('Error al obtener evaluaciones');
      return response.json();
    }
  
    async getEvaluacion(id: string): Promise<EvaluacionTaller> {
      const response = await fetch(`${this.baseUrl}/evaluaciones/${id}`);
      if (!response.ok) throw new Error('Error al obtener evaluación');
      return response.json();
    }
  
    async createEvaluacionEntrada(data: CreateEvaluacionEntradaData): Promise<EvaluacionTaller> {
      const formData = new FormData();
      formData.append('carroId', data.carroId);
      formData.append('kilometrajeEntrada', data.kilometrajeEntrada.toString());
      formData.append('estadoExterior', JSON.stringify(data.estadoExterior));
      formData.append('estadoInterior', JSON.stringify(data.estadoInterior));
      formData.append('observacionesGenerales', data.observacionesGenerales);
      formData.append('tecnicoResponsable', data.tecnicoResponsable);
      
      data.fotosEntrada.forEach((foto, index) => {
        formData.append(`foto_${index}`, foto);
      });
  
      const response = await fetch(`${this.baseUrl}/evaluaciones/entrada`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Error al crear evaluación de entrada');
      return response.json();
    }
  
    async updatePruebasTecnicas(data: CreatePruebasTecnicasData): Promise<EvaluacionTaller> {
      const formData = new FormData();
      formData.append('evaluacionId', data.evaluacionId);
      formData.append('motor', JSON.stringify(data.motor));
      formData.append('frenos', JSON.stringify(data.frenos));
      formData.append('suspension', JSON.stringify(data.suspension));
      formData.append('direccion', JSON.stringify(data.direccion));
      formData.append('luces', JSON.stringify(data.luces));
      formData.append('neumaticos', JSON.stringify(data.neumaticos));
      formData.append('sistemaElectrico', JSON.stringify(data.sistemaElectrico));
      formData.append('transmision', JSON.stringify(data.transmision));
      formData.append('aireAcondicionado', JSON.stringify(data.aireAcondicionado));
      formData.append('liquidos', JSON.stringify(data.liquidos));
      formData.append('observacionesTecnicas', data.observacionesTecnicas);
      
      data.fotosPruebas.forEach((foto, index) => {
        formData.append(`foto_${index}`, foto);
      });
  
      const response = await fetch(`${this.baseUrl}/evaluaciones/pruebas`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) throw new Error('Error al actualizar pruebas técnicas');
      return response.json();
    }
  
    async createEvaluacionFinal(data: CreateEvaluacionFinalData): Promise<EvaluacionTaller> {
      const formData = new FormData();
      formData.append('evaluacionId', data.evaluacionId);
      formData.append('resumenHallazgos', data.resumenHallazgos);
      formData.append('prioridadReparaciones', data.prioridadReparaciones);
      formData.append('tiempoEstimadoReparacion', data.tiempoEstimadoReparacion.toString());
      formData.append('observacionesFinales', data.observacionesFinales);
      formData.append('tecnicoEvaluador', data.tecnicoEvaluador);
      formData.append('reparacionesRecomendadas', JSON.stringify(data.reparacionesRecomendadas));
      
      data.fotosFinales.forEach((foto, index) => {
        formData.append(`foto_${index}`, foto);
      });
  
      const response = await fetch(`${this.baseUrl}/evaluaciones/final`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Error al crear evaluación final');
      return response.json();
    }
  
    // Horarios
    async getHorarios(tallerId: string): Promise<HorarioTaller[]> {
      const response = await fetch(`${this.baseUrl}/horarios/${tallerId}`);
      if (!response.ok) throw new Error('Error al obtener horarios');
      return response.json();
    }
  
    async createHorario(data: CreateHorarioTallerData): Promise<HorarioTaller> {
      const response = await fetch(`${this.baseUrl}/horarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al crear horario');
      return response.json();
    }
  
    async updateHorario(id: string, data: Partial<CreateHorarioTallerData>): Promise<HorarioTaller> {
      const response = await fetch(`${this.baseUrl}/horarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al actualizar horario');
      return response.json();
    }
  
    async deleteHorario(id: string): Promise<void> {
      const response = await fetch(`${this.baseUrl}/horarios/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar horario');
    }
  
    // Citas (para futuro)
    async getCitas(tallerId: string): Promise<CitaTaller[]> {
      const response = await fetch(`${this.baseUrl}/citas/${tallerId}`);
      if (!response.ok) throw new Error('Error al obtener citas');
      return response.json();
    }
  
    async getCitasHoy(tallerId: string): Promise<CitaTaller[]> {
      const response = await fetch(`${this.baseUrl}/citas/${tallerId}/hoy`);
      if (!response.ok) throw new Error('Error al obtener citas de hoy');
      return response.json();
    }
  
  async updateEstadoCita(id: string, estado: string): Promise<CitaTaller> {
    const response = await fetch(`${this.baseUrl}/citas/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    });
    if (!response.ok) throw new Error('Error al actualizar estado de cita');
    return response.json();
  }

  // NUEVO: Horarios por día específico
  async getHorariosPorMes(tallerId: string, año: number, mes: number): Promise<HorarioDia[]> {
    const response = await fetch(`${this.baseUrl}/horarios/${tallerId}/mes/${año}/${mes}`);
    if (!response.ok) throw new Error('Error al obtener horarios del mes');
    return response.json();
  }

  async getHorarioDia(tallerId: string, fecha: string): Promise<HorarioDia | null> {
    const response = await fetch(`${this.baseUrl}/horarios/${tallerId}/dia/${fecha}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Error al obtener horario del día');
    }
    return response.json();
  }

  async createHorarioDia(tallerId: string, data: CreateHorarioDiaData): Promise<HorarioDia> {
    // Validación de fecha pasada en el frontend
    const fecha = new Date(data.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fecha.setHours(0, 0, 0, 0);
    
    if (fecha < hoy) {
      throw new Error('No se pueden crear horarios para fechas pasadas');
    }

    const response = await fetch(`${this.baseUrl}/horarios/${tallerId}/dia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al crear horario del día');
    return response.json();
  }

  async updateHorarioDia(tallerId: string, fecha: string, data: UpdateHorarioDiaData): Promise<HorarioDia> {
    // Validación de fecha pasada en el frontend
    const fechaObj = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fechaObj.setHours(0, 0, 0, 0);
    
    if (fechaObj < hoy) {
      throw new Error('No se pueden actualizar horarios para fechas pasadas');
    }

    const response = await fetch(`${this.baseUrl}/horarios/${tallerId}/dia/${fecha}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al actualizar horario del día');
    return response.json();
  }

  async deleteHorarioDia(tallerId: string, fecha: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/horarios/${tallerId}/dia/${fecha}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar horario del día');
  }

  async copiarHorariosDia(tallerId: string, fechaOrigen: string, fechaDestino: string): Promise<HorarioDia> {
    const response = await fetch(`${this.baseUrl}/horarios/${tallerId}/copiar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fechaOrigen, fechaDestino }),
    });
    if (!response.ok) throw new Error('Error al copiar horarios');
    return response.json();
  }
}

export const evaluacionTallerAPI = new EvaluacionTallerAPI();
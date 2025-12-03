import { typedApiClient } from "~/features/apiClient/client";

// Interfaces para os dados dos senadores
export interface SenadorData {
  estado: string;
  genero: string;
  idade: number;
  educacao: number;
  impacto_ambiental: number;
  impacto_constitucional: number;
  impacto_economico: number;
  impacto_geopolitico: number;
  impacto_politico_institucional: number;
  impacto_regional: number;
  impacto_social: number;
  impacto_tecnologico: number;
  media: number;
  nome: string;
  partido: string;
  saneamento_basico: number;
  saude: number;
  seguranca: number;
}

export interface DadosSenResponse {
  dados_sen: SenadorData[];
  message: string;
  total_senadores: number;
}

// Interfaces para os dados das PECs
export interface PecData {
  educacao: number;
  impacto_ambiental: number;
  impacto_constitucional: number;
  impacto_economico: number;
  impacto_geopolitico: number;
  impacto_politico_institucional: number;
  impacto_regional: number;
  impacto_social: number;
  impacto_tecnologico: number;
  media: number;
  numero_pac: string;
  qualidade: string;
  saneamento_basico: number;
  saude: number;
  seguranca: number;
}

export interface DadosPecResponse {
  dados_pec: PecData[];
  message: string;
  total_pecs: number;
}

// Interfaces para dados processados dos gráficos
export interface MediaPorPartido {
  partido: string;
  media: number;
  quantidade: number;
}

export interface MediaPorEstado {
  estado: string;
  media: number;
  quantidade: number;
}

export interface ImpactoPorPartido {
  partido: string;
  impacto_ambiental: number;
  impacto_constitucional: number;
  impacto_economico: number;
  impacto_geopolitico: number;
  impacto_politico_institucional: number;
  impacto_regional: number;
  impacto_social: number;
  impacto_tecnologico: number;
}

export interface ImpactoPorEstado {
  estado: string;
  impacto_ambiental: number;
  impacto_constitucional: number;
  impacto_economico: number;
  impacto_geopolitico: number;
  impacto_politico_institucional: number;
  impacto_regional: number;
  impacto_social: number;
  impacto_tecnologico: number;
  quantidade: number;
}

export interface DashboardData {
  mediaPorPartido: MediaPorPartido[];
  mediaPorEstado: MediaPorEstado[];
  impactoPorPartido: ImpactoPorPartido[];
  impactoPorEstado: ImpactoPorEstado[];
  senadores: SenadorData[];
  pecs: PecData[];
  totalSenadores: number;
  totalPecs: number;
}

class DashboardService {
  async getDadosSenadores(): Promise<SenadorData[]> {
    try {
      const response = await typedApiClient.get<DadosSenResponse>("/v1/legislative/dados-sen");
      
      if (response.success && response.data) {
        return response.data.dados_sen;
      }
      
      throw new Error(response.message || "Erro ao buscar dados dos senadores");
    } catch (error) {
      console.error("Erro ao buscar dados dos senadores:", error);
      throw error;
    }
  }

  async getDadosPecs(): Promise<PecData[]> {
    try {
      const response = await typedApiClient.get<DadosPecResponse>("/v1/legislative/dados-pec");
      
      if (response.success && response.data) {
        return response.data.dados_pec;
      }
      
      throw new Error(response.message || "Erro ao buscar dados das PECs");
    } catch (error) {
      console.error("Erro ao buscar dados das PECs:", error);
      throw error;
    }
  }

  // Processa os dados para criar as visualizações
  processDashboardData(senadores: SenadorData[], pecs: PecData[]): DashboardData {
    // Média por partido
    const partidosMap = new Map<string, { total: number; count: number }>();
    
    senadores.forEach(senador => {
      if (senador.partido) {
        const current = partidosMap.get(senador.partido) || { total: 0, count: 0 };
        partidosMap.set(senador.partido, {
          total: current.total + senador.media,
          count: current.count + 1
        });
      }
    });

    const mediaPorPartido: MediaPorPartido[] = Array.from(partidosMap.entries()).map(([partido, data]) => ({
      partido,
      media: data.count > 0 ? data.total / data.count : 0,
      quantidade: data.count
    })).sort((a, b) => b.media - a.media);

    // Média por estado
    const estadosMap = new Map<string, { total: number; count: number }>();
    
    senadores.forEach(senador => {
      if (senador.estado) {
        const current = estadosMap.get(senador.estado) || { total: 0, count: 0 };
        estadosMap.set(senador.estado, {
          total: current.total + senador.media,
          count: current.count + 1
        });
      }
    });

    const mediaPorEstado: MediaPorEstado[] = Array.from(estadosMap.entries()).map(([estado, data]) => ({
      estado,
      media: data.count > 0 ? data.total / data.count : 0,
      quantidade: data.count
    })).sort((a, b) => b.media - a.media);

    // Impacto por partido (soma dos impactos)
    const impactoPartidosMap = new Map<string, {
      impacto_ambiental: number;
      impacto_constitucional: number;
      impacto_economico: number;
      impacto_geopolitico: number;
      impacto_politico_institucional: number;
      impacto_regional: number;
      impacto_social: number;
      impacto_tecnologico: number;
    }>();

    senadores.forEach(senador => {
      if (senador.partido) {
        const current = impactoPartidosMap.get(senador.partido) || {
          impacto_ambiental: 0,
          impacto_constitucional: 0,
          impacto_economico: 0,
          impacto_geopolitico: 0,
          impacto_politico_institucional: 0,
          impacto_regional: 0,
          impacto_social: 0,
          impacto_tecnologico: 0,
        };

        impactoPartidosMap.set(senador.partido, {
          impacto_ambiental: current.impacto_ambiental + senador.impacto_ambiental,
          impacto_constitucional: current.impacto_constitucional + senador.impacto_constitucional,
          impacto_economico: current.impacto_economico + senador.impacto_economico,
          impacto_geopolitico: current.impacto_geopolitico + senador.impacto_geopolitico,
          impacto_politico_institucional: current.impacto_politico_institucional + senador.impacto_politico_institucional,
          impacto_regional: current.impacto_regional + senador.impacto_regional,
          impacto_social: current.impacto_social + senador.impacto_social,
          impacto_tecnologico: current.impacto_tecnologico + senador.impacto_tecnologico,
        });
      }
    });

    const impactoPorPartido: ImpactoPorPartido[] = Array.from(impactoPartidosMap.entries()).map(([partido, impactos]) => ({
      partido,
      ...impactos
    })).sort((a, b) => {
      const totalA = a.impacto_ambiental + a.impacto_constitucional + a.impacto_economico + 
                    a.impacto_geopolitico + a.impacto_politico_institucional + a.impacto_regional + 
                    a.impacto_social + a.impacto_tecnologico;
      const totalB = b.impacto_ambiental + b.impacto_constitucional + b.impacto_economico + 
                    b.impacto_geopolitico + b.impacto_politico_institucional + b.impacto_regional + 
                    b.impacto_social + b.impacto_tecnologico;
      return totalB - totalA;
    });

    // Impacto por estado (média dos impactos)
    const impactoEstadosMap = new Map<string, {
      impacto_ambiental: number;
      impacto_constitucional: number;
      impacto_economico: number;
      impacto_geopolitico: number;
      impacto_politico_institucional: number;
      impacto_regional: number;
      impacto_social: number;
      impacto_tecnologico: number;
      count: number;
    }>();

    senadores.forEach(senador => {
      if (senador.estado) {
        const current = impactoEstadosMap.get(senador.estado) || {
          impacto_ambiental: 0,
          impacto_constitucional: 0,
          impacto_economico: 0,
          impacto_geopolitico: 0,
          impacto_politico_institucional: 0,
          impacto_regional: 0,
          impacto_social: 0,
          impacto_tecnologico: 0,
          count: 0,
        };

        impactoEstadosMap.set(senador.estado, {
          impacto_ambiental: current.impacto_ambiental + senador.impacto_ambiental,
          impacto_constitucional: current.impacto_constitucional + senador.impacto_constitucional,
          impacto_economico: current.impacto_economico + senador.impacto_economico,
          impacto_geopolitico: current.impacto_geopolitico + senador.impacto_geopolitico,
          impacto_politico_institucional: current.impacto_politico_institucional + senador.impacto_politico_institucional,
          impacto_regional: current.impacto_regional + senador.impacto_regional,
          impacto_social: current.impacto_social + senador.impacto_social,
          impacto_tecnologico: current.impacto_tecnologico + senador.impacto_tecnologico,
          count: current.count + 1,
        });
      }
    });

    const impactoPorEstado: ImpactoPorEstado[] = Array.from(impactoEstadosMap.entries()).map(([estado, data]) => ({
      estado,
      impacto_ambiental: data.count > 0 ? data.impacto_ambiental / data.count : 0,
      impacto_constitucional: data.count > 0 ? data.impacto_constitucional / data.count : 0,
      impacto_economico: data.count > 0 ? data.impacto_economico / data.count : 0,
      impacto_geopolitico: data.count > 0 ? data.impacto_geopolitico / data.count : 0,
      impacto_politico_institucional: data.count > 0 ? data.impacto_politico_institucional / data.count : 0,
      impacto_regional: data.count > 0 ? data.impacto_regional / data.count : 0,
      impacto_social: data.count > 0 ? data.impacto_social / data.count : 0,
      impacto_tecnologico: data.count > 0 ? data.impacto_tecnologico / data.count : 0,
      quantidade: data.count,
    })).sort((a, b) => b.estado.localeCompare(a.estado));

    return {
      mediaPorPartido,
      mediaPorEstado,
      impactoPorPartido,
      impactoPorEstado,
      senadores,
      pecs,
      totalSenadores: senadores.length,
      totalPecs: pecs.length
    };
  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      const [senadores, pecs] = await Promise.all([
        this.getDadosSenadores(),
        this.getDadosPecs()
      ]);

      return this.processDashboardData(senadores, pecs);
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();

import { apiClient } from '~/lib/api';
import type { ProjectsResponse, ProjectDetailResponse } from '~/types';

export class ProjectService {
  /**
   * Busca todos os processos/projetos
   */
  static async getAllProjects(): Promise<ProjectsResponse> {
    console.log('getAllProjects');
    const response = await apiClient.get<ProjectsResponse>('/processo/geral');
    console.log('response', response.data);
    return response.data;
  }

  /**
   * Busca detalhes de um processo/projeto específico
   * @param processoCodigo - Código do processo
   */
  static async getProjectDetail(processoCodigo: string): Promise<ProjectDetailResponse> {
    const response = await apiClient.get<ProjectDetailResponse>(
      `/processo/${processoCodigo}`
    );
    return response.data;
  }
}
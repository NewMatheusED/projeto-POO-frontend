import { apiClient } from '~/lib/api';
import type { ProjectVotesResponse } from '~/types';

export class VotingService {
  /**
   * Busca votações de um processo específico
   * @param processoCodigo - Código do processo
   */
  static async getProjectVotes(processoCodigo: string): Promise<ProjectVotesResponse> {
    console.log('getProjectVotes', processoCodigo);
    const response = await apiClient.get<ProjectVotesResponse>(
      `/votacoes/${processoCodigo}`
    );
    console.log('response', response.data);
    return response.data;
  }
}
import { apiClient } from '~/lib/api';
import type { SenatorsResponse, SenatorDetailResponse, SenatorVotesResponse } from '~/types';

export class SenatorService {
  /**
   * Busca todos os senadores
   */
  static async getAllSenators(): Promise<SenatorsResponse> {
    console.log('getAllSenators');
    const response = await apiClient.get<SenatorsResponse>('/senado/senadores');
    console.log('response', response.data);
    return response.data;
  }

  /**
   * Busca detalhes de um senador específico
   * @param codigo - Código do senador
   */
  static async getSenatorDetail(codigo: string): Promise<SenatorDetailResponse> {
    const response = await apiClient.get<SenatorDetailResponse>(
      `/senado/senadores/${codigo}/detalhe`
    );
    return response.data;
  }

  /**
   * Busca votações de um senador específico
   * @param codigo - Código do senador
   */
  static async getSenatorVotes(codigo: string): Promise<SenatorVotesResponse> {
    console.log('getSenatorVotes', codigo);
    const response = await apiClient.get<SenatorVotesResponse>(
      `/senado/senadores/${codigo}/votacoes`
    );
    console.log('response', response.data);
    return response.data;
  }
}

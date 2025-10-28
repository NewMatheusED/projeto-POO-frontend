import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";

// Tipagem para o payload de análise legislativa
export interface LegislativeAnalysisPayload {
  project_id: string;
  analysis_data: {
    contexto_epoca: string;
    resumo_objetivo: string;
    interpretacao_simplificada: string;
    avaliacao_parametrica: Array<{
      criterio: string;
      resumo: string;
      nota: number;
      justificativa: string;
    }>;
  };
}

// Tipagem para a resposta da análise
export interface LegislativeAnalysisResponse {
  success: boolean;
  message: string;
  data?: {
    analysis_id: string;
    project_id: string;
    created_at: string;
    status: string;
  };
}

class LegislativeService {
  /**
   * Envia análise legislativa para o backend
   */
  async saveDirectAnalysis(payload: LegislativeAnalysisPayload): Promise<ApiResponse<LegislativeAnalysisResponse>> {
    try {
      const response = await typedApiClient.post<LegislativeAnalysisResponse>(
        "/v1/legislative/save-direct",
        payload
      );
      
      return response;
    } catch (error) {
      console.error("Erro ao salvar análise legislativa:", error);
      return {
        success: false,
        data: {} as LegislativeAnalysisResponse,
        message: "Erro ao salvar análise legislativa. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }

  /**
   * Valida se o payload está no formato correto
   */
  validatePayload(payload: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!payload || typeof payload !== "object") {
      errors.push("Payload deve ser um objeto JSON");
      return { isValid: false, errors };
    }

    const data = payload as Record<string, unknown>;

    if (!data.project_id || typeof data.project_id !== "string") {
      errors.push("Campo 'project_id' é obrigatório e deve ser uma string");
    }

    if (!data.analysis_data || typeof data.analysis_data !== "object") {
      errors.push("Campo 'analysis_data' é obrigatório e deve ser um objeto");
    } else {
      const analysisData = data.analysis_data as Record<string, unknown>;

      const requiredFields = [
        "contexto_epoca",
        "resumo_objetivo", 
        "interpretacao_simplificada",
        "avaliacao_parametrica"
      ];

      requiredFields.forEach(field => {
        if (!analysisData[field]) {
          errors.push(`Campo 'analysis_data.${field}' é obrigatório`);
        }
      });

      // Validação específica para avaliacao_parametrica
      if (analysisData.avaliacao_parametrica) {
        if (!Array.isArray(analysisData.avaliacao_parametrica)) {
          errors.push("Campo 'analysis_data.avaliacao_parametrica' deve ser um array");
        } else {
          analysisData.avaliacao_parametrica.forEach((item: unknown, index: number) => {
            if (!item || typeof item !== "object") {
              errors.push(`Item ${index} de 'avaliacao_parametrica' deve ser um objeto`);
            } else {
              const itemData = item as Record<string, unknown>;
              const requiredItemFields = ["criterio", "resumo", "nota", "justificativa"];
              
              requiredItemFields.forEach(field => {
                if (!itemData[field]) {
                  errors.push(`Item ${index} de 'avaliacao_parametrica' deve ter o campo '${field}'`);
                }
              });

              if (itemData.nota && typeof itemData.nota !== "number") {
                errors.push(`Item ${index} de 'avaliacao_parametrica' deve ter 'nota' como número`);
              }
            }
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const legislativeService = new LegislativeService();

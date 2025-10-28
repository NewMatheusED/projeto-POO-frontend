import axios from "axios";

// Tipagem para a resposta dos health checks
interface HealthCheckResponse {
  datetime: string;
  status: "up" | "down" | string;
}

// Tipagem para o status de cada serviço
export interface ServiceStatus {
  service: string;
  status: "healthy" | "unhealthy" | "unknown";
  responseTime?: number;
  lastChecked: string;
  message?: string;
  details?: HealthCheckResponse;
}

// Tipagem para o status geral
export interface OverallStatus {
  overall: "healthy" | "degraded" | "unhealthy";
  services: ServiceStatus[];
  lastUpdated: string;
}

class StatusService {
  private readonly services = [
    { name: "IA", endpoint: "/v1/ia", description: "Serviço de Inteligência Artificial" },
    { name: "Legislative", endpoint: "/v1/legislative", description: "Serviço Legislativo" },
    { name: "Processing", endpoint: "/v1/processing", description: "Serviço de Processamento" },
    { name: "Health", endpoint: "/v1/health", description: "Health Check Geral" },
  ];

  async checkServiceStatus(endpoint: string, serviceName: string): Promise<ServiceStatus> {
    const startTime = Date.now();
    
    try {
      const response = await axios.get<HealthCheckResponse>(endpoint, {
        timeout: 5000, // 5 segundos de timeout
        baseURL: import.meta.env.API_URL,
        withCredentials: true,
      });

      console.log("response", response);
      
      const responseTime = Date.now() - startTime;
      
      // Diferentes padrões de resposta:
      // Health geral: { datetime: "...", status: "up" }
      // Outros serviços: { data: { data: { status: "healthy", message: "..." }, success: true } }
      
      let healthData;
      let isHealthy;
      let message;
      
      if (endpoint === "/v1/health") {
        // Health check geral tem estrutura simples
        healthData = response.data;
        isHealthy = healthData.status === "up";
        message = isHealthy ? "Sistema funcionando normalmente" : `Status: ${healthData.status}`;
        console.log("Health check:", { healthData, isHealthy, message });
      } else {
        // Outros serviços têm estrutura aninhada
        healthData = response.data.data?.data || response.data;
        
        // O status real está em healthData.data.status
        const actualStatus = healthData.data?.status || healthData.status;
        const actualMessage = healthData.data?.message || healthData.message;
        
        isHealthy = actualStatus === "healthy" || actualStatus === "up";
        message = actualMessage || (isHealthy ? "Serviço funcionando normalmente" : `Status: ${actualStatus}`);
        
        console.log("Other service:", { 
          serviceName, 
          healthData, 
          actualStatus, 
          actualMessage,
          isHealthy, 
          message, 
          endpoint 
        });
      }
      
      return {
        service: serviceName,
        status: isHealthy ? "healthy" : "unhealthy",
        responseTime,
        lastChecked: new Date().toISOString(),
        message,
        details: healthData,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      let errorMessage = "Erro desconhecido";
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = "Timeout - Serviço não respondeu";
        } else if (error.response) {
          errorMessage = `Erro ${error.response.status}: ${error.response.statusText}`;
        } else if (error.request) {
          errorMessage = "Serviço não disponível";
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        service: serviceName,
        status: "unhealthy",
        responseTime,
        lastChecked: new Date().toISOString(),
        message: errorMessage,
      };
    }
  }

  async checkAllServices(): Promise<OverallStatus> {
    const promises = this.services.map(({ endpoint, name }) =>
      this.checkServiceStatus(endpoint, name)
    );

    const results = await Promise.allSettled(promises);
    const services: ServiceStatus[] = results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        return {
          service: this.services[index].name,
          status: "unknown",
          lastChecked: new Date().toISOString(),
          message: "Falha ao verificar status",
        };
      }
    });

    // Determinar status geral
    const unhealthyCount = services.filter(s => s.status === "unhealthy").length;
    
    let overall: "healthy" | "degraded" | "unhealthy";
    if (unhealthyCount === 0) {
      overall = "healthy";
    } else if (unhealthyCount < services.length / 2) {
      overall = "degraded";
    } else {
      overall = "unhealthy";
    }

    return {
      overall,
      services,
      lastUpdated: new Date().toISOString(),
    };
  }

  async refreshStatus(): Promise<OverallStatus> {
    return this.checkAllServices();
  }
}

export const statusService = new StatusService();

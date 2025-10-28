import { useEffect, useState } from "react";
import { statusService, type OverallStatus } from "~/features/status/service";
import OverallStatusCard from "~/features/status/components/OverallStatusCard/OverallStatusCard";
import ServiceStatusCard from "~/features/status/components/ServiceStatusCard/ServiceStatusCard";

export default function StatusPage() {
  const [status, setStatus] = useState<OverallStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const loadStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await statusService.checkAllServices();
      setStatus(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadStatus();
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  useEffect(() => {
    loadStatus();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        loadStatus();
      }, 30000); // Atualiza a cada 30 segundos
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh]);

  return (
    <div className="min-h-screen bg-ai-dark-blue p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-ai-neon-blue to-ai-accent-cyan bg-clip-text text-transparent">
                Monitoramento de Serviços
              </h1>
              <p className="text-ai-gray mt-2">
                Verificação em tempo real do status dos serviços do backend
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Auto Refresh Toggle */}
              <button
                onClick={toggleAutoRefresh}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  autoRefresh
                    ? "bg-ai-accent-green text-ai-white border border-ai-accent-green"
                    : "bg-ai-dark-blue-card text-ai-gray border border-ai-neon-blue/30 hover:border-ai-neon-blue/60"
                }`}
              >
                {autoRefresh ? "Auto Refresh ON" : "Auto Refresh OFF"}
              </button>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-ai-neon-blue to-ai-accent-cyan text-ai-white rounded-lg font-medium hover:from-ai-neon-blue-bright hover:to-ai-accent-cyan transition-all duration-300 shadow-lg shadow-ai-neon-blue/50 hover:shadow-ai-neon-blue/70 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verificando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Atualizar
                  </div>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-ai-accent-red/10 to-ai-accent-red/5 border border-ai-accent-red/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-ai-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-ai-accent-red font-medium">Erro ao carregar status: {error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Status Cards */}
        <div className="space-y-6">
          {/* Overall Status */}
          <OverallStatusCard status={status} isLoading={isLoading} />

          {/* Individual Services */}
          <div>
            <h2 className="text-xl font-semibold text-ai-white mb-4">
              Status dos Serviços
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <ServiceStatusCard
                    key={index}
                    service={{
                      service: "",
                      status: "unknown",
                      lastChecked: "",
                    }}
                    isLoading={true}
                  />
                ))
              ) : status ? (
                status.services.map((service, index) => (
                  <ServiceStatusCard
                    key={index}
                    service={service}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-ai-gray">Nenhum dado de status disponível</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 pt-6 border-t border-ai-neon-blue/20">
          <div className="text-center">
            <p className="text-ai-gray text-sm">
              Sistema de monitoramento em tempo real • Atualização automática a cada 30 segundos quando ativada
            </p>
            <div className="flex justify-center gap-6 mt-4 text-xs text-ai-gray-dark">
              <span>Endpoint: /v1/ia</span>
              <span>Endpoint: /v1/legislative</span>
              <span>Endpoint: /v1/processing</span>
              <span>Endpoint: /v1/health</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

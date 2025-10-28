import type { OverallStatus } from "../../service";

interface OverallStatusCardProps {
  status: OverallStatus;
  isLoading?: boolean;
}

export default function OverallStatusCard({ status, isLoading = false }: OverallStatusCardProps) {
  const getOverallStatusColor = (overall: OverallStatus["overall"]) => {
    switch (overall) {
      case "healthy":
        return "text-ai-accent-green";
      case "degraded":
        return "text-ai-accent-yellow";
      case "unhealthy":
        return "text-ai-accent-red";
    }
  };

  const getOverallStatusBgColor = (overall: OverallStatus["overall"]) => {
    switch (overall) {
      case "healthy":
        return "bg-gradient-to-br from-ai-accent-green/20 to-ai-accent-green/10 border-ai-accent-green/40";
      case "degraded":
        return "bg-gradient-to-br from-ai-accent-yellow/20 to-ai-accent-yellow/10 border-ai-accent-yellow/40";
      case "unhealthy":
        return "bg-gradient-to-br from-ai-accent-red/20 to-ai-accent-red/10 border-ai-accent-red/40";
    }
  };

  const getOverallStatusIcon = (overall: OverallStatus["overall"]) => {
    switch (overall) {
      case "healthy":
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "degraded":
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case "unhealthy":
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getOverallStatusText = (overall: OverallStatus["overall"]) => {
    switch (overall) {
      case "healthy":
        return "Todos os Serviços Funcionando";
      case "degraded":
        return "Alguns Serviços com Problemas";
      case "unhealthy":
        return "Múltiplos Serviços com Problemas";
    }
  };

  const getServiceStats = () => {
    const healthy = status.services.filter(s => s.status === "healthy").length;
    const unhealthy = status.services.filter(s => s.status === "unhealthy").length;
    const unknown = status.services.filter(s => s.status === "unknown").length;
    const total = status.services.length;

    return { healthy, unhealthy, unknown, total };
  };

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-ai-dark-blue-card border border-ai-neon-blue/20 rounded-xl p-6 backdrop-blur-sm">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-8 bg-ai-dark-blue-tertiary rounded w-48"></div>
            <div className="h-10 w-10 bg-ai-dark-blue-tertiary rounded-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-ai-dark-blue-tertiary rounded w-full"></div>
            <div className="h-4 bg-ai-dark-blue-tertiary rounded w-3/4"></div>
            <div className="h-4 bg-ai-dark-blue-tertiary rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const stats = getServiceStats();

  return (
    <div className={`${getOverallStatusBgColor(status.overall)} border rounded-xl p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-ai-neon-blue/10`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-ai-white mb-2">
            Status Geral do Sistema
          </h2>
          <div className={`flex items-center gap-3 ${getOverallStatusColor(status.overall)}`}>
            {getOverallStatusIcon(status.overall)}
            <span className="text-lg font-semibold">
              {getOverallStatusText(status.overall)}
            </span>
          </div>
        </div>
        <div className={`${getOverallStatusColor(status.overall)}`}>
          {getOverallStatusIcon(status.overall)}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-ai-accent-green">{stats.healthy}</div>
          <div className="text-sm text-ai-gray">Funcionando</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-ai-accent-red">{stats.unhealthy}</div>
          <div className="text-sm text-ai-gray">Com Problemas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-ai-accent-yellow">{stats.unknown}</div>
          <div className="text-sm text-ai-gray">Desconhecido</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-ai-white">{stats.total}</div>
          <div className="text-sm text-ai-gray">Total</div>
        </div>
      </div>

      <div className="pt-4 border-t border-ai-neon-blue/20">
        <div className="flex justify-between text-sm">
          <span className="text-ai-gray">Última Atualização:</span>
          <span className="text-ai-white font-mono">
            {formatLastUpdated(status.lastUpdated)}
          </span>
        </div>
      </div>
    </div>
  );
}

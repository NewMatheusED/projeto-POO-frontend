import type { ServiceStatus } from "../../service";

interface ServiceStatusCardProps {
  service: ServiceStatus;
  isLoading?: boolean;
}

export default function ServiceStatusCard({ service, isLoading = false }: ServiceStatusCardProps) {
  const getStatusColor = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "healthy":
        return "text-ai-accent-green";
      case "unhealthy":
        return "text-ai-accent-red";
      case "unknown":
      default:
        return "text-ai-accent-yellow";
    }
  };

  const getStatusBgColor = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-gradient-to-br from-ai-accent-green/10 to-ai-accent-green/5 border-ai-accent-green/30";
      case "unhealthy":
        return "bg-gradient-to-br from-ai-accent-red/10 to-ai-accent-red/5 border-ai-accent-red/30";
      case "unknown":
      default:
        return "bg-gradient-to-br from-ai-accent-yellow/10 to-ai-accent-yellow/5 border-ai-accent-yellow/30";
    }
  };

  const getStatusIcon = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "healthy":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "unhealthy":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case "unknown":
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatResponseTime = (time?: number) => {
    if (!time) return "N/A";
    return `${time}ms`;
  };

  const formatLastChecked = (timestamp: string) => {
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
            <div className="h-6 bg-ai-dark-blue-tertiary rounded w-24"></div>
            <div className="h-8 w-8 bg-ai-dark-blue-tertiary rounded-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-ai-dark-blue-tertiary rounded w-full"></div>
            <div className="h-4 bg-ai-dark-blue-tertiary rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${getStatusBgColor(service.status)} border rounded-xl p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-ai-neon-blue/10`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-ai-white mb-1">
            {service.service}
          </h3>
          <div className={`flex items-center gap-2 ${getStatusColor(service.status)}`}>
            {getStatusIcon(service.status)}
            <span className="font-medium capitalize">
              {service.status === "healthy" ? "Funcionando" : 
               service.status === "unhealthy" ? "Com Problemas" : "Desconhecido"}
            </span>
          </div>
        </div>
        <div className={`${getStatusColor(service.status)}`}>
          {getStatusIcon(service.status)}
        </div>
      </div>

      <div className="space-y-3">
        {service.responseTime && (
          <div className="flex justify-between text-sm">
            <span className="text-ai-gray">Tempo de Resposta:</span>
            <span className="text-ai-white font-mono">
              {formatResponseTime(service.responseTime)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-ai-gray">Última Verificação:</span>
          <span className="text-ai-white">
            {formatLastChecked(service.lastChecked)}
          </span>
        </div>

        {service.message && (
          <div className="pt-2 border-t border-ai-neon-blue/20">
            <p className="text-sm text-ai-gray">
              {service.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

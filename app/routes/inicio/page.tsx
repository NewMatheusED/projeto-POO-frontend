import React, { useEffect, useState } from "react";
import { useAuthInterceptor } from "~/hooks/useAuthInterceptor";
import { dashboardService, type DashboardData } from "~/features/dashboard/service";
import MediaPorPartidoChart from "~/features/dashboard/components/MediaPorPartidoChart/MediaPorPartidoChart";
import MediaPorEstadoChart from "~/features/dashboard/components/MediaPorEstadoChart/MediaPorEstadoChart";
import HeatmapChart from "~/features/dashboard/components/HeatmapChart/HeatmapChart";
import IdadeDistributionChart from "~/features/dashboard/components/IdadeDistributionChart/IdadeDistributionChart";
import GeneroDistributionChart from "~/features/dashboard/components/GeneroDistributionChart/GeneroDistributionChart";
import RadarChart from "~/features/dashboard/components/RadarChart/RadarChart";
import TopSenadoresChart from "~/features/dashboard/components/TopSenadoresChart/TopSenadoresChart";
import QualidadePecsChart from "~/features/dashboard/components/QualidadePecsChart/QualidadePecsChart";
import EstadosMap from "~/features/dashboard/components/EstadosMap/EstadosMap";
import Logo from "~/src/components/Logo";

export default function DashboardPage() {
  useAuthInterceptor();
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
      setError("Erro ao carregar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ai-dark-blue via-ai-darker-blue to-ai-dark-blue flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" />
          <div className="mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ai-neon-blue mx-auto"></div>
            <p className="mt-4 text-ai-gray">Carregando dados do dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ai-dark-blue via-ai-darker-blue to-ai-dark-blue flex items-center justify-center">
        <div className="text-center">
          <div className="bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-accent-red/30 rounded-xl p-8 max-w-md">
            <div className="text-ai-accent-red text-6xl mb-4">⚠️</div>
            <h2 className="text-ai-white text-xl font-bold mb-4">Erro ao Carregar Dados</h2>
            <p className="text-ai-gray mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-ai-neon-blue hover:bg-ai-neon-blue/80 text-ai-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-ai-neon-blue/25"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ai-dark-blue via-ai-darker-blue to-ai-dark-blue flex items-center justify-center">
        <div className="text-center">
          <div className="text-ai-gray">Nenhum dado disponível</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ai-dark-blue via-ai-darker-blue to-ai-dark-blue p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo size="md" />
              <div>
                <h1 className="text-3xl font-bold text-ai-white">
                  Dashboard Legislativo
                </h1>
                <p className="text-ai-gray mt-1">
                  Análise de Impacto dos Senadores e Projetos
                </p>
              </div>
            </div>
            
            <button
              onClick={handleRefresh}
              className="bg-ai-neon-purple hover:bg-ai-neon-purple/80 text-ai-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-ai-neon-purple/25 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Atualizar</span>
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-blue/30 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ai-gray text-sm font-medium">Total Senadores</p>
                <p className="text-2xl font-bold text-ai-neon-blue">{dashboardData.totalSenadores}</p>
              </div>
              <div className="text-ai-neon-blue/20">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-purple/30 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ai-gray text-sm font-medium">Total PECs</p>
                <p className="text-2xl font-bold text-ai-neon-purple">{dashboardData.totalPecs}</p>
              </div>
              <div className="text-ai-neon-purple/20">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-green/30 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ai-gray text-sm font-medium">Partidos Ativos</p>
                <p className="text-2xl font-bold text-ai-neon-green">{dashboardData.mediaPorPartido.length}</p>
              </div>
              <div className="text-ai-neon-green/20">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-pink/30 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ai-gray text-sm font-medium">Estados Representados</p>
                <p className="text-2xl font-bold text-ai-neon-pink">{dashboardData.mediaPorEstado.length}</p>
              </div>
              <div className="text-ai-neon-pink/20">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Seções Organizadas */}
        <div className="space-y-12">
          
          {/* SEÇÃO 1: ANÁLISE POR PARTIDOS E ESTADOS */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ai-white mb-2">📊 Análise por Partidos e Estados</h2>
              <p className="text-ai-gray">Distribuição de impacto político e representação territorial</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MediaPorPartidoChart data={dashboardData.mediaPorPartido} />
              <MediaPorEstadoChart data={dashboardData.mediaPorEstado} />
            </div>
          </section>

          {/* SEÇÃO 2: MAPA DOS ESTADOS */}
          {/* <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ai-white mb-2">🗺️ Mapa dos Estados</h2>
              <p className="text-ai-gray">Visualização geográfica da distribuição e impacto dos senadores</p>
            </div>
            <EstadosMap data={dashboardData.senadores} />
          </section> */}

          {/* SEÇÃO 3: PERFIL DEMOGRÁFICO */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ai-white mb-2">👥 Perfil Demográfico</h2>
              <p className="text-ai-gray">Análise da composição etária e de gênero do Senado</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IdadeDistributionChart data={dashboardData.senadores} />
              <GeneroDistributionChart data={dashboardData.senadores} />
            </div>
          </section>

          {/* SEÇÃO 4: ANÁLISE DE IMPACTOS */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ai-white mb-2">🎯 Análise de Impactos</h2>
              <p className="text-ai-gray">Radar dos tipos de impacto e qualidade dos projetos legislativos</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RadarChart data={dashboardData.senadores} />
              <QualidadePecsChart data={dashboardData.pecs} />
            </div>
          </section>

          {/* SEÇÃO 5: RANKINGS */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ai-white mb-2">🏆 Rankings</h2>
              <p className="text-ai-gray">Top senadores com maior impacto político</p>
            </div>
            <TopSenadoresChart data={dashboardData.senadores} topN={10} />
          </section>

          {/* SEÇÃO 6: MAPA DE CALOR DETALHADO */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ai-white mb-2">🔥 Mapa de Calor Detalhado</h2>
              <p className="text-ai-gray">Análise comparativa dos impactos por partido e categoria</p>
            </div>
            <HeatmapChart data={dashboardData.impactoPorPartido} />
          </section>

        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-ai-gray text-sm">
            Dados atualizados em tempo real • Sistema de Análise Legislativa com IA
          </p>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { SenadorData } from "../../service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TopSenadoresChartProps {
  data: SenadorData[];
  topN?: number;
}

export default function TopSenadoresChart({ data, topN = 10 }: TopSenadoresChartProps) {
  // Ordenar senadores por média de impacto e pegar os top N
  const topSenadores = [...data]
    .sort((a, b) => b.media - a.media)
    .slice(0, topN);

  const chartData = {
    labels: topSenadores.map(senador => {
      // Abreviar nomes muito longos
      const nome = senador.nome.length > 15 
        ? senador.nome.substring(0, 15) + "..." 
        : senador.nome;
      return `${nome} (${senador.partido})`;
    }),
    datasets: [
      {
        label: "Média de Impacto",
        data: topSenadores.map(senador => senador.media),
        backgroundColor: topSenadores.map((_, index) => {
          // Gradiente de cores baseado na posição (top = mais vibrante)
          const intensity = 1 - (index / topN);
          const colors = [
            `rgba(0, 217, 255, ${0.6 + intensity * 0.4})`,     // Cyan neon
            `rgba(139, 92, 246, ${0.6 + intensity * 0.4})`,    // Purple neon
            `rgba(236, 72, 153, ${0.6 + intensity * 0.4})`,    // Pink neon
            `rgba(34, 197, 94, ${0.6 + intensity * 0.4})`,     // Green neon
            `rgba(251, 191, 36, ${0.6 + intensity * 0.4})`,    // Yellow neon
          ];
          return colors[index % colors.length];
        }),
        borderColor: topSenadores.map((_, index) => {
          const intensity = 1 - (index / topN);
          const borderColors = [
            `rgba(0, 217, 255, ${0.8 + intensity * 0.2})`,
            `rgba(139, 92, 246, ${0.8 + intensity * 0.2})`,
            `rgba(236, 72, 153, ${0.8 + intensity * 0.2})`,
            `rgba(34, 197, 94, ${0.8 + intensity * 0.2})`,
            `rgba(251, 191, 36, ${0.8 + intensity * 0.2})`,
          ];
          return borderColors[index % borderColors.length];
        }),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Top ${topN} Senadores por Impacto`,
        color: "#e5e7eb",
        font: {
          size: 18,
          weight: "bold" as const,
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#00d9ff",
        bodyColor: "#e5e7eb",
        borderColor: "#00d9ff",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function(context: any) {
            const senador = topSenadores[context.dataIndex];
            return [
              `Nome: ${senador.nome}`,
              `Partido: ${senador.partido}`,
              `Estado: ${senador.estado || 'N/A'}`,
              `Idade: ${senador.idade} anos`,
              `Gênero: ${senador.genero === 'M' ? 'Masculino' : 'Feminino'}`,
              `Média: ${senador.media.toFixed(2)}`,
              `Posição: #${context.dataIndex + 1}`
            ];
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(107, 114, 128, 0.3)",
          drawBorder: false,
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 12,
          },
        },
        beginAtZero: true,
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#e5e7eb",
          font: {
            size: 11,
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const maiorImpacto = topSenadores[0];
  const menorImpactoTop = topSenadores[topSenadores.length - 1];
  const mediaTop = topSenadores.reduce((acc, senador) => acc + senador.media, 0) / topSenadores.length;

  return (
    <div className="bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-yellow/30 rounded-xl p-6 shadow-2xl">
      <div className="h-96">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Estatísticas */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-ai-neon-yellow font-bold text-lg">{maiorImpacto?.media.toFixed(2) || "0.00"}</div>
          <div className="text-ai-gray text-sm">Maior Impacto</div>
          <div className="text-ai-gray text-xs">{maiorImpacto?.nome || "N/A"}</div>
        </div>
        <div className="text-center">
          <div className="text-ai-neon-blue font-bold text-lg">{mediaTop.toFixed(2)}</div>
          <div className="text-ai-gray text-sm">Média do Top {topN}</div>
        </div>
        <div className="text-center">
          <div className="text-ai-neon-green font-bold text-lg">{menorImpactoTop?.media.toFixed(2) || "0.00"}</div>
          <div className="text-ai-gray text-sm">Menor no Top</div>
          <div className="text-ai-gray text-xs">{menorImpactoTop?.nome || "N/A"}</div>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="mt-4 p-3 bg-ai-darker-blue/50 rounded-lg border border-ai-neon-yellow/20">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-ai-neon-yellow font-bold text-sm">
              {topSenadores.filter(s => s.genero === 'F').length} Mulheres
            </div>
            <div className="text-ai-gray text-xs">no Top {topN}</div>
          </div>
          <div>
            <div className="text-ai-neon-blue font-bold text-sm">
              {new Set(topSenadores.map(s => s.partido)).size} Partidos
            </div>
            <div className="text-ai-gray text-xs">representados</div>
          </div>
        </div>
      </div>
    </div>
  );
}

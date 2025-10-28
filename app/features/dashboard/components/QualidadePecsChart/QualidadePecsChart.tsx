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
import type { PecData } from "../../service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface QualidadePecsChartProps {
  data: PecData[];
}

export default function QualidadePecsChart({ data }: QualidadePecsChartProps) {
  // Contar PECs por qualidade
  const boa = data.filter(pec => pec.qualidade === "boa").length;
  const ruim = data.filter(pec => pec.qualidade === "ruim").length;

  const chartData = {
    labels: ["Boa Qualidade", "Baixa Qualidade"],
    datasets: [
      {
        label: "Quantidade de PECs",
        data: [boa, ruim],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",    // Green neon para boa qualidade
          "rgba(239, 68, 68, 0.8)",    // Red neon para ruim qualidade
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Distribuição de Qualidade das PECs",
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
            const total = boa + ruim;
            const value = context.parsed.y || context.parsed;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
            const qualidade = context.label;
            return [
              `${qualidade}: ${value} PECs`,
              `${percentage}% do total`
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
      },
      y: {
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
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const totalPecs = data.length;
  const percentualBoa = totalPecs > 0 ? ((boa / totalPecs) * 100).toFixed(1) : "0";
  const percentualRuim = totalPecs > 0 ? ((ruim / totalPecs) * 100).toFixed(1) : "0";
  
  // Calcular média geral das PECs
  const mediaGeral = totalPecs > 0 ? (data.reduce((acc, pec) => acc + pec.media, 0) / totalPecs).toFixed(2) : "0.00";

  return (
    <div className="bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-red/30 rounded-xl p-6 shadow-2xl">
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Estatísticas */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-ai-neon-green font-bold text-lg">{boa}</div>
          <div className="text-ai-gray text-sm">Boa Qualidade ({percentualBoa}%)</div>
        </div>
        <div className="text-center">
          <div className="text-ai-neon-red font-bold text-lg">{ruim}</div>
          <div className="text-ai-gray text-sm">Baixa Qualidade ({percentualRuim}%)</div>
        </div>
        <div className="text-center">
          <div className="text-ai-neon-blue font-bold text-lg">{mediaGeral}</div>
          <div className="text-ai-gray text-sm">Média Geral</div>
        </div>
      </div>

      {/* Análise da qualidade */}
      <div className="mt-4 p-3 bg-ai-darker-blue/50 rounded-lg border border-ai-neon-red/20">
        <div className="text-center">
          <div className="text-ai-neon-red font-bold text-sm">
            Análise de Qualidade das PECs
          </div>
          <div className="text-ai-gray text-xs mt-1">
            {parseFloat(percentualBoa) > 50 
              ? "✅ Maioria das PECs têm boa qualidade" 
              : "⚠️ Maioria das PECs têm baixa qualidade"}
          </div>
        </div>
      </div>

      {/* Top 3 PECs com melhor qualidade */}
      <div className="mt-4">
        <h4 className="text-ai-white font-bold text-sm mb-2">Top 3 PECs com Maior Impacto:</h4>
        <div className="space-y-1">
          {data
            .sort((a, b) => b.media - a.media)
            .slice(0, 3)
            .map((pec, index) => (
              <div key={pec.numero_pac} className="flex justify-between items-center p-2 bg-ai-darker-blue/30 rounded">
                <span className="text-ai-gray text-xs">
                  #{index + 1} {pec.numero_pac}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-ai-white text-xs font-bold">
                    {pec.media.toFixed(2)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    pec.qualidade === 'boa' 
                      ? 'bg-ai-neon-green/20 text-ai-neon-green' 
                      : 'bg-ai-neon-red/20 text-ai-neon-red'
                  }`}>
                    {pec.qualidade}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

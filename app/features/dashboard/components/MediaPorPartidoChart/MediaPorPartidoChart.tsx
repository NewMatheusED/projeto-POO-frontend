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
import type { MediaPorPartido } from "../../service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MediaPorPartidoChartProps {
  data: MediaPorPartido[];
}

export default function MediaPorPartidoChart({ data }: MediaPorPartidoChartProps) {
  const chartData = {
    labels: data.map(item => item.partido),
    datasets: [
      {
        label: "Média de Impacto",
        data: data.map(item => item.media),
        backgroundColor: data.map((_, index) => {
          // Gradiente de cores neon para cada barra
          const colors = [
            "rgba(0, 217, 255, 0.8)",    // Cyan neon
            "rgba(139, 92, 246, 0.8)",   // Purple neon
            "rgba(236, 72, 153, 0.8)",   // Pink neon
            "rgba(34, 197, 94, 0.8)",    // Green neon
            "rgba(251, 191, 36, 0.8)",   // Yellow neon
            "rgba(239, 68, 68, 0.8)",    // Red neon
            "rgba(168, 85, 247, 0.8)",   // Violet neon
            "rgba(59, 130, 246, 0.8)",   // Blue neon
            "rgba(16, 185, 129, 0.8)",   // Emerald neon
            "rgba(245, 101, 101, 0.8)",  // Rose neon
          ];
          return colors[index % colors.length];
        }),
        borderColor: data.map((_, index) => {
          const borderColors = [
            "rgba(0, 217, 255, 1)",      // Cyan neon border
            "rgba(139, 92, 246, 1)",     // Purple neon border
            "rgba(236, 72, 153, 1)",     // Pink neon border
            "rgba(34, 197, 94, 1)",      // Green neon border
            "rgba(251, 191, 36, 1)",     // Yellow neon border
            "rgba(239, 68, 68, 1)",      // Red neon border
            "rgba(168, 85, 247, 1)",     // Violet neon border
            "rgba(59, 130, 246, 1)",     // Blue neon border
            "rgba(16, 185, 129, 1)",     // Emerald neon border
            "rgba(245, 101, 101, 1)",    // Rose neon border
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
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Média de Impacto por Partido",
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
          label: function(context: any) {
            const item = data[context.dataIndex];
            return [
              `Partido: ${item.partido}`,
              `Média: ${item.media.toFixed(2)}`,
              `Senadores: ${item.quantidade}`
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

  return (
    <div className="bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-blue/30 rounded-xl p-6 shadow-2xl">
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Estatísticas resumidas */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-ai-neon-blue font-bold text-lg">
            {data.length}
          </div>
          <div className="text-ai-gray text-sm">Partidos</div>
        </div>
        <div className="text-center">
          <div className="text-ai-neon-purple font-bold text-lg">
            {data.length > 0 ? data[0].media.toFixed(2) : "0.00"}
          </div>
          <div className="text-ai-gray text-sm">Maior Média</div>
        </div>
        <div className="text-center">
          <div className="text-ai-neon-green font-bold text-lg">
            {data.length > 0 ? (data.reduce((acc, item) => acc + item.media, 0) / data.length).toFixed(2) : "0.00"}
          </div>
          <div className="text-ai-gray text-sm">Média Geral</div>
        </div>
      </div>
    </div>
  );
}

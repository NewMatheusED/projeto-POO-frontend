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

interface IdadeDistributionChartProps {
  data: SenadorData[];
}

export default function IdadeDistributionChart({ data }: IdadeDistributionChartProps) {
  // Criar faixas etárias
  const faixasEtarias = [
    { label: "30-40", min: 30, max: 40, color: "rgba(0, 217, 255, 0.8)" },
    { label: "40-50", min: 40, max: 50, color: "rgba(139, 92, 246, 0.8)" },
    { label: "50-60", min: 50, max: 60, color: "rgba(236, 72, 153, 0.8)" },
    { label: "60-70", min: 60, max: 70, color: "rgba(34, 197, 94, 0.8)" },
    { label: "70-80", min: 70, max: 80, color: "rgba(251, 191, 36, 0.8)" },
    { label: "80+", min: 80, max: 100, color: "rgba(239, 68, 68, 0.8)" },
  ];

  // Contar senadores por faixa etária
  const distribuicao = faixasEtarias.map(faixa => {
    const count = data.filter(senador => 
      senador.idade >= faixa.min && senador.idade <= faixa.max
    ).length;
    return count;
  });

  const chartData = {
    labels: faixasEtarias.map(f => f.label),
    datasets: [
      {
        label: "Quantidade de Senadores",
        data: distribuicao,
        backgroundColor: faixasEtarias.map(f => f.color),
        borderColor: faixasEtarias.map(f => f.color.replace('0.8', '1')),
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
        text: "Distribuição por Faixa Etária",
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
            const faixa = faixasEtarias[context.dataIndex];
            const count = distribuicao[context.dataIndex];
            const percentage = ((count / data.length) * 100).toFixed(1);
            return [
              `Faixa: ${faixa.label} anos`,
              `Senadores: ${count}`,
              `Percentual: ${percentage}%`
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
  };

  const idadeMedia = data.length > 0 ? (data.reduce((acc, senador) => acc + senador.idade, 0) / data.length).toFixed(1) : "0";
  const idadeMinima = data.length > 0 ? Math.min(...data.map(s => s.idade)) : 0;
  const idadeMaxima = data.length > 0 ? Math.max(...data.map(s => s.idade)) : 0;

  return (
    <div className="bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-pink/30 rounded-xl p-6 shadow-2xl">
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Estatísticas */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-ai-neon-pink font-bold text-lg">{idadeMedia}</div>
          <div className="text-ai-gray text-sm">Idade Média</div>
        </div>
        <div className="text-center">
          <div className="text-ai-neon-blue font-bold text-lg">{idadeMinima}</div>
          <div className="text-ai-gray text-sm">Mais Jovem</div>
        </div>
        <div className="text-center">
          <div className="text-ai-neon-green font-bold text-lg">{idadeMaxima}</div>
          <div className="text-ai-gray text-sm">Mais Idoso</div>
        </div>
      </div>
    </div>
  );
}

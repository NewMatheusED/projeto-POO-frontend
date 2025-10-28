import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import type { SenadorData } from "../../service";

ChartJS.register(ArcElement, Tooltip, Legend);

interface GeneroDistributionChartProps {
  data: SenadorData[];
}

export default function GeneroDistributionChart({ data }: GeneroDistributionChartProps) {
  // Contar por gênero
  const masculino = data.filter(senador => senador.genero === "M").length;
  const feminino = data.filter(senador => senador.genero === "F").length;

  const chartData = {
    labels: ["Masculino", "Feminino"],
    datasets: [
      {
        data: [masculino, feminino],
        backgroundColor: [
          "rgba(0, 217, 255, 0.8)",    // Cyan neon para masculino
          "rgba(236, 72, 153, 0.8)",   // Pink neon para feminino
        ],
        borderColor: [
          "rgba(0, 217, 255, 1)",
          "rgba(236, 72, 153, 1)",
        ],
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#e5e7eb",
          font: {
            size: 14,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: "Distribuição por Gênero",
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
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return [
              `${context.label}: ${context.parsed} senadores`,
              `${percentage}% do total`
            ];
          }
        }
      },
    },
    cutout: "60%",
  };

  const totalSenadores = data.length;
  const percentualMasculino = totalSenadores > 0 ? ((masculino / totalSenadores) * 100).toFixed(1) : "0";
  const percentualFeminino = totalSenadores > 0 ? ((feminino / totalSenadores) * 100).toFixed(1) : "0";

  return (
    <div className="bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-green/30 rounded-xl p-6 shadow-2xl">
      <div className="h-80">
        <Doughnut data={chartData} options={options} />
      </div>
      
      {/* Estatísticas */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-ai-neon-blue font-bold text-lg">{masculino}</div>
          <div className="text-ai-gray text-sm">Masculino ({percentualMasculino}%)</div>
        </div>
        <div className="text-center">
          <div className="text-ai-neon-pink font-bold text-lg">{feminino}</div>
          <div className="text-ai-gray text-sm">Feminino ({percentualFeminino}%)</div>
        </div>
      </div>

      {/* Indicador de representatividade */}
      <div className="mt-4 p-3 bg-ai-darker-blue/50 rounded-lg border border-ai-neon-green/20">
        <div className="text-center">
          <div className="text-ai-neon-green font-bold text-sm">
            {percentualFeminino}% de Representatividade Feminina
          </div>
          <div className="text-ai-gray text-xs mt-1">
            {parseFloat(percentualFeminino) < 30 
              ? "Abaixo da meta de 30% de representatividade feminina" 
              : "Representatividade feminina adequada"}
          </div>
        </div>
      </div>
    </div>
  );
}

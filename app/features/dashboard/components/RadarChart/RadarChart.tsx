import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import type { SenadorData } from "../../service";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  data: SenadorData[];
}

export default function RadarChart({ data }: RadarChartProps) {
  // Calcular médias dos impactos
  const impactos = [
    { key: 'impacto_ambiental', label: 'Ambiental', shortLabel: 'Amb.' },
    { key: 'impacto_constitucional', label: 'Constitucional', shortLabel: 'Const.' },
    { key: 'impacto_economico', label: 'Econômico', shortLabel: 'Econ.' },
    { key: 'impacto_geopolitico', label: 'Geopolítico', shortLabel: 'Geop.' },
    { key: 'impacto_politico_institucional', label: 'Político', shortLabel: 'Pol.' },
    { key: 'impacto_regional', label: 'Regional', shortLabel: 'Reg.' },
    { key: 'impacto_social', label: 'Social', shortLabel: 'Soc.' },
    { key: 'impacto_tecnologico', label: 'Tecnológico', shortLabel: 'Tec.' },
    { key: 'impacto_temporal', label: 'Temporal', shortLabel: 'Temp.' },
  ];

  const mediasImpactos = impactos.map(impacto => {
    const total = data.reduce((acc, senador) => acc + senador[impacto.key as keyof SenadorData] as number, 0);
    return total / data.length;
  });

  const chartData = {
    labels: impactos.map(i => i.shortLabel),
    datasets: [
      {
        label: "Média Geral dos Impactos",
        data: mediasImpactos,
        backgroundColor: "rgba(0, 217, 255, 0.2)",
        borderColor: "rgba(0, 217, 255, 0.8)",
        borderWidth: 3,
        pointBackgroundColor: "rgba(0, 217, 255, 1)",
        pointBorderColor: "rgba(0, 217, 255, 1)",
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "rgba(0, 217, 255, 1)",
        pointHoverBorderColor: "rgba(255, 255, 255, 1)",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Radar dos Impactos - Média Geral",
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
            const impacto = impactos[context.dataIndex];
            const valor = context.parsed.r.toFixed(2);
            return [
              `${impacto.label}: ${valor}`,
              `Impacto ${valor > 5 ? 'Alto' : valor > 2 ? 'Médio' : 'Baixo'}`
            ];
          }
        }
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 10,
        ticks: {
          color: "#9ca3af",
          font: {
            size: 12,
          },
          stepSize: 2,
        },
        grid: {
          color: "rgba(107, 114, 128, 0.3)",
        },
        angleLines: {
          color: "rgba(107, 114, 128, 0.3)",
        },
        pointLabels: {
          color: "#e5e7eb",
          font: {
            size: 12,
            weight: "bold" as const,
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.1,
      },
    },
  };

  // Encontrar os impactos mais altos e mais baixos
  const impactosComMedias = impactos.map((impacto, index) => ({
    ...impacto,
    media: mediasImpactos[index]
  }));

  const impactoMaisAlto = impactosComMedias.reduce((max, current) => 
    current.media > max.media ? current : max
  );

  const impactoMaisBaixo = impactosComMedias.reduce((min, current) => 
    current.media < min.media ? current : min
  );

  const mediaGeral = mediasImpactos.reduce((acc, media) => acc + media, 0) / mediasImpactos.length;

  return (
    <div className="bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-purple/30 rounded-xl p-6 shadow-2xl">
      <div className="h-80">
        <Radar data={chartData} options={options} />
      </div>
      
      {/* Estatísticas */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-ai-neon-purple font-bold text-lg">{mediaGeral.toFixed(2)}</div>
          <div className="text-ai-gray text-sm">Média Geral</div>
        </div>
        <div className="text-center">
          <div className="text-ai-neon-green font-bold text-lg">{impactoMaisAlto.media.toFixed(2)}</div>
          <div className="text-ai-gray text-sm">{impactoMaisAlto.shortLabel}</div>
        </div>
        <div className="text-center">
          <div className="text-ai-neon-blue font-bold text-lg">{impactoMaisBaixo.media.toFixed(2)}</div>
          <div className="text-ai-gray text-sm">{impactoMaisBaixo.shortLabel}</div>
        </div>
      </div>

      {/* Interpretação */}
      <div className="mt-4 p-3 bg-ai-darker-blue/50 rounded-lg border border-ai-neon-purple/20">
        <div className="text-center">
          <div className="text-ai-neon-purple font-bold text-sm">
            Análise dos Impactos
          </div>
          <div className="text-ai-gray text-xs mt-1">
            {mediaGeral > 5 
              ? "Alto impacto geral nos projetos legislativos" 
              : mediaGeral > 2 
                ? "Médio impacto geral nos projetos legislativos"
                : "Baixo impacto geral nos projetos legislativos"}
          </div>
        </div>
      </div>
    </div>
  );
}

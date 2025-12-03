import React, { useState } from "react";
import type { ImpactoPorPartido } from "../../service";

interface HeatmapChartProps {
  data: ImpactoPorPartido[];
}

interface ImpactoType {
  key: keyof Omit<ImpactoPorPartido, 'partido'>;
  label: string;
  shortLabel: string;
}

const IMPACTOS: ImpactoType[] = [
  { key: 'impacto_ambiental', label: 'Impacto Ambiental', shortLabel: 'Ambiental' },
  { key: 'impacto_constitucional', label: 'Impacto Constitucional', shortLabel: 'Constitucional' },
  { key: 'impacto_economico', label: 'Impacto Econômico', shortLabel: 'Econômico' },
  { key: 'impacto_geopolitico', label: 'Impacto Geopolítico', shortLabel: 'Geopolítico' },
  { key: 'impacto_politico_institucional', label: 'Impacto Político-Institucional', shortLabel: 'Político' },
  { key: 'impacto_regional', label: 'Impacto Regional', shortLabel: 'Regional' },
  { key: 'impacto_social', label: 'Impacto Social', shortLabel: 'Social' },
  { key: 'impacto_tecnologico', label: 'Impacto Tecnológico', shortLabel: 'Tecnológico' },
];

export default function HeatmapChart({ data }: HeatmapChartProps) {
  const [hoveredCell, setHoveredCell] = useState<{ partido: string; impacto: string } | null>(null);

  // Encontra os valores mínimo e máximo para normalizar as cores
  const allValues = data.flatMap(item => 
    IMPACTOS.map(impacto => item[impacto.key])
  );
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);

  // Função para calcular a intensidade da cor (0 a 1)
  const getIntensity = (value: number) => {
    if (maxValue === minValue) return 0.5;
    return (value - minValue) / (maxValue - minValue);
  };

  // Função para obter a cor baseada na intensidade
  const getColor = (intensity: number) => {
    // Gradiente de vermelho (baixo) para verde (alto)
    const red = Math.round(255 * (1 - intensity));
    const green = Math.round(255 * intensity);
    const blue = 0;
    
    return `rgb(${red}, ${green}, ${blue})`;
  };

  // Função para obter a cor com transparência
  const getColorWithOpacity = (intensity: number, opacity: number = 0.7) => {
    const color = getColor(intensity);
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  };

  const getTooltipText = (partido: string, impacto: ImpactoType, value: number) => {
    const intensity = getIntensity(value);
    const percentage = Math.round(intensity * 100);
    
    return [
      `Partido: ${partido}`,
      `Impacto: ${impacto.label}`,
      `Valor: ${value}`,
      `Intensidade: ${percentage}%`
    ];
  };

  return (
    <div className="bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-green/30 rounded-xl p-6 shadow-2xl">
      <h3 className="text-xl font-bold text-ai-white mb-6 text-center">
        Mapa de Calor - Soma dos Impactos por Partido
      </h3>
      
      {/* Tooltip */}
      {hoveredCell && (
        <div className="absolute z-10 bg-ai-dark-blue border border-ai-neon-green rounded-lg p-3 shadow-xl pointer-events-none"
             style={{
               top: '10px',
               right: '10px',
               minWidth: '200px'
             }}>
          {(() => {
            const partidoData = data.find(d => d.partido === hoveredCell.partido);
            const impactoData = IMPACTOS.find(i => i.key === hoveredCell.impacto);
            if (!partidoData || !impactoData) return null;
            
            const value = partidoData[impactoData.key];
            const tooltipLines = getTooltipText(hoveredCell.partido, impactoData, value);
            
            return (
              <>
                <div className="text-ai-neon-green font-bold mb-2">Detalhes</div>
                {tooltipLines.map((line, index) => (
                  <div key={index} className="text-ai-gray text-sm mb-1">
                    {line}
                  </div>
                ))}
              </>
            );
          })()}
        </div>
      )}

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header com partidos */}
          <div className="flex">
            <div className="w-32 flex-shrink-0"></div> {/* Espaço para labels dos impactos */}
            {data.map((item) => (
              <div 
                key={item.partido}
                className="flex-1 min-w-20 text-center text-ai-gray text-sm font-medium py-2 px-1"
              >
                {item.partido}
              </div>
            ))}
          </div>

          {/* Grid do heatmap */}
          {IMPACTOS.map((impacto) => (
            <div key={impacto.key} className="flex items-center">
              {/* Label do impacto */}
              <div className="w-32 flex-shrink-0 text-ai-gray text-sm font-medium py-2 pr-4 text-right">
                {impacto.shortLabel}
              </div>
              
              {/* Células do heatmap */}
              {data.map((partidoData) => {
                const value = partidoData[impacto.key];
                const intensity = getIntensity(value);
                const backgroundColor = getColorWithOpacity(intensity);
                const borderColor = getColor(intensity);
                
                return (
                  <div
                    key={`${partidoData.partido}-${impacto.key}`}
                    className="flex-1 min-w-20 h-12 border border-gray-600/30 cursor-pointer transition-all duration-200 hover:scale-105 hover:z-10 relative"
                    style={{
                      backgroundColor,
                      borderColor,
                    }}
                    onMouseEnter={() => setHoveredCell({ 
                      partido: partidoData.partido, 
                      impacto: impacto.key 
                    })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white mix-blend-difference">
                        {value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-6 flex items-center justify-center space-x-4">
        <div className="text-ai-gray text-sm">Baixo Impacto</div>
        <div className="flex space-x-1">
          {Array.from({ length: 10 }, (_, i) => {
            const intensity = i / 9;
            const color = getColorWithOpacity(intensity);
            return (
              <div
                key={i}
                className="w-4 h-4 border border-gray-600/30"
                style={{ backgroundColor: color }}
              />
            );
          })}
        </div>
        <div className="text-ai-gray text-sm">Alto Impacto</div>
      </div>

      {/* Estatísticas */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-ai-neon-green font-bold text-lg">{data.length}</div>
          <div className="text-ai-gray text-sm">Partidos</div>
        </div>
        <div>
          <div className="text-ai-neon-blue font-bold text-lg">{IMPACTOS.length}</div>
          <div className="text-ai-gray text-sm">Tipos de Impacto</div>
        </div>
        <div>
          <div className="text-ai-neon-purple font-bold text-lg">{maxValue}</div>
          <div className="text-ai-gray text-sm">Maior Valor</div>
        </div>
      </div>
    </div>
  );
}

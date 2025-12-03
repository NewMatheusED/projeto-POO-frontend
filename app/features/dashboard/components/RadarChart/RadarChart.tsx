import React from "react";
import type { SenadorData } from "../../service";

interface RadarChartProps {
  data: SenadorData[];
}

export default function RadarChart({ data }: RadarChartProps) {
  // Calcular médias e desvios padrão dos impactos
  const impactos = [
    { key: 'impacto_ambiental', label: 'Ambiental' },
    { key: 'impacto_constitucional', label: 'Constitucional' },
    { key: 'impacto_economico', label: 'Econômico' },
    { key: 'impacto_geopolitico', label: 'Geopolítico' },
    { key: 'impacto_politico_institucional', label: 'Político' },
    { key: 'impacto_regional', label: 'Regional' },
    { key: 'impacto_social', label: 'Social' },
    { key: 'impacto_tecnologico', label: 'Tecnológico' },
  ];

  // Calcular média e desvio padrão para cada impacto
  const impactosComEstatisticas = impactos.map(impacto => {
    const valores = data.map(senador => senador[impacto.key as keyof SenadorData] as number);
    const media = valores.reduce((acc, valor) => acc + valor, 0) / valores.length;
    
    // Calcular variância
    const variancia = valores.reduce((acc, valor) => acc + Math.pow(valor - media, 2), 0) / valores.length;
    // Calcular desvio padrão
    const desvioPadrao = Math.sqrt(variancia);
    
    return {
      ...impacto,
      media,
      desvioPadrao
    };
  });

  // Calcular o máximo valor para escala (média + desvio padrão máximo)
  const maxValue = Math.max(
    ...impactosComEstatisticas.map(i => i.media + i.desvioPadrao)
  );
  const maxScale = Math.ceil(maxValue * 1.1); // Adicionar 10% de margem

  const mediaGeral = impactosComEstatisticas.reduce((acc, item) => acc + item.media, 0) / impactosComEstatisticas.length;

  // Função para determinar a cor baseada no valor
  const getIntensityColor = (valor: number) => {
    if (valor >= 8) return "text-ai-neon-green";
    if (valor >= 5) return "text-ai-neon-blue";
    if (valor >= 2) return "text-ai-neon-purple";
    return "text-ai-gray";
  };

  // Função para calcular a porcentagem no gráfico
  const getPercentage = (value: number) => {
    return (value / maxScale) * 100;
  };

  return (
    <div className="bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-purple/30 rounded-xl p-6 shadow-2xl">
      <h3 className="text-xl font-bold text-ai-white mb-4">Média e Desvio Padrão dos Impactos</h3>
      
      {/* Gráfico de Barras Horizontal com Barras de Erro - VERSÃO CLARA */}
      <div className="relative mb-6">
        <div className="space-y-4">
          {impactosComEstatisticas.map((impacto) => {
            const valores = data.map(senador => senador[impacto.key as keyof SenadorData] as number);
            const minimoReal = Math.min(...valores);
            const maximoReal = Math.max(...valores);
            const mediaPercent = getPercentage(impacto.media);
            const minValue = Math.max(0, impacto.media - impacto.desvioPadrao);
            const maxValue = impacto.media + impacto.desvioPadrao;
            const minPercent = getPercentage(minValue);
            const maxPercent = getPercentage(maxValue);
            const minimoPercent = getPercentage(minimoReal);
            const maximoPercent = getPercentage(maximoReal);
            
            return (
              <div key={impacto.key} className="bg-ai-darker-blue/30 rounded-lg p-4 border border-ai-neon-purple/20">
                {/* Cabeçalho com valores */}
                <div className="grid grid-cols-5 gap-4 mb-3">
                  <div>
                    <div className="text-ai-gray text-xs mb-1">Categoria</div>
                    <div className="text-ai-white font-bold text-sm">{impacto.label}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-ai-gray text-xs mb-1">Mínimo</div>
                    <div className="text-ai-neon-green font-bold text-lg">{minimoReal.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-ai-gray text-xs mb-1">Média</div>
                    <div className="text-ai-neon-blue font-bold text-lg">{impacto.media.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-ai-gray text-xs mb-1">Desvio Padrão</div>
                    <div className="text-ai-neon-yellow font-bold text-lg">±{impacto.desvioPadrao.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-ai-gray text-xs mb-1">Máximo</div>
                    <div className="text-ai-neon-green font-bold text-lg">{maximoReal.toFixed(2)}</div>
                  </div>
                </div>
                
                {/* Gráfico da barra */}
                <div className="relative bg-ai-dark-blue/50 rounded-lg p-4" style={{ height: '80px' }}>
                  {/* Barra de fundo (intervalo real min-max) */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 bg-ai-neon-purple/10 rounded"
                    style={{
                      left: `${minimoPercent}%`,
                      width: `${maximoPercent - minimoPercent}%`,
                      height: '8px',
                    }}
                  />
                  
                  {/* Barra principal (média) */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 bg-gradient-to-r from-ai-neon-blue to-ai-neon-cyan rounded-lg shadow-lg"
                    style={{
                      left: '0%',
                      width: `${mediaPercent}%`,
                      height: '50px',
                    }}
                  >
                    {/* Valor da média na barra */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-sm font-bold drop-shadow-lg">
                        {impacto.media.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Barra de erro esquerda (média - desvio) */}
                  {minValue > 0 && (
                    <div 
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        left: `${minPercent}%`,
                        height: '80px',
                      }}
                    >
                      {/* Linha vertical */}
                      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-ai-neon-green"></div>
                      {/* Linha horizontal superior */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-ai-neon-green"></div>
                      {/* Linha horizontal inferior */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-ai-neon-green"></div>
                      {/* Label do valor mínimo */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-1 whitespace-nowrap">
                        <div className="text-ai-neon-green text-xs font-bold bg-ai-dark-blue px-2 py-0.5 rounded">
                          {minValue.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Barra de erro direita (média + desvio) */}
                  {maxValue <= maxScale && (
                    <div 
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        left: `${maxPercent}%`,
                        height: '80px',
                      }}
                    >
                      {/* Linha vertical */}
                      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-ai-neon-green"></div>
                      {/* Linha horizontal superior */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-ai-neon-green"></div>
                      {/* Linha horizontal inferior */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-ai-neon-green"></div>
                      {/* Label do valor máximo */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-1 whitespace-nowrap">
                        <div className="text-ai-neon-green text-xs font-bold bg-ai-dark-blue px-2 py-0.5 rounded">
                          {maxValue.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Linha vertical indicando a média */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 border-l-2 border-dashed border-ai-neon-yellow opacity-90"
                    style={{
                      left: `${mediaPercent}%`,
                    }}
                  />
                  
                  {/* Labels nos extremos */}
                  <div className="absolute top-0 left-0 text-ai-gray text-xs">0</div>
                  <div className="absolute top-0 right-0 text-ai-gray text-xs">{maxScale.toFixed(1)}</div>
                </div>
                
                {/* Info adicional abaixo da barra */}
                <div className="mt-2 flex justify-between text-xs text-ai-gray">
                  <div>
                    <span className="text-ai-neon-yellow">DP:</span> ±{impacto.desvioPadrao.toFixed(2)}
                  </div>
                  <div>
                    <span className="text-ai-neon-blue">Média:</span> {impacto.media.toFixed(2)}
                  </div>
                  <div>
                    <span className="text-ai-neon-green">Range:</span> [{minValue.toFixed(2)}, {maxValue.toFixed(2)}]
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Eixo X (escala horizontal) */}
        <div className="mt-4 pt-4 border-t border-ai-neon-purple/30">
          <div className="relative" style={{ height: '40px' }}>
            {[0, maxScale * 0.25, maxScale * 0.5, maxScale * 0.75, maxScale].map((value, index) => (
              <div
                key={index}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${(value / maxScale) * 100}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="w-1 h-3 bg-ai-neon-purple mb-2"></div>
                <span className="text-ai-gray text-sm font-semibold whitespace-nowrap">{value.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Valores */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-ai-white mb-4">Estatísticas Detalhadas</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ai-neon-purple/30">
                <th className="text-left py-3 px-4 text-ai-gray font-semibold">Categoria</th>
                <th className="text-right py-3 px-4 text-ai-gray font-semibold">Média</th>
                <th className="text-right py-3 px-4 text-ai-gray font-semibold">Desvio Padrão</th>
                <th className="text-right py-3 px-4 text-ai-gray font-semibold">Mínimo</th>
                <th className="text-right py-3 px-4 text-ai-gray font-semibold">Máximo</th>
                <th className="text-center py-3 px-4 text-ai-gray font-semibold">Classificação</th>
              </tr>
            </thead>
            <tbody>
              {impactosComEstatisticas.map((impacto) => {
                const valor = impacto.media;
                const classificacao = valor > 5 ? "Alto" : valor > 2 ? "Médio" : "Baixo";
                const valores = data.map(senador => senador[impacto.key as keyof SenadorData] as number);
                const minimo = Math.min(...valores);
                const maximo = Math.max(...valores);
                
                return (
                  <tr 
                    key={impacto.key}
                    className="border-b border-ai-neon-purple/10 hover:bg-ai-neon-purple/10 transition-colors"
                  >
                    <td className="py-3 px-4 text-ai-white font-medium">{impacto.label}</td>
                    <td className={`py-3 px-4 text-right font-bold ${getIntensityColor(valor)}`}>
                      {valor.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-ai-neon-green font-semibold">
                      ±{impacto.desvioPadrao.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-ai-gray">
                      {minimo.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-ai-gray">
                      {maximo.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        classificacao === "Alto" 
                          ? "bg-ai-neon-green/20 text-ai-neon-green"
                          : classificacao === "Médio"
                          ? "bg-ai-neon-blue/20 text-ai-neon-blue"
                          : "bg-ai-gray/20 text-ai-gray"
                      }`}>
                        {classificacao}
                      </span>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-ai-neon-purple/30 bg-ai-darker-blue/30">
                <td className="py-3 px-4 text-ai-white font-bold">Média Geral</td>
                <td className={`py-3 px-4 text-right font-bold text-xl ${getIntensityColor(mediaGeral)}`}>
                  {mediaGeral.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right text-ai-gray">-</td>
                <td className="py-3 px-4 text-right text-ai-gray">-</td>
                <td className="py-3 px-4 text-right text-ai-gray">-</td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    mediaGeral > 5 
                      ? "bg-ai-neon-green/20 text-ai-neon-green"
                      : mediaGeral > 2
                      ? "bg-ai-neon-blue/20 text-ai-neon-blue"
                      : "bg-ai-gray/20 text-ai-gray"
                  }`}>
                    {mediaGeral > 5 ? "Alto" : mediaGeral > 2 ? "Médio" : "Baixo"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Legenda */}
      <div className="mt-4 p-4 bg-ai-darker-blue/50 rounded-lg border border-ai-neon-purple/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-ai-neon-blue to-ai-neon-cyan rounded"></div>
            <div>
              <div className="text-ai-white font-semibold">Barra Azul</div>
              <div className="text-ai-gray">Média dos valores</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div className="w-0.5 h-6 bg-ai-neon-green"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-ai-neon-green"></div>
            </div>
            <div>
              <div className="text-ai-white font-semibold">Barras de Erro</div>
              <div className="text-ai-gray">Desvio Padrão (verde)</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-ai-neon-purple/10 rounded"></div>
            <div>
              <div className="text-ai-white font-semibold">Área Roxa</div>
              <div className="text-ai-gray">Intervalo Média ± DP</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-0.5 h-6 border-l-2 border-dashed border-ai-neon-yellow"></div>
            </div>
            <div>
              <div className="text-ai-white font-semibold">Linha Amarela</div>
              <div className="text-ai-gray">Posição da Média</div>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-ai-neon-purple/20 text-ai-gray text-xs">
          <strong className="text-ai-white">Desvio Padrão:</strong> Mostra a dispersão dos dados. 
          Valores maiores indicam maior variabilidade. As barras verdes mostram o intervalo de ±1 desvio padrão da média.
        </div>
      </div>
    </div>
  );
}

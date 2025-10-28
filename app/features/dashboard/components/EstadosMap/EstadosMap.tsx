import React, { useState } from "react";
import type { SenadorData } from "../../service";
import BrazilMap from "~/src/assets/brazil-map.svg?react";

interface EstadosMapProps {
  data: SenadorData[];
}

// Estados brasileiros com posições para tooltips
const ESTADOS_BRASIL = [
  { sigla: "AC", nome: "Acre", centro: { x: 200, y: 180 } },
  { sigla: "AL", nome: "Alagoas", centro: { x: 550, y: 220 } },
  { sigla: "AP", nome: "Amapá", centro: { x: 350, y: 80 } },
  { sigla: "AM", nome: "Amazonas", centro: { x: 250, y: 140 } },
  { sigla: "BA", nome: "Bahia", centro: { x: 480, y: 320 } },
  { sigla: "CE", nome: "Ceará", centro: { x: 520, y: 150 } },
  { sigla: "DF", nome: "Distrito Federal", centro: { x: 420, y: 350 } },
  { sigla: "ES", nome: "Espírito Santo", centro: { x: 520, y: 380 } },
  { sigla: "GO", nome: "Goiás", centro: { x: 400, y: 380 } },
  { sigla: "MA", nome: "Maranhão", centro: { x: 450, y: 140 } },
  { sigla: "MT", nome: "Mato Grosso", centro: { x: 320, y: 320 } },
  { sigla: "MS", nome: "Mato Grosso do Sul", centro: { x: 320, y: 420 } },
  { sigla: "MG", nome: "Minas Gerais", centro: { x: 450, y: 420 } },
  { sigla: "PA", nome: "Pará", centro: { x: 350, y: 180 } },
  { sigla: "PB", nome: "Paraíba", centro: { x: 540, y: 180 } },
  { sigla: "PR", nome: "Paraná", centro: { x: 380, y: 520 } },
  { sigla: "PE", nome: "Pernambuco", centro: { x: 510, y: 200 } },
  { sigla: "PI", nome: "Piauí", centro: { x: 470, y: 180 } },
  { sigla: "RJ", nome: "Rio de Janeiro", centro: { x: 500, y: 420 } },
  { sigla: "RN", nome: "Rio Grande do Norte", centro: { x: 530, y: 160 } },
  { sigla: "RS", nome: "Rio Grande do Sul", centro: { x: 380, y: 580 } },
  { sigla: "RO", nome: "Rondônia", centro: { x: 280, y: 280 } },
  { sigla: "RR", nome: "Roraima", centro: { x: 300, y: 80 } },
  { sigla: "SC", nome: "Santa Catarina", centro: { x: 400, y: 560 } },
  { sigla: "SP", nome: "São Paulo", centro: { x: 420, y: 480 } },
  { sigla: "SE", nome: "Sergipe", centro: { x: 520, y: 240 } },
  { sigla: "TO", nome: "Tocantins", centro: { x: 420, y: 280 } },
];

// Função para obter a cor baseada na intensidade (igual ao exemplo do Highcharts)
const getFillColor = (intensity: number) => {
  const colors = [
    "#1e3a8a", // Azul muito escuro
    "#1e40af", // Azul escuro  
    "#2563eb", // Azul médio
    "#3b82f6", // Azul
    "#60a5fa", // Azul claro
    "#93c5fd", // Azul muito claro
    "#dbeafe", // Azul quase branco
  ];
  
  const index = Math.min(Math.floor(intensity * colors.length), colors.length - 1);
  return colors[index];
};

export default function EstadosMap({ data }: EstadosMapProps) {
  const [hoveredEstado, setHoveredEstado] = useState<string | null>(null);

  // Calcular dados por estado
  const dadosPorEstado = ESTADOS_BRASIL.map(estado => {
    const senadoresEstado = data.filter(senador => senador.estado === estado.sigla);
    const mediaEstado = senadoresEstado.length > 0 
      ? senadoresEstado.reduce((acc, senador) => acc + senador.media, 0) / senadoresEstado.length 
      : 0;
    
    return {
      ...estado,
      quantidade: senadoresEstado.length,
      media: mediaEstado,
      senadores: senadoresEstado
    };
  }).filter(estado => estado.quantidade > 0);

  // Encontrar valores máximo e mínimo para normalizar as cores
  const medias = dadosPorEstado.map(e => e.media);
  const maxMedia = Math.max(...medias, 1); // Evitar divisão por zero
  const minMedia = Math.min(...medias, 0);

  const getIntensity = (media: number) => {
    if (maxMedia === minMedia) return 0.5;
    return (media - minMedia) / (maxMedia - minMedia);
  };

  const estadoInfo = hoveredEstado ? dadosPorEstado.find(e => e.sigla === hoveredEstado) : null;

  return (
    <div className="bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-blue/30 rounded-xl p-6 shadow-2xl">
      <h3 className="text-xl font-bold text-ai-white mb-6 text-center">
        Mapa dos Estados - Distribuição de Senadores
      </h3>
      
      {/* Tooltip */}
      {estadoInfo && (
        <div className="absolute z-10 bg-ai-dark-blue border border-ai-neon-blue rounded-lg p-3 shadow-xl pointer-events-none"
             style={{
               top: '10px',
               right: '10px',
               minWidth: '250px'
             }}>
          <div className="text-ai-neon-blue font-bold mb-2">{estadoInfo.nome}</div>
          <div className="text-ai-gray text-sm space-y-1">
            <div>Senadores: {estadoInfo.quantidade}</div>
            <div>Média de Impacto: {estadoInfo.media.toFixed(2)}</div>
            <div>Intensidade: {Math.round(getIntensity(estadoInfo.media) * 100)}%</div>
          </div>
          <div className="mt-2 text-xs text-ai-gray">
            {estadoInfo.senadores.map(s => s.nome).join(", ")}
          </div>
        </div>
      )}

      {/* Mapa Choropleth Completo */}
      <div className="relative h-96 overflow-hidden rounded-lg bg-gradient-to-br from-ai-darker-blue to-ai-dark-blue">
        <div className="absolute inset-0">
          <BrazilMap 
            className="w-full h-full"
            style={{
              filter: 'brightness(0.8) contrast(1.2)',
            }}
          />
        </div>
        
        {/* Overlay com siglas dos estados */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 700 700"
          className="absolute inset-0 pointer-events-none"
        >
          {/* Siglas dos estados com dados */}
          {dadosPorEstado.map(estado => {
            const intensidade = getIntensity(estado.media);
            const fillColor = getFillColor(intensidade);
            
            return (
              <g key={estado.sigla}>
                {/* Círculo de fundo para a sigla */}
                <circle
                  cx={estado.centro.x}
                  cy={estado.centro.y}
                  r="15"
                  fill={fillColor}
                  stroke="#00d9ff"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:r-20 pointer-events-auto"
                  onMouseEnter={() => setHoveredEstado(estado.sigla)}
                  onMouseLeave={() => setHoveredEstado(null)}
                  style={{
                    filter: `drop-shadow(0 0 8px ${fillColor}80)`,
                  }}
                />
                
                {/* Sigla do Estado */}
                <text
                  x={estado.centro.x}
                  y={estado.centro.y + 4}
                  textAnchor="middle"
                  className="text-white font-bold text-sm pointer-events-none"
                  style={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                    fontWeight: 'bold'
                  }}
                >
                  {estado.sigla}
                </text>
              </g>
            );
          })}
          
          {/* Siglas dos estados sem dados (cinza) */}
          {ESTADOS_BRASIL.filter(estado => !dadosPorEstado.find(d => d.sigla === estado.sigla)).map(estado => (
            <g key={estado.sigla}>
              <circle
                cx={estado.centro.x}
                cy={estado.centro.y}
                r="12"
                fill="#374151"
                stroke="#6b7280"
                strokeWidth="1"
                className="opacity-60"
              />
              <text
                x={estado.centro.x}
                y={estado.centro.y + 3}
                textAnchor="middle"
                className="text-gray-300 font-bold text-xs pointer-events-none"
                style={{
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  fontWeight: 'bold'
                }}
              >
                {estado.sigla}
              </text>
            </g>
          ))}
        </svg>
        
        {/* Instruções */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-ai-gray text-sm bg-ai-dark-blue/80 px-4 py-2 rounded-lg backdrop-blur-sm">
            💡 Passe o mouse sobre os estados para ver detalhes • Cores representam a intensidade do impacto
          </p>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-4 flex items-center justify-center space-x-4">
        <div className="text-ai-gray text-sm">Baixo Impacto</div>
        <div className="flex space-x-1">
          {Array.from({ length: 7 }, (_, i) => {
            const intensity = i / 6;
            const color = getFillColor(intensity);
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
          <div className="text-ai-neon-blue font-bold text-lg">{dadosPorEstado.length}</div>
          <div className="text-ai-gray text-sm">Estados Ativos</div>
        </div>
        <div>
          <div className="text-ai-neon-green font-bold text-lg">{maxMedia.toFixed(2)}</div>
          <div className="text-ai-gray text-sm">Maior Média</div>
        </div>
        <div>
          <div className="text-ai-neon-purple font-bold text-lg">
            {dadosPorEstado.reduce((acc, e) => acc + e.quantidade, 0)}
          </div>
          <div className="text-ai-gray text-sm">Total Senadores</div>
        </div>
      </div>

      {/* Top 5 Estados */}
      <div className="mt-4">
        <h4 className="text-ai-white font-bold text-sm mb-2">Top 5 Estados por Impacto:</h4>
        <div className="space-y-1">
          {dadosPorEstado
            .sort((a, b) => b.media - a.media)
            .slice(0, 5)
            .map((estado, index) => (
              <div key={estado.sigla} className="flex justify-between items-center p-2 bg-ai-darker-blue/30 rounded">
                <span className="text-ai-gray text-xs">
                  #{index + 1} {estado.nome} ({estado.sigla})
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-ai-white text-xs font-bold">
                    {estado.media.toFixed(2)}
                  </span>
                  <span className="text-ai-gray text-xs">
                    {estado.quantidade} senador{estado.quantidade > 1 ? 'es' : ''}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
import React from "react";
import HighchartsReact from "highcharts-react-official";
import brazilTopo from "@highcharts/map-collection/countries/br/br-all.topo.json";
type HighchartsType = typeof import("highcharts");
type HighchartsOptions = import("highcharts").Options;
import type { HcDataPoint } from "~/features/dashboard/utils/mapAdapters";
import type { Point as HighchartsPoint } from "highcharts";
import type { MediaPorEstado, ImpactoPorEstado } from "~/features/dashboard/service";
import { hcKeyToUf } from "~/features/dashboard/utils/mapAdapters";

interface HighchartsBrazilMapProps {
	title: string;
	subtitle?: string;
	seriesName: string;
	data: HcDataPoint[];
	colorAxisMin?: number;
	height?: number;
	compact?: boolean;
	showCredits?: boolean;
	mediaPorEstado: MediaPorEstado[];
	impactoPorEstado: ImpactoPorEstado[];
	categoriaAtual?: string;
}

export default function HighchartsBrazilMap(props: HighchartsBrazilMapProps) {
	const { 
		title, 
		subtitle, 
		seriesName, 
		data, 
		colorAxisMin = 0, 
		height = 520, 
		compact = true, 
		showCredits = false,
		mediaPorEstado,
		impactoPorEstado,
		categoriaAtual = "media"
	} = props;
	
	const [topology] = React.useState<unknown | null>(brazilTopo as unknown);
	const [Highcharts, setHighcharts] = React.useState<HighchartsType | null>(null);
	const [selectedState, setSelectedState] = React.useState<string | null>(null);
	const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

	// Util: escolhe cor de texto com contraste em relação à cor do polígono
	const pickContrast = React.useCallback((color?: string): string => {
		if (!color) return "#e5e7eb"; // padrão claro
		const toRgb = (c: string): { r: number; g: number; b: number } | null => {
			if (c.startsWith("#")) {
				const hex = c.slice(1);
				const full = hex.length === 3 ? hex.split("").map(x => x + x).join("") : hex;
				const int = parseInt(full, 16);
				return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
			}
			const m = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
			if (m) return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
			return null;
		};
		const rgb = toRgb(color);
		if (!rgb) return "#e5e7eb";
		const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
		return yiq >= 160 ? "#111827" : "#F9FAFB"; // escuro em fundo claro, claro em fundo escuro
	}, []);

	// Carregar Highcharts e módulo de mapas apenas no cliente
	React.useEffect(() => {
		let isMounted = true;
		if (typeof window === "undefined") return;
		(async () => {
			try {
				const hm = await import("highcharts/highmaps");
				const Highmaps = (hm as { default?: unknown }).default ?? hm;
				if (isMounted) setHighcharts(Highmaps as HighchartsType);
			} catch (e) { void e; }
		})();
		return () => {
			isMounted = false;
		};
	}, []);

// Topologia é importada estaticamente para garantir disponibilidade em SSR/CSR

	// Criar mapa de hc-key/nome para estados antes do useMemo
	const estadoMapRef = React.useRef<Map<string, string>>(new Map());
	
	React.useEffect(() => {
		const map = new Map<string, string>();
		mediaPorEstado.forEach(item => {
			// Mapear estado (sigla) para si mesmo
			map.set(item.estado, item.estado);
			// Também mapear hc-key para estado se disponível
			const hcKey = data.find(d => {
				const uf = hcKeyToUf(d[0]);
				return uf === item.estado;
			});
			if (hcKey) {
				map.set(hcKey[0], item.estado);
			}
		});
		estadoMapRef.current = map;
	}, [mediaPorEstado, data]);

	const handleStateClick = React.useCallback((identifier: string) => {
		const estado = estadoMapRef.current.get(identifier) || identifier;
		setSelectedState(estado);
	}, []);

	const options = React.useMemo<HighchartsOptions>(() => {
		return {
			chart: {
				map: topology as Record<string, unknown>,
				height,
				spacing: compact ? [0, 16, 8, 0] : undefined,
				spacingRight: 56,
				margin: compact ? [0, 0, 0, 0] : undefined,
				backgroundColor: "transparent",
			},
			title: compact ? { text: undefined } : { text: title, style: { color: "#e5e7eb" } },
			subtitle: compact ? undefined : (subtitle ? { text: subtitle, style: { color: "#9ca3af" } } : undefined),
			mapNavigation: {
				enabled: true,
				buttonOptions: { verticalAlign: "bottom" },
			},
			legend: { enabled: false },
			colorAxis: {
				min: colorAxisMin,
				layout: "vertical",
				align: "right",
				verticalAlign: "middle",
				marker: {
					color: "#fff"
				},
				labels: { style: { color: "#9ca3af" } },
			},
			tooltip: {
				useHTML: true,
				backgroundColor: "#0b1020",
				style: { color: "#e5e7eb" },
				pointFormat: `<div><div style="color:#9ca3af">${seriesName}</div><div>{point.name}: <b>{point.value:.2f}</b></div><div style="margin-top:4px; font-size:11px; color:#9ca3af">Clique para ver detalhes</div></div>`
			},
			credits: { enabled: showCredits },
			series: [
				{
					type: "map",
					name: seriesName,
					data: data,
					mapData: topology as Record<string, unknown>,
					joinBy: "hc-key",
					states: { hover: { color: "#BADA55" } },
					nullColor: "#374151",
					dataLabels: {
						enabled: true,
						useHTML: true,
						formatter: function (this: HighchartsPoint) {
							const p = this as unknown as { color?: string; name: string };
							const textColor = pickContrast(p.color);
							return `<span style="color:${textColor}; font-weight:700;">${p.name}</span>`;
						},
						style: { textOutline: "2px rgba(0,0,0,0.25)" }
					},
					point: {
						events: {
							click: function (this: unknown) {
								const point = this as {
									options?: Record<string, unknown>;
									"hc-key"?: string;
									name?: string;
									properties?: Record<string, unknown>;
								};
								
								// Tentar várias formas de acessar o identificador
								let identifier: string | null = null;
								
								// Tentar hc-key diretamente no ponto
								if (point["hc-key"] && typeof point["hc-key"] === "string") {
									identifier = point["hc-key"];
								}
								// Tentar hc-key nas opções
								else if (point.options?.["hc-key"] && typeof point.options["hc-key"] === "string") {
									identifier = point.options["hc-key"] as string;
								}
								// Tentar nas propriedades
								else if (point.properties?.["hc-key"] && typeof point.properties["hc-key"] === "string") {
									identifier = point.properties["hc-key"] as string;
								}
								// Como último recurso, usar o nome (que geralmente é a sigla do estado)
								else if (point.name && typeof point.name === "string") {
									identifier = point.name;
								}
								
								if (identifier) {
									handleStateClick(identifier);
								}
							},
							mouseOver: function (this: unknown) {
								const self = this as { dataLabel?: { attr: (attrs: { opacity: number }) => void } };
								self.dataLabel?.attr({ opacity: 0 });
							},
							mouseOut: function (this: unknown) {
								const self = this as { dataLabel?: { attr: (attrs: { opacity: number }) => void } };
								self.dataLabel?.attr({ opacity: 1 });
							}
						}
					}
				}
			],
		};
	}, [topology, title, subtitle, seriesName, data, colorAxisMin, height, compact, showCredits, handleStateClick]);

	// Nenhuma injeção global necessária; o formatter fecha sobre pickContrast

	// Criar mapa de estados para fácil acesso
	const estadosMap = React.useMemo(() => {
		const map = new Map<string, { media: number; quantidade: number; impacto: ImpactoPorEstado | null }>();
		mediaPorEstado.forEach(item => {
			map.set(item.estado, {
				media: item.media,
				quantidade: item.quantidade,
				impacto: impactoPorEstado.find(i => i.estado === item.estado) || null
			});
		});
		return map;
	}, [mediaPorEstado, impactoPorEstado]);

	// Estado selecionado para o modal
	const selectedStateData = React.useMemo(() => {
		if (!selectedState) return null;
		return estadosMap.get(selectedState) || null;
	}, [selectedState, estadosMap]);

	// Função para obter o valor atual baseado na categoria selecionada
	const getValueForCategoria = React.useCallback((estado: MediaPorEstado & { impacto: ImpactoPorEstado | null }, categoria: string): number => {
		if (categoria === "media") return estado.media;
		if (categoria === "quantidade") return estado.quantidade;
		if (estado.impacto && categoria.startsWith("impacto_")) {
			return estado.impacto[categoria as keyof ImpactoPorEstado] as number || 0;
		}
		return estado.media;
	}, []);

	// Lista de estados ordenada para a tabela
	const estadosList = React.useMemo(() => {
		return mediaPorEstado
			.map(item => ({
				...item,
				impacto: impactoPorEstado.find(i => i.estado === item.estado) || null
			}))
			.sort((a, b) => {
				const valueA = getValueForCategoria(a, categoriaAtual);
				const valueB = getValueForCategoria(b, categoriaAtual);
				return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
			});
	}, [mediaPorEstado, impactoPorEstado, categoriaAtual, sortOrder, getValueForCategoria]);

	const handleSortClick = React.useCallback(() => {
		setSortOrder(prev => prev === "asc" ? "desc" : "asc");
	}, []);

	// Evitar render durante SSR ou antes de carregar a lib/topologia
	if (!Highcharts || !topology) {
		return (
			<div className="relative bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-blue/30 rounded-xl p-4 min-h-64">
				<div className="text-ai-gray text-sm">Carregando mapa...</div>
			</div>
		);
	}

	const categoriaLabels: Record<string, string> = {
		impacto_ambiental: "Ambiental",
		impacto_constitucional: "Constitucional",
		impacto_economico: "Econômico",
		impacto_geopolitico: "Geopolítico",
		impacto_politico_institucional: "Político Institucional",
		impacto_regional: "Regional",
		impacto_social: "Social",
		impacto_tecnologico: "Tecnológico"
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
			{/* Mapa */}
			<div className="lg:col-span-2">
				<div className="relative bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-blue/30 rounded-xl p-4">
					<HighchartsReact
						highcharts={Highcharts}
						constructorType="mapChart"
						options={options}
					/>
				</div>
			</div>

			{/* Tabela de Estados */}
			<div className="lg:col-span-1">
				<div className="bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-blue/30 rounded-xl p-4 h-full">
					<h3 className="text-lg font-bold text-ai-white mb-4">Estados</h3>
					<div className="overflow-y-auto max-h-[500px]">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-ai-neon-blue/30">
									<th className="text-left py-2 px-2 text-ai-gray font-semibold">Estado</th>
									<th 
										className="text-right py-2 px-2 text-ai-gray font-semibold cursor-pointer hover:text-ai-neon-blue transition-colors select-none"
										onClick={handleSortClick}
									>
										<div className="flex items-center justify-end gap-1">
											{seriesName}
											<svg 
												className={`w-4 h-4 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`} 
												fill="none" 
												stroke="currentColor" 
												viewBox="0 0 24 24"
											>
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
											</svg>
										</div>
									</th>
								</tr>
							</thead>
							<tbody>
								{estadosList.map((estado) => {
									const value = getValueForCategoria(estado, categoriaAtual);
									const isSelected = selectedState === estado.estado;
									return (
										<tr
											key={estado.estado}
											onClick={() => setSelectedState(estado.estado)}
											className={`border-b border-ai-neon-blue/10 cursor-pointer hover:bg-ai-neon-blue/20 transition-colors ${
												isSelected ? "bg-ai-neon-blue/30" : ""
											}`}
										>
											<td className="py-2 px-2 text-ai-white font-medium">{estado.estado}</td>
											<td className="py-2 px-2 text-right text-ai-neon-blue font-semibold">
												{value.toFixed(2)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Modal de Detalhes */}
			{selectedState && selectedStateData && selectedStateData.impacto && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-ai-dark-blue border border-ai-neon-blue/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-2xl font-bold text-ai-white">
								Detalhes do Estado: {selectedState}
							</h2>
							<button
								onClick={() => setSelectedState(null)}
								className="text-ai-gray hover:text-ai-white transition-colors"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<div className="mb-4">
							<div className="grid grid-cols-2 gap-4 mb-4">
								<div className="bg-ai-darker-blue/50 rounded-lg p-4">
									<div className="text-ai-gray text-sm">Média Geral</div>
									<div className="text-ai-neon-blue text-2xl font-bold">
										{selectedStateData.media.toFixed(2)}
									</div>
								</div>
								<div className="bg-ai-darker-blue/50 rounded-lg p-4">
									<div className="text-ai-gray text-sm">Quantidade</div>
									<div className="text-ai-neon-purple text-2xl font-bold">
										{selectedStateData.quantidade}
									</div>
								</div>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-bold text-ai-white mb-4">Categorias de Impacto</h3>
							<div className="space-y-2">
								{Object.entries(categoriaLabels).map(([key, label]) => {
									const value = selectedStateData.impacto?.[key as keyof ImpactoPorEstado] as number;
									if (typeof value !== "number") return null;
									return (
										<div
											key={key}
											className="bg-ai-darker-blue/50 rounded-lg p-4 flex items-center justify-between"
										>
											<span className="text-ai-gray font-medium">{label}</span>
											<span className="text-ai-neon-green text-lg font-bold">
												{value.toFixed(2)}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}



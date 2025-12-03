import React from "react";
import type { MediaPorEstado, ImpactoPorEstado } from "~/features/dashboard/service";
import HighchartsBrazilMap from "~/features/dashboard/components/HighchartsBrazilMap/HighchartsBrazilMap";
import { buildHcDataFromPairs } from "~/features/dashboard/utils/mapAdapters";

interface MapaDinamicoProps {
	mediaPorEstado: MediaPorEstado[];
	impactoPorEstado: ImpactoPorEstado[];
}

type CategoriaImpacto = 
	| "impacto_ambiental"
	| "impacto_constitucional"
	| "impacto_economico"
	| "impacto_geopolitico"
	| "impacto_politico_institucional"
	| "impacto_regional"
	| "impacto_social"
	| "impacto_tecnologico"
	| "media"
	| "quantidade";

const categoriasDisponiveis: Array<{ key: CategoriaImpacto; label: string }> = [
	{ key: "media", label: "Média Geral" },
	{ key: "quantidade", label: "Quantidade" },
	{ key: "impacto_ambiental", label: "Ambiental" },
	{ key: "impacto_constitucional", label: "Constitucional" },
	{ key: "impacto_economico", label: "Econômico" },
	{ key: "impacto_geopolitico", label: "Geopolítico" },
	{ key: "impacto_politico_institucional", label: "Político Institucional" },
	{ key: "impacto_regional", label: "Regional" },
	{ key: "impacto_social", label: "Social" },
	{ key: "impacto_tecnologico", label: "Tecnológico" },
];

export default function MapaDinamico({ mediaPorEstado, impactoPorEstado }: MapaDinamicoProps) {
	const [categoriaSelecionada, setCategoriaSelecionada] = React.useState<CategoriaImpacto>("media");

	const pairs = React.useMemo(() => {
		if (categoriaSelecionada === "media") {
			return mediaPorEstado.map((e) => ({ uf: e.estado, value: e.media }));
		} else if (categoriaSelecionada === "quantidade") {
			return mediaPorEstado.map((e) => ({ uf: e.estado, value: e.quantidade }));
		} else {
			// Categoria de impacto
			return mediaPorEstado.map((e) => {
				const impacto = impactoPorEstado.find(i => i.estado === e.estado);
				const value = impacto ? impacto[categoriaSelecionada as keyof ImpactoPorEstado] as number : 0;
				return { uf: e.estado, value };
			});
		}
	}, [mediaPorEstado, impactoPorEstado, categoriaSelecionada]);

	const data = React.useMemo(() => buildHcDataFromPairs(pairs), [pairs]);

	const categoriaLabel = categoriasDisponiveis.find(c => c.key === categoriaSelecionada)?.label || "Média Geral";
	const seriesName = categoriaLabel;

	return (
		<div className="bg-ai-dark-blue/50 backdrop-blur-sm border border-ai-neon-blue/30 rounded-xl p-6 shadow-2xl">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
				<h3 className="text-xl font-bold text-ai-white">🗺️ Mapa do Brasil</h3>
				<div className="flex items-center gap-3">
					<label className="text-ai-gray text-sm font-medium whitespace-nowrap">Categoria:</label>
					<select
						value={categoriaSelecionada}
						onChange={(e) => setCategoriaSelecionada(e.target.value as CategoriaImpacto)}
						className="bg-ai-darker-blue/50 border border-ai-neon-blue/30 rounded-lg px-4 py-2 text-ai-white text-sm focus:outline-none focus:ring-2 focus:ring-ai-neon-blue focus:border-transparent cursor-pointer min-w-[200px]"
					>
						{categoriasDisponiveis.map((categoria) => (
							<option key={categoria.key} value={categoria.key} className="bg-ai-darker-blue">
								{categoria.label}
							</option>
						))}
					</select>
				</div>
			</div>
			<HighchartsBrazilMap
				title=""
				subtitle={undefined}
				seriesName={seriesName}
				data={data}
				colorAxisMin={0}
				height={500}
				compact
				showCredits={false}
				mediaPorEstado={mediaPorEstado}
				impactoPorEstado={impactoPorEstado}
				categoriaAtual={categoriaSelecionada}
			/>
			<div className="mt-4 text-xs text-ai-gray/70 text-center">
				Clique em um estado no mapa ou na tabela para ver os detalhes das categorias de impacto.
			</div>
		</div>
	);
}



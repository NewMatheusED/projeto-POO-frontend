import { useState } from "react";
import JsonEditor from "~/features/legislative/components/JsonEditor/JsonEditor";
import { legislativeService, type LegislativeAnalysisPayload, type LegislativeAnalysisResponse } from "~/features/legislative/service";

// Exemplo de payload para o usuário
const EXAMPLE_PAYLOAD = {
  "project_id": "PLS 224/2017",
  "analysis_data": {
    "contexto_epoca": "Em 2017, o Brasil vivia um período de instabilidade política após o impeachment da presidente Dilma Rousseff, com Michel Temer no poder, enfrentando baixíssima popularidade e acusações de corrupção. Economicamente, o país saía de uma profunda recessão, com alto desemprego (acima de 12%), reformas fiscais e trabalhistas em debate para reduzir o déficit público e impulsionar o crescimento.",
    "resumo_objetivo": "O PLS 224/2017 propõe a criação de um marco regulatório para o uso de veículos aéreos não tripulados (VANTs ou drones) no Brasil. Ele define regras para operação, certificação de operadores, restrições de voo em áreas sensíveis e responsabilidades civis e criminais.",
    "interpretacao_simplificada": "Na prática, essa lei significa que qualquer pessoa que quiser usar um drone no Brasil precisará seguir regras claras, como obter uma licença ou certificado, evitar voar em zonas restritas e respeitar limites de altura e peso.",
    "avaliacao_parametrica": [
      {
        "criterio": "Impacto_Social",
        "resumo": "Regulamentação melhora segurança e privacidade, mas pode restringir usos recreativos.",
        "nota": 7,
        "justificativa": "Baseado na análise de redistribuição de recursos e efeitos sobre desigualdade..."
      },
      {
        "criterio": "Impacto_Economico", 
        "resumo": "Fomenta setores inovadores como logística e agricultura, criando empregos.",
        "nota": 8,
        "justificativa": "Avaliando sustentabilidade fiscal e crescimento econômico..."
      }
    ]
  }
};

export default function AnaliseLegislativaPage() {
  const [jsonPayload, setJsonPayload] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!jsonPayload.trim()) {
      setError("Por favor, insira um payload JSON");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setDataError(null);

    try {
      // Valida o JSON
      const payload = JSON.parse(jsonPayload);
      const validation = legislativeService.validatePayload(payload);

      if (!validation.isValid) {
        setError(`Payload inválido:\n${validation.errors.join('\n')}`);
        setIsLoading(false);
        return;
      }

      // Envia para o backend
      const response = await legislativeService.saveDirectAnalysis(payload as LegislativeAnalysisPayload);
      
      if (response.success) {
        setResult(response);
      } else {
        setError(response.message || "Erro ao salvar análise");
        setDataError(response.data as unknown as string || "Ocorreu um erro desconhecido");
      }
    } catch {
      setError("JSON inválido. Verifique a sintaxe e tente novamente.");
      setDataError("JSON inválido. Verifique a sintaxe e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadExample = () => {
    setJsonPayload(JSON.stringify(EXAMPLE_PAYLOAD, null, 2));
    setError(null);
    setResult(null);
  };

  const clearAll = () => {
    setJsonPayload("");
    setError(null);
    setResult(null);
    setDataError(null);
  };

  return (
    <div className="min-h-screen bg-ai-dark-blue p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl pb-3 font-bold bg-gradient-to-r from-ai-neon-blue to-ai-accent-cyan bg-clip-text text-transparent">
            Análise Legislativa
          </h1>
          <p className="text-ai-gray text-lg">
            Envie dados de análise legislativa diretamente para o backend usando o endpoint /v1/legislative/save-direct
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={loadExample}
              className="px-6 py-3 bg-gradient-to-r from-ai-neon-blue to-ai-accent-cyan text-ai-white rounded-lg font-medium hover:from-ai-neon-blue-bright hover:to-ai-accent-cyan transition-all duration-300 shadow-lg shadow-ai-neon-blue/50 hover:shadow-ai-neon-blue/70"
            >
              Carregar Exemplo
            </button>
            <button
              onClick={clearAll}
              className="px-6 py-3 bg-ai-dark-blue-card text-ai-gray border border-ai-accent-red/30 rounded-lg hover:border-ai-accent-red/60 hover:text-ai-accent-red transition-all duration-300"
            >
              Limpar Tudo
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !jsonPayload.trim()}
            className="px-8 py-3 bg-gradient-to-r from-ai-accent-green to-ai-accent-green-bright text-ai-white rounded-lg font-bold hover:from-ai-accent-green-bright hover:to-ai-accent-green transition-all duration-300 shadow-lg shadow-ai-accent-green/50 hover:shadow-ai-accent-green/70 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enviando...
              </div>
            ) : (
              "Enviar Análise"
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="bg-ai-dark-blue-card border border-ai-neon-blue/20 rounded-xl p-6 backdrop-blur-sm">
            <JsonEditor
              value={jsonPayload}
              onChange={setJsonPayload}
              placeholder="Digite ou cole seu payload JSON aqui..."
            />
          </div>

          {/* Result */}
          <div className="bg-ai-dark-blue-card border border-ai-neon-blue/20 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-ai-white mb-4">
              Resultado
            </h3>

            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-ai-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-ai-gray">Enviando análise...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-gradient-to-r from-ai-accent-red/10 to-ai-accent-red/5 border border-ai-accent-red/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-ai-accent-red mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-ai-accent-red font-medium mb-2">Erro</h4>
                    <pre className="text-ai-accent-red text-sm whitespace-pre-wrap">{error}</pre>
                    {dataError && (
                      <pre className="text-ai-accent-red text-sm whitespace-pre-wrap bg-ai-dark-blue-tertiary p-3 rounded-lg mt-2">
                        {dataError}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-gradient-to-r from-ai-accent-green/10 to-ai-accent-green/5 border border-ai-accent-green/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-ai-accent-green mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="text-ai-accent-green font-medium mb-2">Sucesso!</h4>
                    <pre className="text-ai-gray text-sm whitespace-pre-wrap bg-ai-dark-blue-tertiary p-3 rounded-lg mt-2 overflow-y-auto max-h-[400px]">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && !error && !result && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-ai-dark-blue-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-ai-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-ai-gray">Nenhum resultado ainda</p>
                <p className="text-ai-gray-dark text-sm mt-1">
                  Digite um payload JSON e clique em &quot;Enviar Análise&quot;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 bg-ai-dark-blue-card border border-ai-neon-blue/20 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-ai-white mb-4">
            📋 Informações sobre o Endpoint
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-ai-neon-blue font-medium mb-2">Endpoint:</h4>
              <code className="text-ai-gray bg-ai-dark-blue-tertiary px-3 py-1 rounded-lg">
                POST /v1/legislative/save-direct
              </code>
            </div>
            <div>
              <h4 className="text-ai-neon-blue font-medium mb-2">Formato:</h4>
              <p className="text-ai-gray text-sm">JSON com campos obrigatórios: project_id e analysis_data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

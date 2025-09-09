export interface Vote {
  codigoParlamentar: string;
  nomeParlamentar: string;
  sexoParlamentar: string;
  siglaPartidoParlamentar: string;
  siglaUFParlamentar: string;
  siglaVotoParlamentar: string;
  descricaoVotoParlamentar: string;
}

export interface VotingSession {
  codigoSessao: string;
  votos: Vote[];
}

export interface ProjectVotesResponse {
  data: VotingSession[];
  message: string;
  success: boolean;
  statusCode: number;
}

export interface SenatorVotingHistory {
  Votacao: Array<{
    SessaoPlenaria: {
      CodigoSessao: string;
      SiglaCasaSessao: string;
      CodigoSessaoLegislativa: string;
      SiglaTipoSessao: string;
      NumeroSessao: string;
      DataSessao: string;
      HoraInicioSessao: string;
    };
    Materia: {
      Codigo: string;
      IdentificacaoProcesso: string;
      DescricaoIdentificacao: string;
      Sigla: string;
      Numero: string;
      Ano: string;
      Ementa: string;
      Data: string;
    };
    Tramitacao: {
      IdentificacaoTramitacao: {
        CodigoTramitacao: string;
        NumeroAutuacao: string;
        DataTramitacao: string;
        TextoTramitacao: string;
        OrigemTramitacao: {
          Local: {
            CodigoLocal: string;
            TipoLocal: string;
            SiglaCasaLocal: string;
            SiglaLocal: string;
            NomeLocal: string;
          };
        };
        DestinoTramitacao: {
          Local: {
            CodigoLocal: string;
            TipoLocal: string;
            SiglaCasaLocal: string;
            SiglaLocal: string;
            NomeLocal: string;
          };
        };
      };
    };
    CodigoSessaoVotacao: string;
    Sequencial: string;
    IndicadorVotacaoSecreta: string;
    DescricaoVotacao: string;
    DescricaoResultado: string;
    SiglaDescricaoVoto: string;
    DescricaoVoto: string;
    TotalVotosSim: string;
    TotalVotosNao: string;
    TotalVotosAbstencao: string;
  }>;
}

export interface SenatorVotesResponse {
  data: SenatorVotingHistory[];
  message: string;
  success: boolean;
  statusCode: number;
}
export interface Senator {
  codigo: string;
  nome: string;
  nomeCompleto: string;
  sexo: string;
  partido: string;
  uf: string;
  email: string;
  urlFoto: string;
  urlPagina: string;
  siglaPartido: string;
  ufParlamentar: string;
  membroMesa: string;
  membroLideranca: string;
  bloco: {
    CodigoBloco: string;
    NomeBloco: string;
    NomeApelido: string;
    DataCriacao: string;
  };
  codigoMandato: string;
  ufParlamentarMandato: string;
  descricaoParticipacao: string;
  primeiraLegislaturaNumero: string;
  primeiraLegislaturaDataInicio: string;
  primeiraLegislaturaDataFim: string;
  segundaLegislaturaNumero: string;
  segundaLegislaturaDataInicio: string;
  segundaLegislaturaDataFim: string;
  suplentes: {
    Suplente: Array<{
      DescricaoParticipacao: string;
      CodigoParlamentar: string;
      NomeParlamentar: string;
    }>;
  };
  exercicios: {
    Exercicio: Array<{
      CodigoExercicio: string;
      DataInicio: string;
    }>;
  };
}

export interface SenatorDetail {
  IdentificacaoParlamentar: {
    CodigoParlamentar: string;
    CodigoPublicoNaLegAtual: string;
    NomeParlamentar: string;
    NomeCompletoParlamentar: string;
    SexoParlamentar: string;
    UrlFotoParlamentar: string;
    UrlPaginaParlamentar: string;
    EmailParlamentar: string;
    SiglaPartidoParlamentar: string;
    UfParlamentar: string;
  };
  DadosBasicosParlamentar: {
    DataNascimento: string;
    Naturalidade: string;
    UfNaturalidade: string;
    EnderecoParlamentar: string;
  };
  Telefones: {
    Telefone: Array<{
      NumeroTelefone: string;
      OrdemPublicacao: string;
      IndicadorFax: string;
    }>;
  };
  OutrasInformacoes: {
    Servico: Array<{
      NomeServico: string;
      DescricaoServico: string | null;
      UrlServico: string;
    }>;
  };
}

export interface SenatorsResponse {
  data: Senator[];
  message: string;
  success: boolean;
  statusCode: number;
}

export interface SenatorDetailResponse {
  data: SenatorDetail;
  message: string;
  success: boolean;
  statusCode: number;
}

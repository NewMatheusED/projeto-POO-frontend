export interface Project {
  id: number;
  codigoMateria: number;
  identificacao: string;
  objetivo: string;
  casaIdentificadora: string;
  enteIdentificador: string;
  tipoConteudo: string;
  ementa: string;
  tipoDocumento: string;
  dataApresentacao: string;
  autoria: string;
  tramitando: string;
  ultimaInformacaoAtualizada?: string;
  dataUltimaAtualizacao?: string;
  urlDocumento: string;
}

export interface ProjectsResponse {
  data: Project[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  message: string;
  success: boolean;
  statusCode: number;
}

export interface ProjectDetailResponse {
  data: Project[];
  message: string;
  success: boolean;
  statusCode: number;
}
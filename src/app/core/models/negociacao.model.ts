export type NegotiationStatus = 'EM_CRIACAO' | 'FATURADO';
export type Priority = 'ALTA' | 'MEDIA' | 'BAIXA';

export interface AnexoRequest {
  name: string;
  size: number;
}

export interface AnexoResponse {
  id: string;
  name: string;
  size: number;
}

export interface NegociacaoRequest {
  client: string;
  description?: string;
  estimatedValue?: number;
  attendance?: string;
  nf?: string;
  xml?: string;
  status?: NegotiationStatus;
  priority?: Priority;
  linkedServiceId?: string;
  attachments?: AnexoRequest[];
}

export interface NegociacaoResponse {
  id: string;
  client: string;
  description?: string;
  estimatedValue?: number;
  attendance?: string;
  nf?: string;
  xml?: string;
  status: NegotiationStatus;
  priority: Priority;
  linkedServiceId?: string;
  createdAt: string;
  invoicedAt?: string;
  attachments: AnexoResponse[];
}

// Modelo que o template usa (nomes em português)
export interface NegociacaoView {
  id?: string;
  _isNew?: boolean;
  cliente: string;
  descricao: string;
  valorEstimado: number;
  atendimento: string;
  anexos: { nome: string; tamanho: number }[];
  nf: string;
  xml: string | null;
  status: string;
  prioridade?: Priority;
  servicoId?: string;
  servicoIndex: number | null;
  dataCriacao: Date;
  dataFaturamento?: Date;
}

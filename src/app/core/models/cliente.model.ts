export interface ClienteRequest {
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  cep?: string;
  street?: string;
  city?: string;
  state?: string;
}

export interface ClienteResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  cep?: string;
  street?: string;
  city?: string;
  state?: string;
  createdAt: string;
}

export interface ClienteView {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  cpf?: string;
  cep?: string;
  rua?: string;
  cidade?: string;
  uf?: string;
  dataCadastro?: Date;
}

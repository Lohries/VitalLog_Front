export interface ProdutoView {
  id?: string;
  nome: string;
  descricao: string;
  quantidade: number;
  preco: number;
  ativo?: boolean;
  estoqueMinimo?: number;
  emAlerta?: boolean;
}

export interface ProductResponse {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  active?: boolean;
  minimumStock: number;
  lowStock: boolean;
}

export interface ProductRequest {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  minimumStock?: number;
}

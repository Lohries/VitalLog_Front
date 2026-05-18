// Modelo que os componentes usam (nomes em português)
export interface ProdutoView {
  id?: string;
  nome: string;
  descricao: string;
  quantidade: number;
  preco: number;
  ativo?: boolean;
}

// Formato que o backend retorna
export interface ProductResponse {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  active?: boolean;
}

// Formato que o backend espera
export interface ProductRequest {
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

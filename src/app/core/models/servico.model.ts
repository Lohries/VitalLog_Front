// Modelo que os componentes usam
export interface ConsumoView {
  nome: string;
  qtd: number;
  productId?: string;
}

export interface ServicoView {
  id?: string;
  nome: string;
  descricao?: string;
  preco: number;
  consumo: ConsumoView[];
}

// Formatos do backend
export interface ServiceItemRequest {
  productId: string;
  quantity: number;
}

export interface ServiceItemResponse {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
}

export interface ServiceRequest {
  name: string;
  description?: string;
  price: number;
  items: ServiceItemRequest[];
}

export interface ServiceResponse {
  id: string;
  name: string;
  description?: string;
  price: number;
  items: ServiceItemResponse[];
}

// Produto sale
export interface VendaProdutoRequest {
  productId: string;
  quantity: number;
  client?: string;
}

export interface VendaProdutoResponse {
  id: string;
  productId?: string;
  productName?: string;
  quantity: number;
  client: string;
  pricePerUnit: number;
  total: number;
  status: string;
  createdAt: string;
}

// Service sale
export interface VendaServicoRequest {
  serviceId: string;
  quantity: number;
  client?: string;
}

export interface VendaServicoResponse {
  id: string;
  serviceId?: string;
  serviceName?: string;
  quantity: number;
  client: string;
  pricePerUnit: number;
  total: number;
  createdAt: string;
}

// View models (campos que o template usa)
export interface VendaProdutoView {
  produto: string;
  quantidade: number;
  cliente: string;
  total: number;
  status: string;
  data: string;
}

export interface VendaServicoView {
  servico: string;
  quantidade: number;
  cliente: string;
  total: number;
  data: string;
}

export interface FornecedorView {
  id?: string;
  nome: string;
  email?: string;
  telefone?: string;
  cnpj?: string;
  contato?: string;
  observacoes?: string;
  ativo?: boolean;
}

export interface SupplierRequest {
  name: string;
  email?: string;
  phone?: string;
  cnpj?: string;
  contactPerson?: string;
  notes?: string;
}

export interface SupplierResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cnpj?: string;
  contactPerson?: string;
  notes?: string;
  active?: boolean;
  createdAt?: string;
}

export interface OrdemCompraItemView {
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  custoUnitario: number;
  total?: number;
}

export interface OrdemCompraView {
  id?: string;
  fornecedorId: string;
  fornecedorNome?: string;
  status?: 'PENDENTE' | 'RECEBIDA' | 'CANCELADA';
  custoTotal?: number;
  observacoes?: string;
  dataPrevisao?: string;
  dataRecebimento?: string;
  criadoEm?: string;
  itens: OrdemCompraItemView[];
}

export interface PurchaseOrderItemRequest {
  productId: string;
  quantity: number;
  unitCost: number;
}

export interface PurchaseOrderRequest {
  supplierId: string;
  notes?: string;
  expectedDate?: string;
  items: PurchaseOrderItemRequest[];
}

export interface PurchaseOrderItemResponse {
  id: string;
  productId: string | null;
  productName: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface PurchaseOrderResponse {
  id: string;
  supplierId: string | null;
  supplierName: string;
  status: 'PENDENTE' | 'RECEBIDA' | 'CANCELADA';
  totalCost: number;
  notes?: string;
  expectedDate?: string;
  receivedAt?: string;
  createdAt: string;
  items: PurchaseOrderItemResponse[];
}

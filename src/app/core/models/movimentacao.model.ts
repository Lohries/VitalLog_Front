export interface MovimentacaoEstoque {
  id: string;
  productId: string | null;
  productName: string;
  type: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  reason: string;
  createdAt: string;
}

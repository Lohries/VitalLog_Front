import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  FornecedorView, SupplierRequest, SupplierResponse,
  OrdemCompraView, PurchaseOrderRequest, PurchaseOrderResponse
} from '../models/fornecedor.model';

@Injectable({ providedIn: 'root' })
export class FornecedorService {
  private http = inject(HttpClient);
  private readonly supplierUrl = `${environment.apiUrl}/suppliers`;
  private readonly orderUrl = `${environment.apiUrl}/purchase-orders`;

  private toView(s: SupplierResponse): FornecedorView {
    return {
      id: s.id,
      nome: s.name,
      email: s.email,
      telefone: s.phone,
      cnpj: s.cnpj,
      contato: s.contactPerson,
      observacoes: s.notes,
      ativo: s.active
    };
  }

  private toRequest(f: FornecedorView): SupplierRequest {
    return {
      name: f.nome,
      email: f.email,
      phone: f.telefone,
      cnpj: f.cnpj,
      contactPerson: f.contato,
      notes: f.observacoes
    };
  }

  // ── Fornecedores ─────────────────────────────────────────────

  listarFornecedores() {
    return this.http.get<SupplierResponse[]>(this.supplierUrl).pipe(
      map(list => list.map(s => this.toView(s)))
    );
  }

  criarFornecedor(f: FornecedorView) {
    return this.http.post<SupplierResponse>(this.supplierUrl, this.toRequest(f)).pipe(
      map(s => this.toView(s))
    );
  }

  atualizarFornecedor(id: string, f: FornecedorView) {
    return this.http.put<SupplierResponse>(`${this.supplierUrl}/${id}`, this.toRequest(f)).pipe(
      map(s => this.toView(s))
    );
  }

  removerFornecedor(id: string) {
    return this.http.delete<void>(`${this.supplierUrl}/${id}`);
  }

  // ── Ordens de Compra ──────────────────────────────────────────

  listarOrdens() {
    return this.http.get<PurchaseOrderResponse[]>(this.orderUrl);
  }

  criarOrdem(req: PurchaseOrderRequest) {
    return this.http.post<PurchaseOrderResponse>(this.orderUrl, req);
  }

  receberOrdem(id: string) {
    return this.http.post<PurchaseOrderResponse>(`${this.orderUrl}/${id}/receive`, {});
  }

  cancelarOrdem(id: string) {
    return this.http.post<PurchaseOrderResponse>(`${this.orderUrl}/${id}/cancel`, {});
  }
}

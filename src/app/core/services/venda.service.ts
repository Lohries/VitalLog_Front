import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  VendaProdutoRequest, VendaProdutoResponse, VendaProdutoView,
  VendaServicoRequest, VendaServicoResponse, VendaServicoView
} from '../models/venda.model';

@Injectable({ providedIn: 'root' })
export class VendaService {
  private http = inject(HttpClient);

  private produtoToView(v: VendaProdutoResponse): VendaProdutoView {
    return {
      produto: v.productName ?? '',
      quantidade: v.quantity,
      cliente: v.client,
      total: v.total,
      status: v.status,
      data: new Date(v.createdAt).toLocaleString('pt-BR')
    };
  }

  private servicoToView(v: VendaServicoResponse): VendaServicoView {
    return {
      servico: v.serviceName ?? '',
      quantidade: v.quantity,
      cliente: v.client,
      total: v.total,
      data: new Date(v.createdAt).toLocaleString('pt-BR')
    };
  }

  listarVendasProduto() {
    return this.http.get<VendaProdutoResponse[]>(`${environment.apiUrl}/sales/products`).pipe(
      map(list => list.map(v => this.produtoToView(v)))
    );
  }

  registrarVendaProduto(data: VendaProdutoRequest) {
    return this.http.post<VendaProdutoResponse>(`${environment.apiUrl}/sales/products`, data).pipe(
      map(v => this.produtoToView(v))
    );
  }

  listarVendasServico() {
    return this.http.get<VendaServicoResponse[]>(`${environment.apiUrl}/sales/services`).pipe(
      map(list => list.map(v => this.servicoToView(v)))
    );
  }

  registrarVendaServico(data: VendaServicoRequest) {
    return this.http.post<VendaServicoResponse>(`${environment.apiUrl}/sales/services`, data).pipe(
      map(v => this.servicoToView(v))
    );
  }
}

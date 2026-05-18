import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { VendaProdutoRequest, VendaProdutoResponse, VendaProdutoView } from '../models/venda.model';

@Injectable({ providedIn: 'root' })
export class VendaProdutoService {
  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/sales/products`;

  private toView(v: VendaProdutoResponse): VendaProdutoView {
    return {
      produto: v.productName ?? '',
      quantidade: v.quantity,
      cliente: v.client,
      total: v.total,
      status: v.status,
      data: new Date(v.createdAt).toLocaleString('pt-BR')
    };
  }

  listar() {
    return this.http.get<VendaProdutoResponse[]>(this.url).pipe(
      map(list => list.map(v => this.toView(v)))
    );
  }

  registrar(data: VendaProdutoRequest) {
    return this.http.post<VendaProdutoResponse>(this.url, data).pipe(
      map(v => this.toView(v))
    );
  }
}

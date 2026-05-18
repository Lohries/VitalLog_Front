import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ServiceRequest, ServiceResponse } from '../models/servico.model';
import { ProdutoView } from '../models/produto.model';
import { ServicoView } from '../models/servico.model';

@Injectable({ providedIn: 'root' })
export class ServicoService {
  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/services`;

  toView(s: ServiceResponse): ServicoView {
    return {
      id: s.id,
      nome: s.name,
      descricao: s.description ?? '',
      preco: s.price,
      consumo: s.items.map(i => ({
        nome: i.productName,
        qtd: i.quantity,
        productId: i.productId
      }))
    };
  }

  listar() {
    return this.http.get<ServiceResponse[]>(this.url).pipe(
      map(list => list.map(s => this.toView(s)))
    );
  }

  criar(nome: string, descricao: string, preco: number, consumoItens: number[], produtos: ProdutoView[]) {
    const items = produtos
      .map((p, i) => ({ productId: p.id!, quantity: consumoItens[i] || 0 }))
      .filter(item => item.quantity > 0 && item.productId);

    const body: ServiceRequest = { name: nome, description: descricao, price: preco, items };
    return this.http.post<ServiceResponse>(this.url, body).pipe(
      map(s => this.toView(s))
    );
  }

  remover(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

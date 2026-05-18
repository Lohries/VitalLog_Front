import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ProductRequest, ProductResponse, ProdutoView } from '../models/produto.model';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/products`;

  private toView(p: ProductResponse): ProdutoView {
    return {
      id: p.id,
      nome: p.name,
      descricao: p.description ?? '',
      quantidade: p.quantity,
      preco: p.price,
      ativo: p.active
    };
  }

  private toRequest(p: ProdutoView): ProductRequest {
    return {
      name: p.nome,
      description: p.descricao,
      quantity: p.quantidade,
      price: p.preco
    };
  }

  listar() {
    return this.http.get<ProductResponse[]>(this.url).pipe(
      map(list => list.map(p => this.toView(p)))
    );
  }

  criar(produto: ProdutoView) {
    return this.http.post<ProductResponse>(this.url, this.toRequest(produto)).pipe(
      map(p => this.toView(p))
    );
  }

  atualizar(id: string, produto: ProdutoView) {
    return this.http.put<ProductResponse>(`${this.url}/${id}`, this.toRequest(produto)).pipe(
      map(p => this.toView(p))
    );
  }

  remover(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

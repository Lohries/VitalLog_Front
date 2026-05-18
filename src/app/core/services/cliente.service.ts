import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ClienteRequest, ClienteResponse, ClienteView } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/clients`;

  toView(c: ClienteResponse): ClienteView {
    return {
      id: c.id,
      nome: c.name,
      email: c.email,
      telefone: c.phone,
      cpf: c.cpf,
      cep: c.cep,
      rua: c.street,
      cidade: c.city,
      uf: c.state,
      dataCadastro: new Date(c.createdAt)
    };
  }

  listar() {
    return this.http.get<ClienteResponse[]>(this.url).pipe(
      map(list => list.map(c => this.toView(c)))
    );
  }

  criar(data: ClienteRequest) {
    return this.http.post<ClienteResponse>(this.url, data).pipe(
      map(c => this.toView(c))
    );
  }

  atualizar(id: string, data: ClienteRequest) {
    return this.http.put<ClienteResponse>(`${this.url}/${id}`, data).pipe(
      map(c => this.toView(c))
    );
  }

  remover(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

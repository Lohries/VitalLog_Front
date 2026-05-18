import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { VendaServicoRequest, VendaServicoResponse, VendaServicoView } from '../models/venda.model';

@Injectable({ providedIn: 'root' })
export class VendaServicoService {
  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/sales/services`;

  private toView(v: VendaServicoResponse): VendaServicoView {
    return {
      servico: v.serviceName ?? '',
      quantidade: v.quantity,
      cliente: v.client,
      total: v.total,
      data: new Date(v.createdAt).toLocaleString('pt-BR')
    };
  }

  listar() {
    return this.http.get<VendaServicoResponse[]>(this.url).pipe(
      map(list => list.map(v => this.toView(v)))
    );
  }

  registrar(data: VendaServicoRequest) {
    return this.http.post<VendaServicoResponse>(this.url, data).pipe(
      map(v => this.toView(v))
    );
  }
}

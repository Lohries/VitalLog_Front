import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  NegociacaoRequest, NegociacaoResponse, NegociacaoView, NegotiationStatus, Priority
} from '../models/negociacao.model';

@Injectable({ providedIn: 'root' })
export class NegociacaoService {
  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/negotiations`;

  toView(n: NegociacaoResponse): NegociacaoView {
    return {
      id: n.id,
      cliente: n.client,
      descricao: n.description ?? '',
      valorEstimado: n.estimatedValue ?? 0,
      atendimento: n.attendance ?? '',
      anexos: n.attachments.map(a => ({ nome: a.name, tamanho: a.size })),
      nf: n.nf ?? '',
      xml: n.xml ?? null,
      status: n.status === 'EM_CRIACAO' ? 'Em criação' : 'Faturado',
      prioridade: n.priority,
      servicoId: n.linkedServiceId,
      servicoIndex: null,
      dataCriacao: new Date(n.createdAt),
      dataFaturamento: n.invoicedAt ? new Date(n.invoicedAt) : undefined
    };
  }

  toRequest(v: NegociacaoView, servicos: any[]): NegociacaoRequest {
    const linkedServiceId = v.servicoIndex !== null && servicos[v.servicoIndex!]
      ? servicos[v.servicoIndex!].id
      : v.servicoId;

    const status: NegotiationStatus = v.status === 'Faturado' ? 'FATURADO' : 'EM_CRIACAO';

    return {
      client: v.cliente,
      description: v.descricao,
      estimatedValue: v.valorEstimado,
      attendance: v.atendimento,
      nf: v.nf,
      xml: v.xml ?? undefined,
      status,
      priority: (v.prioridade ?? 'MEDIA') as Priority,
      linkedServiceId,
      attachments: v.anexos.map(a => ({ name: a.nome, size: a.tamanho }))
    };
  }

  listar() {
    return this.http.get<NegociacaoResponse[]>(this.url).pipe(
      map(list => list.map(n => this.toView(n)))
    );
  }

  criar(data: NegociacaoRequest) {
    return this.http.post<NegociacaoResponse>(this.url, data).pipe(
      map(n => this.toView(n))
    );
  }

  atualizar(id: string, data: NegociacaoRequest) {
    return this.http.put<NegociacaoResponse>(`${this.url}/${id}`, data).pipe(
      map(n => this.toView(n))
    );
  }

  remover(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

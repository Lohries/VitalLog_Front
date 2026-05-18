import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  EmpresaRequest, EmpresaSummary, EmpresaDetail,
  ConviteResponse, EmpresaAnalytics
} from '../models/equipe.model';

@Injectable({ providedIn: 'root' })
export class EquipeService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  criarEmpresa(data: EmpresaRequest) {
    return this.http.post<EmpresaSummary>(`${this.base}/companies`, data);
  }

  listarEmpresas() {
    return this.http.get<EmpresaSummary[]>(`${this.base}/companies`);
  }

  detalharEmpresa(id: string) {
    return this.http.get<EmpresaDetail>(`${this.base}/companies/${id}`);
  }

  convidar(companyId: string, email: string) {
    return this.http.post<ConviteResponse>(`${this.base}/companies/${companyId}/invites`, { email });
  }

  cancelarConvite(companyId: string, inviteId: string) {
    return this.http.delete<void>(`${this.base}/companies/${companyId}/invites/${inviteId}`);
  }

  removerMembro(companyId: string, userId: string) {
    return this.http.delete<void>(`${this.base}/companies/${companyId}/members/${userId}`);
  }

  meusConvites() {
    return this.http.get<ConviteResponse[]>(`${this.base}/invites`);
  }

  aceitarConvite(id: string) {
    return this.http.post<void>(`${this.base}/invites/${id}/accept`, {});
  }

  rejeitarConvite(id: string) {
    return this.http.post<void>(`${this.base}/invites/${id}/reject`, {});
  }

  analytics(companyId: string) {
    return this.http.get<EmpresaAnalytics>(`${this.base}/companies/${companyId}/analytics`);
  }
}

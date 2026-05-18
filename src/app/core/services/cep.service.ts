import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface CepResult {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CepService {
  private http = inject(HttpClient);

  buscar(cep: string) {
    const limpo = cep.replace(/\D/g, '');
    return this.http.get<CepResult>(`https://viacep.com.br/ws/${limpo}/json/`);
  }
}

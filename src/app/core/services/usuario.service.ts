import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserProfileRequest, UserProfileResponse, UserPreferencesRequest } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);

  getPerfil() {
    return this.http.get<UserProfileResponse>(`${environment.apiUrl}/users/profile`);
  }

  atualizarPerfil(data: UserProfileRequest) {
    return this.http.put<UserProfileResponse>(`${environment.apiUrl}/users/profile`, data);
  }

  atualizarPreferencias(data: UserPreferencesRequest) {
    return this.http.put<UserProfileResponse>(`${environment.apiUrl}/users/preferences`, data);
  }

  resetarDados() {
    return this.http.delete<void>(`${environment.apiUrl}/users/reset`);
  }
}

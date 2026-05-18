import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../app/shared/header/header.component';
import { ToastService } from '../app/shared/toast/toast.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-seguranca',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './seguranca.html',
  styleUrl: './seguranca.css'
})
export class SegurancaComponent {
  private router = inject(Router);
  private toast = inject(ToastService);
  private http = inject(HttpClient);

  senhaAtual = '';
  novaSenha = '';
  confirmarSenha = '';
  saving = false;
  mostrarSenhaAtual = false;
  mostrarNovaSenha = false;

  alterarSenha() {
    if (this.saving) return;
    if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
      this.toast.warning('Preencha todos os campos.');
      return;
    }
    if (this.novaSenha.length < 6) {
      this.toast.error('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (this.novaSenha !== this.confirmarSenha) {
      this.toast.error('As senhas não coincidem.');
      return;
    }

    this.saving = true;
    this.http.put(`${environment.apiUrl}/users/password`, {
      currentPassword: this.senhaAtual,
      newPassword: this.novaSenha
    }).subscribe({
      next: () => {
        this.toast.success('Senha alterada com sucesso!');
        this.senhaAtual = '';
        this.novaSenha = '';
        this.confirmarSenha = '';
        this.saving = false;
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Senha atual incorreta.';
        this.toast.error(msg);
        this.saving = false;
      }
    });
  }

  voltar() { this.router.navigate(['/ajustes']); }
}

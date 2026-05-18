import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { HeaderComponent } from '../app/shared/header/header.component';
import { ToastService } from '../app/shared/toast/toast.service';
import { ThemeService } from '../app/shared/theme.service';
import { UsuarioService } from '../app/core/services/usuario.service';
import { AuthService } from '../app/core/services/auth.service';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './ajustes.html',
  styleUrls: ['./ajustes.css']
})
export class AjustesComponent implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);
  private themeService = inject(ThemeService);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);

  private cdr = inject(ChangeDetectorRef);

  usuario = { nome: '', email: '' };
  preferencias = { notificacoes: false, temaEscuro: false, moeda: 'R$' };
  showResetModal = false;
  loading = true;
  saving = false;

  ngOnInit() {
    this.carregarPerfil();
  }

  carregarPerfil() {
    this.loading = true;
    this.usuarioService.getPerfil().pipe(
      finalize(() => { this.loading = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (perfil) => {
        this.usuario = { nome: perfil.name, email: perfil.email };
        this.preferencias = {
          notificacoes: perfil.notificationsEnabled,
          temaEscuro: perfil.theme === 'dark',
          moeda: perfil.currency
        };
      },
      error: () => {
        this.toast.error('Erro ao carregar perfil.');
      }
    });
  }

  salvarPerfil() {
    if (this.saving) return;
    this.saving = true;
    this.usuarioService.atualizarPerfil({ name: this.usuario.nome }).subscribe({
      next: () => { this.toast.success('Perfil atualizado com sucesso!'); this.saving = false; },
      error: () => { this.toast.error('Erro ao salvar perfil.'); this.saving = false; }
    });
  }

  salvarPreferencias() {
    if (this.saving) return;
    this.saving = true;
    const novoTema = this.preferencias.temaEscuro ? 'dark' : 'light';
    if (this.themeService.theme() !== novoTema) {
      this.themeService.toggleTheme();
    }
    this.usuarioService.atualizarPreferencias({
      theme: novoTema,
      currency: this.preferencias.moeda,
      notificationsEnabled: this.preferencias.notificacoes
    }).subscribe({
      next: () => { this.toast.success('Preferências salvas.'); this.saving = false; },
      error: () => { this.toast.error('Erro ao salvar preferências.'); this.saving = false; }
    });
  }

  confirmarReset() {
    this.showResetModal = true;
  }

  cancelarReset() {
    this.showResetModal = false;
  }

  limparDados() {
    this.usuarioService.resetarDados().subscribe({
      next: () => {
        this.showResetModal = false;
        this.toast.info('Todos os dados foram removidos.');
        this.authService.logout();
      },
      error: () => this.toast.error('Erro ao resetar dados.')
    });
  }

  irParaSeguranca() { this.router.navigate(['/seguranca']); }
  irParaTermos() { this.router.navigate(['/termos']); }
  irParaSuporte() { this.router.navigate(['/suporte']); }
  voltar() { this.router.navigate(['/home']); }
}

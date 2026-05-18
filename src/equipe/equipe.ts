import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { HeaderComponent } from '../app/shared/header/header.component';
import { ToastService } from '../app/shared/toast/toast.service';
import { EquipeService } from '../app/core/services/equipe.service';
import { EmpresaSummary, EmpresaDetail, ConviteResponse, EmpresaAnalytics } from '../app/core/models/equipe.model';
import { AuthService } from '../app/core/services/auth.service';

@Component({
  selector: 'app-equipe',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './equipe.html',
  styleUrl: './equipe.css'
})
export class EquipeComponent implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);
  private equipeService = inject(EquipeService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  meuEmail = this.authService.getCurrentUser()?.email ?? '';

  empresas: EmpresaSummary[] = [];
  empresaSelecionada: EmpresaDetail | null = null;
  analytics: EmpresaAnalytics | null = null;
  meusConvites: ConviteResponse[] = [];

  novaEmpresa = { name: '', description: '' };
  emailConvite = '';
  showNovaEmpresaForm = false;
  showAnalytics = false;
  confirmRemoverMembro: string | null = null;
  confirmCancelarConvite: string | null = null;
  confirmRejeitarConvite: string | null = null;

  loading = true;
  criando = false;
  convidando = false;
  carregandoDetalhe = false;
  carregandoAnalytics = false;
  respondendoConvite: string | null = null;

  ngOnInit() { this.carregarDados(); }

  carregarDados() {
    this.loading = true;
    forkJoin({
      empresas: this.equipeService.listarEmpresas(),
      convites: this.equipeService.meusConvites()
    }).pipe(
      finalize(() => { this.loading = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: ({ empresas, convites }) => {
        this.empresas = empresas;
        this.meusConvites = convites;
      },
      error: () => { this.toast.error('Erro ao carregar dados. Verifique o backend.'); }
    });
  }

  selecionarEmpresa(id: string) {
    this.showAnalytics = false;
    this.analytics = null;
    this.emailConvite = '';
    this.carregandoDetalhe = true;
    this.equipeService.detalharEmpresa(id).pipe(
      finalize(() => { this.carregandoDetalhe = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (detalhe) => { this.empresaSelecionada = detalhe; },
      error: () => { this.toast.error('Erro ao carregar empresa.'); }
    });
  }

  fecharDetalhe() {
    this.empresaSelecionada = null;
    this.analytics = null;
    this.showAnalytics = false;
  }

  criarEmpresa() {
    if (this.criando) return;
    if (!this.novaEmpresa.name.trim()) { this.toast.warning('Nome da empresa é obrigatório'); return; }

    this.criando = true;
    this.equipeService.criarEmpresa(this.novaEmpresa).pipe(
      finalize(() => { this.criando = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (empresa) => {
        this.empresas.unshift(empresa);
        this.novaEmpresa = { name: '', description: '' };
        this.showNovaEmpresaForm = false;
        this.toast.success(`Empresa "${empresa.name}" criada com sucesso.`);
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Erro ao criar empresa.';
        this.toast.error(msg);
      }
    });
  }

  convidarMembro() {
    if (this.convidando || !this.empresaSelecionada) return;
    if (!this.emailConvite.trim()) { this.toast.warning('Informe o e-mail'); return; }

    this.convidando = true;
    this.equipeService.convidar(this.empresaSelecionada.id, this.emailConvite).pipe(
      finalize(() => { this.convidando = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (convite) => {
        this.empresaSelecionada!.pendingInvites.push(convite);
        this.emailConvite = '';
        this.toast.success(`Convite enviado para ${convite.invitedEmail}.`);
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Erro ao enviar convite.';
        this.toast.error(msg);
      }
    });
  }

  cancelarConvite(inviteId: string) {
    if (!this.empresaSelecionada) return;
    this.equipeService.cancelarConvite(this.empresaSelecionada.id, inviteId).pipe(
      finalize(() => { this.confirmCancelarConvite = null; this.cdr.detectChanges(); })
    ).subscribe({
      next: () => {
        this.empresaSelecionada!.pendingInvites =
          this.empresaSelecionada!.pendingInvites.filter(i => i.id !== inviteId);
        this.toast.info('Convite cancelado.');
      },
      error: () => { this.toast.error('Erro ao cancelar convite.'); }
    });
  }

  removerMembro(userId: string) {
    if (!this.empresaSelecionada) return;
    this.equipeService.removerMembro(this.empresaSelecionada.id, userId).pipe(
      finalize(() => { this.confirmRemoverMembro = null; this.cdr.detectChanges(); })
    ).subscribe({
      next: () => {
        const era = this.empresaSelecionada!.members.find(m => m.userId === userId);
        this.empresaSelecionada!.members =
          this.empresaSelecionada!.members.filter(m => m.userId !== userId);
        if (era) this.toast.info(`${era.name} removido da empresa.`);

        const sumIdx = this.empresas.findIndex(e => e.id === this.empresaSelecionada!.id);
        if (sumIdx !== -1) this.empresas[sumIdx].memberCount--;
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Erro ao remover membro.';
        this.toast.error(msg);
      }
    });
  }

  verAnalytics() {
    if (!this.empresaSelecionada || this.carregandoAnalytics) return;
    this.carregandoAnalytics = true;
    this.equipeService.analytics(this.empresaSelecionada.id).pipe(
      finalize(() => { this.carregandoAnalytics = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (data) => {
        this.analytics = data;
        this.showAnalytics = true;
      },
      error: () => { this.toast.error('Erro ao carregar analytics.'); }
    });
  }

  aceitarConvite(id: string) {
    if (this.respondendoConvite) return;
    this.respondendoConvite = id;
    this.equipeService.aceitarConvite(id).pipe(
      finalize(() => { this.respondendoConvite = null; this.cdr.detectChanges(); })
    ).subscribe({
      next: () => {
        const convite = this.meusConvites.find(c => c.id === id);
        this.meusConvites = this.meusConvites.filter(c => c.id !== id);
        this.toast.success(`Você entrou na empresa${convite ? ' ' + convite.companyName : ''}.`);
        this.equipeService.listarEmpresas().subscribe(lista => {
          this.empresas = lista;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Erro ao aceitar convite.';
        this.toast.error(msg);
      }
    });
  }

  rejeitarConvite(id: string) {
    if (this.respondendoConvite) return;
    this.respondendoConvite = id;
    this.equipeService.rejeitarConvite(id).pipe(
      finalize(() => {
        this.respondendoConvite = null;
        this.confirmRejeitarConvite = null;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.meusConvites = this.meusConvites.filter(c => c.id !== id);
        this.toast.info('Convite rejeitado.');
      },
      error: () => { this.toast.error('Erro ao rejeitar convite.'); }
    });
  }

  inicialDe(name: string) { return name?.charAt(0)?.toUpperCase() ?? '?'; }

  isOwner(empresa: EmpresaDetail) { return empresa.myRole === 'OWNER'; }

  voltar() { this.router.navigate(['/home']); }
}

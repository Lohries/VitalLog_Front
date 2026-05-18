import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { HeaderComponent } from '../app/shared/header/header.component';
import { ToastService } from '../app/shared/toast/toast.service';
import { ClienteService } from '../app/core/services/cliente.service';
import { CepService } from '../app/core/services/cep.service';
import { ClienteView } from '../app/core/models/cliente.model';

const FORM_VAZIO = () => ({
  nome: '', email: '', telefone: '', cpf: '',
  cep: '', rua: '', cidade: '', uf: ''
});

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class ClientesComponent implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);
  private clienteService = inject(ClienteService);
  private cepService = inject(CepService);
  private cdr = inject(ChangeDetectorRef);

  clientes: ClienteView[] = [];
  novoCliente = FORM_VAZIO();
  clienteParaEditar: ClienteView | null = null;
  clienteParaRemover: number | null = null;
  edicao = FORM_VAZIO();

  loading = true;
  saving = false;
  removing = false;
  savingEdit = false;
  buscandoCEP = false;
  buscandoCEPEdicao = false;

  ngOnInit() { this.carregarClientes(); }

  carregarClientes() {
    this.loading = true;
    this.clienteService.listar().pipe(
      finalize(() => { this.loading = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (lista) => { this.clientes = lista; },
      error: () => { this.toast.error('Erro ao carregar clientes. Verifique o backend.'); }
    });
  }

  cadastrarCliente() {
    if (this.saving) return;
    if (!this.novoCliente.nome) { this.toast.warning('Nome é obrigatório'); return; }
    if (!this.novoCliente.email) { this.toast.warning('E-mail é obrigatório'); return; }
    if (!this.novoCliente.telefone) { this.toast.warning('Telefone é obrigatório'); return; }

    this.saving = true;
    this.clienteService.criar({
      name: this.novoCliente.nome,
      email: this.novoCliente.email,
      phone: this.novoCliente.telefone,
      cpf: this.novoCliente.cpf || undefined,
      cep: this.novoCliente.cep || undefined,
      street: this.novoCliente.rua || undefined,
      city: this.novoCliente.cidade || undefined,
      state: this.novoCliente.uf || undefined
    }).pipe(
      finalize(() => { this.saving = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (novo) => {
        this.clientes.unshift(novo);
        this.toast.success(`${novo.nome} cadastrado com sucesso.`);
        setTimeout(() => { this.novoCliente = FORM_VAZIO(); this.cdr.detectChanges(); });
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Erro ao cadastrar cliente.';
        this.toast.error(msg);
      }
    });
  }

  buscarCEP(campo: 'novo' | 'edicao') {
    const cep = campo === 'novo' ? this.novoCliente.cep : this.edicao.cep;
    const limpo = cep.replace(/\D/g, '');
    if (limpo.length !== 8) { this.toast.warning('CEP deve ter 8 dígitos'); return; }

    if (campo === 'novo') this.buscandoCEP = true;
    else this.buscandoCEPEdicao = true;

    this.cepService.buscar(limpo).pipe(
      finalize(() => {
        if (campo === 'novo') this.buscandoCEP = false;
        else this.buscandoCEPEdicao = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data) => {
        if (data.erro) { this.toast.error('CEP não encontrado.'); return; }
        if (campo === 'novo') {
          this.novoCliente.rua = data.logradouro ?? '';
          this.novoCliente.cidade = data.localidade ?? '';
          this.novoCliente.uf = data.uf ?? '';
        } else {
          this.edicao.rua = data.logradouro ?? '';
          this.edicao.cidade = data.localidade ?? '';
          this.edicao.uf = data.uf ?? '';
        }
        this.toast.success('Endereço preenchido automaticamente.');
      },
      error: () => { this.toast.error('Erro ao consultar CEP.'); }
    });
  }

  abrirEdicao(cliente: ClienteView) {
    this.clienteParaEditar = cliente;
    this.edicao = {
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      cpf: cliente.cpf ?? '',
      cep: cliente.cep ?? '',
      rua: cliente.rua ?? '',
      cidade: cliente.cidade ?? '',
      uf: cliente.uf ?? ''
    };
  }

  fecharEdicao() { this.clienteParaEditar = null; }

  salvarEdicao() {
    if (this.savingEdit || !this.clienteParaEditar?.id) return;
    if (!this.edicao.nome) { this.toast.warning('Nome é obrigatório'); return; }
    if (!this.edicao.email) { this.toast.warning('E-mail é obrigatório'); return; }
    if (!this.edicao.telefone) { this.toast.warning('Telefone é obrigatório'); return; }

    this.savingEdit = true;
    this.clienteService.atualizar(this.clienteParaEditar.id, {
      name: this.edicao.nome,
      email: this.edicao.email,
      phone: this.edicao.telefone,
      cpf: this.edicao.cpf || undefined,
      cep: this.edicao.cep || undefined,
      street: this.edicao.rua || undefined,
      city: this.edicao.cidade || undefined,
      state: this.edicao.uf || undefined
    }).pipe(
      finalize(() => { this.savingEdit = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (atualizado) => {
        const idx = this.clientes.findIndex(c => c.id === atualizado.id);
        if (idx !== -1) this.clientes[idx] = atualizado;
        this.toast.success(`${atualizado.nome} atualizado.`);
        this.clienteParaEditar = null;
      },
      error: () => { this.toast.error('Erro ao atualizar cliente.'); }
    });
  }

  confirmarRemocao(index: number) { this.clienteParaRemover = index; }
  cancelarRemocao() { this.clienteParaRemover = null; }

  removerCliente() {
    if (this.removing || this.clienteParaRemover === null) return;
    const cliente = this.clientes[this.clienteParaRemover];
    if (!cliente.id) return;

    this.removing = true;
    this.clienteService.remover(cliente.id).pipe(
      finalize(() => { this.removing = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: () => {
        this.toast.info(`${cliente.nome} removido.`);
        this.clientes.splice(this.clienteParaRemover!, 1);
        this.clienteParaRemover = null;
      },
      error: () => { this.toast.error('Erro ao remover cliente.'); }
    });
  }

  formatarCPF(event: Event, campo: 'novo' | 'edicao') {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/^(\d{3})(\d{3})(\d+)$/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/^(\d{3})(\d+)$/, '$1.$2');
    input.value = v;
    if (campo === 'novo') this.novoCliente.cpf = v;
    else this.edicao.cpf = v;
  }

  formatarTelefone(event: Event, campo: 'novo' | 'edicao') {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d+)$/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d+)$/, '($1) $2');
    input.value = v;
    if (campo === 'novo') this.novoCliente.telefone = v;
    else this.edicao.telefone = v;
  }

  formatarCEP(event: Event, campo: 'novo' | 'edicao') {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.replace(/^(\d{5})(\d+)$/, '$1-$2');
    input.value = v;
    if (campo === 'novo') this.novoCliente.cep = v;
    else this.edicao.cep = v;
  }

  voltar() { this.router.navigate(['/home']); }
}

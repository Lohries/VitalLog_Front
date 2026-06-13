import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { HeaderComponent } from '../app/shared/header/header.component';
import { ToastService } from '../app/shared/toast/toast.service';
import { FornecedorService } from '../app/core/services/fornecedor.service';
import { ProdutoService } from '../app/core/services/produto.service';
import { FornecedorView, PurchaseOrderResponse, PurchaseOrderRequest } from '../app/core/models/fornecedor.model';
import { ProdutoView } from '../app/core/models/produto.model';

@Component({
  selector: 'app-fornecedores',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './fornecedores.html',
  styleUrl: './fornecedores.css'
})
export class FornecedoresComponent implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);
  private fornecedorService = inject(FornecedorService);
  private produtoService = inject(ProdutoService);
  private cdr = inject(ChangeDetectorRef);

  abaAtiva: 'fornecedores' | 'ordens' = 'fornecedores';

  fornecedores: FornecedorView[] = [];
  ordens: PurchaseOrderResponse[] = [];
  produtos: ProdutoView[] = [];

  novoFornecedor: FornecedorView = { nome: '', email: '', telefone: '', cnpj: '', contato: '', observacoes: '' };
  fornecedorEmEdicao: FornecedorView | null = null;
  fornecedorParaRemover: string | null = null;

  ordemEmCriacao = false;
  novaOrdem: { fornecedorId: string; observacoes: string; itens: { produtoId: string; nomeProduto: string; quantidade: number; custoUnitario: number }[] } = {
    fornecedorId: '', observacoes: '', itens: []
  };
  novoItem = { produtoId: '', nomeProduto: '', quantidade: 1, custoUnitario: 0 };

  ordemParaCancelar: string | null = null;

  loading = false;
  saving = false;

  ngOnInit() {
    this.carregarTudo();
  }

  carregarTudo() {
    this.loading = true;
    this.fornecedorService.listarFornecedores().subscribe({
      next: lista => { this.fornecedores = lista; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.toast.error('Erro ao carregar fornecedores.'); this.loading = false; }
    });
    this.fornecedorService.listarOrdens().subscribe({
      next: lista => { this.ordens = lista; this.cdr.detectChanges(); },
      error: () => {}
    });
    this.produtoService.listar().subscribe({
      next: lista => { this.produtos = lista; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  // ── Fornecedores ────────────────────────────────────────────

  salvarFornecedor() {
    if (this.saving || !this.novoFornecedor.nome.trim()) {
      this.toast.warning('Nome do fornecedor é obrigatório.');
      return;
    }
    this.saving = true;
    this.fornecedorService.criarFornecedor(this.novoFornecedor).pipe(
      finalize(() => { this.saving = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: novo => {
        this.fornecedores.push(novo);
        this.toast.success(`${novo.nome} adicionado.`);
        this.novoFornecedor = { nome: '', email: '', telefone: '', cnpj: '', contato: '', observacoes: '' };
      },
      error: () => this.toast.error('Erro ao salvar fornecedor.')
    });
  }

  editarFornecedor(f: FornecedorView) {
    this.fornecedorEmEdicao = { ...f };
  }

  salvarEdicao() {
    if (!this.fornecedorEmEdicao?.id) return;
    this.saving = true;
    this.fornecedorService.atualizarFornecedor(this.fornecedorEmEdicao.id, this.fornecedorEmEdicao).pipe(
      finalize(() => { this.saving = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: atualizado => {
        const idx = this.fornecedores.findIndex(x => x.id === atualizado.id);
        if (idx !== -1) this.fornecedores[idx] = atualizado;
        this.fornecedorEmEdicao = null;
        this.toast.success('Fornecedor atualizado.');
      },
      error: () => this.toast.error('Erro ao atualizar fornecedor.')
    });
  }

  confirmarRemocaoFornecedor(id: string) { this.fornecedorParaRemover = id; }
  cancelarRemocaoFornecedor() { this.fornecedorParaRemover = null; }

  removerFornecedor() {
    if (!this.fornecedorParaRemover) return;
    this.fornecedorService.removerFornecedor(this.fornecedorParaRemover).subscribe({
      next: () => {
        this.fornecedores = this.fornecedores.filter(f => f.id !== this.fornecedorParaRemover);
        this.toast.info('Fornecedor removido.');
        this.fornecedorParaRemover = null;
        this.cdr.detectChanges();
      },
      error: () => this.toast.error('Erro ao remover fornecedor.')
    });
  }

  // ── Ordens de Compra ────────────────────────────────────────

  iniciarOrdem() {
    this.ordemEmCriacao = true;
    this.novaOrdem = { fornecedorId: '', observacoes: '', itens: [] };
    this.novoItem = { produtoId: '', nomeProduto: '', quantidade: 1, custoUnitario: 0 };
  }

  cancelarOrdemCriacao() { this.ordemEmCriacao = false; }

  onProdutoSelecionado() {
    const prod = this.produtos.find(p => p.id === this.novoItem.produtoId);
    if (prod) {
      this.novoItem.nomeProduto = prod.nome;
      this.novoItem.custoUnitario = prod.preco;
    }
  }

  adicionarItemOrdem() {
    if (!this.novoItem.produtoId || this.novoItem.quantidade < 1) {
      this.toast.warning('Selecione um produto e informe a quantidade.');
      return;
    }
    if (this.novaOrdem.itens.some(i => i.produtoId === this.novoItem.produtoId)) {
      this.toast.warning('Produto já adicionado na ordem.');
      return;
    }
    this.novaOrdem.itens.push({ ...this.novoItem });
    this.novoItem = { produtoId: '', nomeProduto: '', quantidade: 1, custoUnitario: 0 };
  }

  removerItemOrdem(idx: number) { this.novaOrdem.itens.splice(idx, 1); }

  totalOrdemCriacao(): number {
    return this.novaOrdem.itens.reduce((acc, i) => acc + i.quantidade * i.custoUnitario, 0);
  }

  criarOrdem() {
    if (!this.novaOrdem.fornecedorId) { this.toast.warning('Selecione um fornecedor.'); return; }
    if (this.novaOrdem.itens.length === 0) { this.toast.warning('Adicione pelo menos um item.'); return; }

    this.saving = true;
    const req: PurchaseOrderRequest = {
      supplierId: this.novaOrdem.fornecedorId,
      notes: this.novaOrdem.observacoes,
      items: this.novaOrdem.itens.map(i => ({ productId: i.produtoId, quantity: i.quantidade, unitCost: i.custoUnitario }))
    };
    this.fornecedorService.criarOrdem(req).pipe(
      finalize(() => { this.saving = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: ordem => {
        this.ordens.unshift(ordem);
        this.ordemEmCriacao = false;
        this.toast.success('Ordem de compra criada com sucesso!');
      },
      error: () => this.toast.error('Erro ao criar ordem de compra.')
    });
  }

  receberOrdem(id: string) {
    this.fornecedorService.receberOrdem(id).subscribe({
      next: atualizada => {
        const idx = this.ordens.findIndex(o => o.id === id);
        if (idx !== -1) this.ordens[idx] = atualizada;
        this.toast.success('Ordem recebida! Estoque atualizado automaticamente.');
        this.cdr.detectChanges();
      },
      error: () => this.toast.error('Erro ao receber ordem.')
    });
  }

  confirmarCancelamento(id: string) { this.ordemParaCancelar = id; }
  cancelarCancelamento() { this.ordemParaCancelar = null; }

  cancelarOrdem() {
    if (!this.ordemParaCancelar) return;
    this.fornecedorService.cancelarOrdem(this.ordemParaCancelar).subscribe({
      next: atualizada => {
        const idx = this.ordens.findIndex(o => o.id === atualizada.id);
        if (idx !== -1) this.ordens[idx] = atualizada;
        this.ordemParaCancelar = null;
        this.toast.info('Ordem cancelada.');
        this.cdr.detectChanges();
      },
      error: () => this.toast.error('Erro ao cancelar ordem.')
    });
  }

  statusLabel(s: string): string {
    return { PENDENTE: 'Pendente', RECEBIDA: 'Recebida', CANCELADA: 'Cancelada' }[s] ?? s;
  }

  voltar() { this.router.navigate(['/home']); }
}

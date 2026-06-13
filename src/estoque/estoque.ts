import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { HeaderComponent } from '../app/shared/header/header.component';
import { ToastService } from '../app/shared/toast/toast.service';
import { ProdutoService } from '../app/core/services/produto.service';
import { ProdutoView } from '../app/core/models/produto.model';
import { MovimentacaoEstoque } from '../app/core/models/movimentacao.model';

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './estoque.html',
  styleUrl: './estoque.css'
})
export class EstoqueComponent implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);
  private produtoService = inject(ProdutoService);
  private cdr = inject(ChangeDetectorRef);

  abaAtiva: 'inventario' | 'movimentacoes' = 'inventario';

  produtos: ProdutoView[] = [];
  movimentacoes: MovimentacaoEstoque[] = [];
  limiteItens = 10;
  moedaSimbolo = 'R$';

  novoProduto: ProdutoView = { nome: '', quantidade: 0, preco: 0, descricao: '', estoqueMinimo: 10 };
  produtoParaRemover: number | null = null;

  loading = true;
  loadingMov = false;
  saving = false;
  removing = false;

  get alertCount() {
    return this.produtos.filter(p => p.emAlerta).length;
  }

  ngOnInit() {
    this.carregarEstoque();
  }

  carregarEstoque() {
    this.loading = true;
    this.produtoService.listar().pipe(
      finalize(() => { this.loading = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: lista => { this.produtos = lista; },
      error: () => this.toast.error('Erro ao carregar estoque.')
    });
  }

  mudarAba(aba: 'inventario' | 'movimentacoes') {
    this.abaAtiva = aba;
    if (aba === 'movimentacoes' && this.movimentacoes.length === 0) {
      this.carregarMovimentacoes();
    }
  }

  carregarMovimentacoes() {
    this.loadingMov = true;
    this.produtoService.listarMovimentacoes().pipe(
      finalize(() => { this.loadingMov = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: lista => { this.movimentacoes = lista; },
      error: () => this.toast.error('Erro ao carregar movimentações.')
    });
  }

  adicionarProduto() {
    if (this.saving) return;
    if (this.produtos.length >= this.limiteItens) {
      this.toast.error(`Limite de ${this.limiteItens} itens atingido!`);
      return;
    }
    if (!this.novoProduto.nome || this.novoProduto.nome.length > 30) {
      this.toast.warning('Nome obrigatório (máx 30 caracteres)');
      return;
    }

    this.saving = true;
    this.produtoService.criar(this.novoProduto).pipe(
      finalize(() => { this.saving = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: novo => {
        this.produtos.push(novo);
        this.toast.success(`${novo.nome} adicionado ao estoque.`);
        this.novoProduto = { nome: '', quantidade: 0, preco: 0, descricao: '', estoqueMinimo: 10 };
        if (this.abaAtiva === 'movimentacoes') this.carregarMovimentacoes();
      },
      error: () => this.toast.error('Erro ao adicionar produto.')
    });
  }

  confirmarRemocao(index: number) { this.produtoParaRemover = index; }
  cancelarRemocao() { this.produtoParaRemover = null; }

  removerProduto() {
    if (this.removing || this.produtoParaRemover === null) return;
    const produto = this.produtos[this.produtoParaRemover];
    if (!produto.id) return;

    this.removing = true;
    this.produtoService.remover(produto.id).pipe(
      finalize(() => { this.removing = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: () => {
        this.toast.info(`${produto.nome} removido do estoque.`);
        this.produtos.splice(this.produtoParaRemover!, 1);
        this.produtoParaRemover = null;
      },
      error: () => this.toast.error('Erro ao remover produto.')
    });
  }

  atualizarEstoque() {
    if (this.saving) return;
    const pendentes = this.produtos.filter(p => p.id);
    if (pendentes.length === 0) return;

    this.saving = true;
    let concluidos = 0;

    pendentes.forEach(p => {
      this.produtoService.atualizar(p.id!, p).subscribe({
        next: atualizado => {
          const idx = this.produtos.findIndex(x => x.id === atualizado.id);
          if (idx !== -1) this.produtos[idx] = atualizado;
          concluidos++;
          if (concluidos === pendentes.length) {
            this.toast.info('Estoque atualizado.');
            this.saving = false;
            if (this.abaAtiva === 'movimentacoes') this.carregarMovimentacoes();
            this.cdr.detectChanges();
          }
        },
        error: () => { this.toast.error('Erro ao atualizar produto.'); this.saving = false; this.cdr.detectChanges(); }
      });
    });
  }

  tipoLabel(type: string): string {
    return { ENTRADA: 'Entrada', SAIDA: 'Saída', AJUSTE: 'Ajuste' }[type] ?? type;
  }

  voltar() { this.router.navigate(['/home']); }
}

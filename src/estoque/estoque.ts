import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { HeaderComponent } from '../app/shared/header/header.component';
import { ToastService } from '../app/shared/toast/toast.service';
import { ProdutoService } from '../app/core/services/produto.service';
import { ProdutoView } from '../app/core/models/produto.model';

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

  produtos: ProdutoView[] = [];
  limiteItens = 10;
  moedaSimbolo = 'R$';
  novoProduto = { nome: '', quantidade: 0, preco: 0, descricao: '' };
  produtoParaRemover: number | null = null;

  loading = true;
  saving = false;
  removing = false;

  ngOnInit() {
    this.carregarEstoque();
  }

  carregarEstoque() {
    this.loading = true;
    this.produtoService.listar().pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (lista) => {
        this.produtos = lista;
      },
      error: () => {
        this.toast.error('Erro ao carregar estoque. Verifique o backend.');
      }
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
    if (this.novoProduto.descricao.length > 500) {
      this.toast.warning('Descrição muito longa (máx 500)');
      return;
    }

    this.saving = true;
    this.produtoService.criar(this.novoProduto).pipe(
      finalize(() => { this.saving = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (novo) => {
        this.produtos.push(novo);
        this.toast.success(`${novo.nome} adicionado ao estoque.`);
        this.novoProduto = { nome: '', quantidade: 0, preco: 0, descricao: '' };
      },
      error: () => {
        this.toast.error('Erro ao adicionar produto.');
      }
    });
  }

  confirmarRemocao(index: number) {
    this.produtoParaRemover = index;
  }

  cancelarRemocao() {
    this.produtoParaRemover = null;
  }

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
      error: () => {
        this.toast.error('Erro ao remover produto.');
      }
    });
  }

  atualizarEstoque() {
    if (this.saving) return;
    this.saving = true;
    let concluidos = 0;
    const total = this.produtos.filter(p => p.id).length;
    if (total === 0) { this.saving = false; return; }

    this.produtos.filter(p => p.id).forEach(p => {
      this.produtoService.atualizar(p.id!, p).subscribe({
        next: () => {
          concluidos++;
          if (concluidos === total) {
            this.toast.info('Estoque atualizado.');
            this.saving = false;
            this.cdr.detectChanges();
          }
        },
        error: () => {
          this.toast.error('Erro ao atualizar produto.');
          this.saving = false;
          this.cdr.detectChanges();
        }
      });
    });
  }

  voltar() { this.router.navigate(['/home']); }
}

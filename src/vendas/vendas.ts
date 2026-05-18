import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HeaderComponent } from '../app/shared/header/header.component';
import { ToastService } from '../app/shared/toast/toast.service';
import { ProdutoService } from '../app/core/services/produto.service';
import { VendaProdutoService } from '../app/core/services/venda-produto.service';
import { VendaServicoService } from '../app/core/services/venda-servico.service';
import { ServicoService } from '../app/core/services/servico.service';
import { NegociacaoService } from '../app/core/services/negociacao.service';
import { ClienteService } from '../app/core/services/cliente.service';
import { ProdutoView } from '../app/core/models/produto.model';
import { ServicoView } from '../app/core/models/servico.model';
import { VendaProdutoView, VendaServicoView } from '../app/core/models/venda.model';
import { NegociacaoView } from '../app/core/models/negociacao.model';
import { ClienteView } from '../app/core/models/cliente.model';

@Component({
  selector: 'app-vendas',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './vendas.html',
  styleUrls: ['./vendas.css']
})
export class VendasComponent implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);
  private produtoService = inject(ProdutoService);
  private vendaProdutoService = inject(VendaProdutoService);
  private vendaServicoService = inject(VendaServicoService);
  private servicoService = inject(ServicoService);
  private negociacaoService = inject(NegociacaoService);
  private clienteService = inject(ClienteService);
  private cdr = inject(ChangeDetectorRef);

  abaAtiva: string = 'itens';

  clientes: ClienteView[] = [];

  produtos: ProdutoView[] = [];
  vendasProdutos: VendaProdutoView[] = [];
  vendaProduto = { produtoIndex: 0, quantidade: 1, cliente: '', status: 'pendente' };

  servicos: ServicoView[] = [];
  vendasServicos: VendaServicoView[] = [];
  novoServico = { nome: '', descricao: '', preco: 0 };
  consumoItens: number[] = [];
  vendaServico = { servicoIndex: 0, quantidade: 1, cliente: '' };

  negociacoes: NegociacaoView[] = [];
  negociacaoSelecionada: number | null = null;
  passoAtual: number = 1;
  negociacaoAtual: NegociacaoView = this.negociacaoVazia();
  xmlValido: boolean | null = null;

  moedaSimbolo = 'R$';

  loading = true;
  savingVenda = false;
  savingServico = false;
  savingCrm = false;

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.loading = true;
    forkJoin({
      produtos: this.produtoService.listar(),
      vendasProd: this.vendaProdutoService.listar(),
      servicos: this.servicoService.listar(),
      vendasServ: this.vendaServicoService.listar(),
      negociacoes: this.negociacaoService.listar(),
      clientes: this.clienteService.listar()
    }).pipe(
      finalize(() => { this.loading = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: ({ produtos, vendasProd, servicos, vendasServ, negociacoes, clientes }) => {
        this.produtos = produtos;
        this.vendasProdutos = vendasProd;
        this.servicos = servicos;
        this.vendasServicos = vendasServ;
        this.negociacoes = negociacoes;
        this.clientes = clientes;
        this.consumoItens = new Array(this.produtos.length).fill(0);
      },
      error: () => {
        this.toast.error('Erro ao carregar dados. Verifique o backend.');
      }
    });
  }

  registrarVendaProduto() {
    if (this.savingVenda) return;
    const prod = this.produtos[this.vendaProduto.produtoIndex];
    if (!prod) { this.toast.warning('Selecione um produto'); return; }
    if (prod.quantidade < this.vendaProduto.quantidade) {
      this.toast.error('Estoque insuficiente para esta venda');
      return;
    }

    this.savingVenda = true;
    this.vendaProdutoService.registrar({
      productId: prod.id!,
      quantity: this.vendaProduto.quantidade,
      client: this.vendaProduto.cliente || 'Consumidor'
    }).subscribe({
      next: (venda) => {
        this.vendasProdutos.unshift(venda);
        prod.quantidade -= this.vendaProduto.quantidade;
        this.toast.success(`Venda de ${prod.nome} registrada.`);
        setTimeout(() => {
          this.vendaProduto = { produtoIndex: 0, quantidade: 1, cliente: '', status: 'pendente' };
          this.savingVenda = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.toast.error('Erro ao registrar venda.');
        this.savingVenda = false;
      }
    });
  }

  adicionarServico() {
    if (this.savingServico) return;
    if (!this.novoServico.nome) { this.toast.warning('Nome do serviço é obrigatório'); return; }

    this.savingServico = true;
    this.servicoService.criar(
      this.novoServico.nome, this.novoServico.descricao,
      this.novoServico.preco, this.consumoItens, this.produtos
    ).subscribe({
      next: (novo) => {
        this.servicos.push(novo);
        this.toast.success(`Serviço ${novo.nome} cadastrado.`);
        setTimeout(() => {
          this.novoServico = { nome: '', descricao: '', preco: 0 };
          this.consumoItens.fill(0);
          this.savingServico = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.toast.error('Erro ao cadastrar serviço.');
        this.savingServico = false;
      }
    });
  }

  removerServico(index: number) {
    const serv = this.servicos[index];
    if (!serv.id) return;
    this.servicoService.remover(serv.id).subscribe({
      next: () => {
        this.toast.info(`Serviço ${serv.nome} removido.`);
        this.servicos.splice(index, 1);
      },
      error: () => this.toast.error('Erro ao remover serviço.')
    });
  }

  registrarVendaServico() {
    if (this.savingVenda) return;
    const serv = this.servicos[this.vendaServico.servicoIndex];
    if (!serv) return;

    this.savingVenda = true;
    this.vendaServicoService.registrar({
      serviceId: serv.id!,
      quantity: this.vendaServico.quantidade,
      client: this.vendaServico.cliente || 'Consumidor'
    }).subscribe({
      next: (venda) => {
        this.vendasServicos.unshift(venda);
        this.toast.success(`Venda de serviço - ${serv.nome} registrada.`);
        setTimeout(() => {
          this.vendaServico = { servicoIndex: 0, quantidade: 1, cliente: '' };
          this.savingVenda = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Erro ao registrar venda de serviço.';
        this.toast.error(msg);
        this.savingVenda = false;
      }
    });
  }

  novaNegociacao() {
    if (this.savingCrm) return;
    const nova = this.negociacaoVazia();
    (nova as any)._isNew = true;
    this.negociacoes.push(nova);
    this.negociacaoSelecionada = this.negociacoes.length - 1;
    this.negociacaoAtual = { ...nova };
    this.passoAtual = 1;
    this.xmlValido = null;
    this.toast.info('Nova operação de CRM iniciada.');
  }

  selecionarNegociacao(index: number) {
    this.negociacaoSelecionada = index;
    this.negociacaoAtual = { ...this.negociacoes[index] };
    this.passoAtual = 1;
    this.xmlValido = null;
  }

  salvarOperacao() {
    if (this.savingCrm) return;
    if (!this.negociacaoAtual.cliente) { this.toast.warning('Cliente obrigatório'); return; }

    this.savingCrm = true;
    const req = this.negociacaoService.toRequest(this.negociacaoAtual, this.servicos);
    const isNew = (this.negociacaoAtual as any)._isNew || !this.negociacaoAtual.id;
    const obs = isNew
      ? this.negociacaoService.criar(req)
      : this.negociacaoService.atualizar(this.negociacaoAtual.id!, req);

    obs.subscribe({
      next: (salva) => {
        (salva as any)._isNew = false;
        this.negociacoes[this.negociacaoSelecionada!] = salva;
        this.negociacaoAtual = { ...salva };
        this.toast.success('Dados da operação salvos.');
        this.passoAtual = 2;
        this.savingCrm = false;
      },
      error: () => {
        this.toast.error('Erro ao salvar operação.');
        this.savingCrm = false;
      }
    });
  }

  anexarArquivo(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!this.negociacaoAtual.anexos) this.negociacaoAtual.anexos = [];
      this.negociacaoAtual.anexos.push({ nome: file.name, tamanho: file.size });
      this.toast.info(`Arquivo ${file.name} anexado.`);
    }
  }

  salvarAtendimento() {
    if (this.savingCrm) return;
    this.savingCrm = true;
    const req = this.negociacaoService.toRequest(this.negociacaoAtual, this.servicos);
    this.negociacaoService.atualizar(this.negociacaoAtual.id!, req).subscribe({
      next: (salva) => {
        this.negociacoes[this.negociacaoSelecionada!] = salva;
        this.negociacaoAtual = { ...salva };
        this.toast.success('Registro de atendimento salvo.');
        this.passoAtual = 3;
        this.savingCrm = false;
      },
      error: () => {
        this.toast.error('Erro ao salvar atendimento.');
        this.savingCrm = false;
      }
    });
  }

  validarXML(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.xml')) {
      this.xmlValido = false;
      this.toast.error('Formato inválido. Por favor, anexe um arquivo .xml');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const conteudo = e.target?.result as string;
      const isValid = conteudo.includes('<nfeProc') || conteudo.includes('<NFe') || conteudo.includes('<notaFiscal');
      this.xmlValido = isValid;
      if (isValid) {
        this.negociacaoAtual.xml = conteudo;
        this.toast.success('XML da nota fiscal validado com sucesso!');
      } else {
        this.toast.error('XML inválido - estrutura fiscal não reconhecida.');
      }
    };
    reader.readAsText(file);
  }

  finalizarFaturamento() {
    if (this.savingCrm) return;
    if (!this.xmlValido) { this.toast.error('Anexe um XML válido'); return; }
    if (!this.negociacaoAtual.nf) { this.toast.warning('Número da NF obrigatório'); return; }

    this.savingCrm = true;
    this.negociacaoAtual.status = 'Faturado';
    this.negociacaoAtual.dataFaturamento = new Date();
    const req = this.negociacaoService.toRequest(this.negociacaoAtual, this.servicos);
    this.negociacaoService.atualizar(this.negociacaoAtual.id!, req).subscribe({
      next: (salva) => {
        this.negociacoes[this.negociacaoSelecionada!] = salva;
        this.negociacaoSelecionada = null;
        this.toast.success('Negociação faturada com sucesso!');
        this.savingCrm = false;
      },
      error: () => {
        this.toast.error('Erro ao finalizar faturamento.');
        this.savingCrm = false;
      }
    });
  }

  updateValorSugerido() {
    if (this.negociacaoAtual.servicoIndex !== null && this.negociacaoAtual.servicoIndex !== undefined) {
      const servico = this.servicos[this.negociacaoAtual.servicoIndex];
      if (servico) this.negociacaoAtual.valorEstimado = servico.preco;
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');
  }

  private negociacaoVazia(): NegociacaoView {
    return {
      id: undefined, cliente: '', descricao: '', valorEstimado: 0,
      atendimento: '', anexos: [], nf: '', xml: null,
      status: 'Em criação', prioridade: 'MEDIA',
      servicoId: undefined, servicoIndex: null, dataCriacao: new Date()
    };
  }

  voltar() { this.router.navigate(['/home']); }
}

import { Component, OnInit, AfterViewInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HeaderComponent } from '../app/shared/header/header.component';
import { ThemeService } from '../app/shared/theme.service';
import { AnalyticsService } from '../app/core/services/analytics.service';
import { ProdutoService } from '../app/core/services/produto.service';
import { VendaService } from '../app/core/services/venda.service';
import { ProdutoView } from '../app/core/models/produto.model';
import { VendaProdutoView, VendaServicoView } from '../app/core/models/venda.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private analyticsService = inject(AnalyticsService);
  private produtoService = inject(ProdutoService);
  private vendaService = inject(VendaService);

  produtos: ProdutoView[] = [];
  vendasProdutos: VendaProdutoView[] = [];
  vendasServicos: VendaServicoView[] = [];

  totalClientes = 0;
  faturamentoTotal = 0;
  totalItens = 0;
  totalTiposProdutos = 0;
  limiteTipos = 10;
  dataAtual = '';
  moedaSimbolo = 'R$';
  loading = true;

  private estoqueChartInstance: Chart | null = null;
  private vendasChartInstance: Chart | null = null;

  constructor() {
    effect(() => {
      if (this.themeService.theme()) {
        setTimeout(() => this.initCharts(), 100);
      }
    });
  }

  ngOnInit() {
    this.dataAtual = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    this.carregarDados();
  }

  carregarDados() {
    this.loading = true;
    forkJoin({
      analytics: this.analyticsService.getAnalytics(),
      produtos: this.produtoService.listar(),
      vendasProd: this.vendaService.listarVendasProduto(),
      vendasServ: this.vendaService.listarVendasServico()
    }).subscribe({
      next: ({ analytics, produtos, vendasProd, vendasServ }) => {
        this.produtos = produtos;
        this.vendasProdutos = vendasProd;
        this.vendasServicos = vendasServ;

        this.faturamentoTotal = analytics.totalRevenue;
        this.totalClientes = analytics.totalClients;
        this.totalItens = analytics.totalItems;
        this.totalTiposProdutos = analytics.totalProductTypes;
        this.moedaSimbolo = analytics.currencySymbol;

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initCharts();
      this.loading = false;
    }, 1200);
  }

  initCharts() {
    this.createEstoqueChart();
    this.createVendasChart();
  }

  createEstoqueChart() {
    const ctx = document.getElementById('estoqueChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.estoqueChartInstance) this.estoqueChartInstance.destroy();

    const isDark = this.themeService.theme() === 'dark';
    const accentColor = isDark ? '#4fc3f7' : '#546e7a';
    const gridColor = isDark ? '#222222' : '#eceff1';
    const tickColor = isDark ? '#94a3b8' : '#90a4ae';

    this.estoqueChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.produtos.map(p => p.nome),
        datasets: [{
          label: 'Quantidade em Estoque',
          data: this.produtos.map(p => p.quantidade),
          backgroundColor: accentColor,
          borderRadius: 6,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: tickColor } },
          x: { grid: { display: false }, ticks: { color: tickColor } }
        }
      }
    });
  }

  createVendasChart() {
    const ctx = document.getElementById('vendasChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.vendasChartInstance) this.vendasChartInstance.destroy();

    const isDark = this.themeService.theme() === 'dark';
    const accentColor = isDark ? '#4fc3f7' : '#546e7a';
    const gridColor = isDark ? '#222222' : '#eceff1';
    const tickColor = isDark ? '#94a3b8' : '#90a4ae';
    const areaColor = isDark ? 'rgba(79, 195, 247, 0.1)' : 'rgba(120, 144, 156, 0.1)';

    const todasVendas = [...this.vendasProdutos, ...this.vendasServicos];
    const vendasPorProduto = this.produtos.map(p =>
      todasVendas
        .filter((v: any) => v.produto === p.nome || v.servico === p.nome)
        .reduce((acc, v) => acc + v.quantidade, 0)
    );

    this.vendasChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.produtos.map(p => p.nome),
        datasets: [{
          label: 'Vendas por Unidade',
          data: vendasPorProduto,
          fill: true,
          backgroundColor: areaColor,
          borderColor: accentColor,
          tension: 0.4,
          pointBackgroundColor: accentColor,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: tickColor } },
          x: { grid: { display: false }, ticks: { color: tickColor } }
        }
      }
    });
  }

  voltar() { this.router.navigate(['/home']); }
}

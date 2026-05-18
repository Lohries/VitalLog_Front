import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { HeaderComponent } from '../app/shared/header/header.component';
import { AnalyticsService } from '../app/core/services/analytics.service';
import { AuthService } from '../app/core/services/auth.service';

@Component({
  selector: 'app-home-modules',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './home-modules.html',
  styleUrls: ['./home-modules.css']
})
export class HomeModules implements OnInit {
  private router = inject(Router);
  private analyticsService = inject(AnalyticsService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  showLogoutModal = false;
  loadingStats = true;

  totalItens = 0;
  totalClientes = 0;
  totalReceita = 0;
  moedaSimbolo = 'R$';

  ngOnInit() {
    this.carregarStats();
  }

  carregarStats() {
    this.loadingStats = true;
    this.analyticsService.getAnalytics().pipe(
      finalize(() => { this.loadingStats = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: (data) => {
        this.totalItens = data.totalItems;
        this.totalClientes = data.totalClients;
        this.totalReceita = data.totalRevenue;
        this.moedaSimbolo = data.currencySymbol ?? 'R$';
      },
      error: () => {}
    });
  }

  navegar(module: string) {
    this.router.navigate([`/${module}`]);
  }

  logout() {
    this.showLogoutModal = true;
  }

  confirmarLogout() {
    this.authService.logout();
  }

  cancelarLogout() {
    this.showLogoutModal = false;
  }
}

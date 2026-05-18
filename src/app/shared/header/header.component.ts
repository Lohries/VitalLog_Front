import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          @if (showBackButton) {
            <button class="back-btn" (click)="onBack.emit()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          }

          <div class="brand-wrapper">
            <div class="logo-symbol">
              <img src="assets/logo.svg" alt="VitalLog" class="logo-img"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
              <span class="logo-fallback">V</span>
            </div>
            <div class="title-stack">
              <h1 class="brand-text">{{ title }}</h1>
              @if (subtitle) {
                <span class="tagline">{{ subtitle }}</span>
              }
            </div>
          </div>
        </div>

        <div class="header-actions">
          <button class="theme-toggle-btn" (click)="themeService.toggleTheme()"
                  [attr.aria-label]="isDark() ? 'Ativar modo claro' : 'Ativar modo escuro'"
                  [attr.title]="isDark() ? 'Ativar modo claro' : 'Ativar modo escuro'">
            <svg *ngIf="isDark()" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="17.78" x2="5.64" y2="16.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg *ngIf="!isDark()" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
          <ng-content></ng-content>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      width: 100%;
      background: var(--header-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--header-border);
      padding: 12px 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      transition: all 0.3s ease;
    }

    .header-content {
      max-width: 1300px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .brand-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo-symbol {
      width: 44px;
      height: 44px;
      background: transparent;
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 20px;
      border-radius: 12px 4px 12px 4px;
      overflow: hidden;
      position: relative;
    }

    .logo-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .logo-fallback {
      display: none;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    .title-stack {
      display: flex;
      flex-direction: column;
    }

    .brand-text {
      font-size: 20px;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.04em;
    }

    .tagline {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .back-btn {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--input-bg);
      border: 1px solid var(--border-clean);
      border-radius: 12px;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
    }

    .back-btn:hover {
      background: var(--accent-pale);
      color: var(--accent);
      border-color: var(--accent);
    }

    @media (max-width: 768px) {
      .tagline { display: none; }
      .brand-text { font-size: 18px; }
    }
  `]
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() showBackButton: boolean = true;
  @Output() onBack = new EventEmitter<void>();

  protected themeService = inject(ThemeService);

  isDark() {
    return this.themeService.theme() === 'dark';
  }
}

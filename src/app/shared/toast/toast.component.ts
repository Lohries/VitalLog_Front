import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-item" [class]="toast.type" (click)="toastService.remove(toast.id)">
          <p>{{ toast.message }}</p>
          <button class="close-btn">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 340px;
    }

    .toast-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 18px;
      border-radius: 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-clean);
      color: var(--text-primary);
      font-weight: 500;
      font-size: 13px;
      cursor: pointer;
      animation: slideIn 0.2s ease-out;
      box-shadow: 0 8px 24px var(--shadow-ambient);
    }

    .toast-item.success { border-left: 4px solid #81c784; }
    .toast-item.error { border-left: 4px solid #e57373; }
    .toast-item.warning { border-left: 4px solid #ffb74d; }
    .toast-item.info { border-left: 4px solid #64b5f6; }

    .close-btn {
      margin-left: auto;
      background: none;
      border: none;
      font-size: 16px;
      color: var(--text-secondary);
      cursor: pointer;
    }

    @keyframes slideIn {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}

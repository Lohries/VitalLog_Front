import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" *ngIf="visible">
      <div class="animation-container">
        <div class="pulse-ring"></div>
        <div class="symbol-container">
          <span class="symbol">V</span>
        </div>
      </div>
      <p class="loading-text">Sincronizando Inteligência...</p>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(10, 10, 10, 0.92);
      backdrop-filter: blur(16px);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
      animation: fadeIn 0.3s ease-out;
    }

    .animation-container {
      position: relative;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .symbol-container {
      width: 60px;
      height: 60px;
      background: #4fc3f7; /* Electric Steel Blue */
      border-radius: 16px 4px 16px 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      box-shadow: 0 0 30px rgba(79, 195, 247, 0.3);
    }

    .symbol {
      color: #000000;
      font-weight: 900;
      font-size: 28px;
    }

    .pulse-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 2px solid #4fc3f7;
      border-radius: 50%;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      opacity: 0.3;
    }

    @keyframes pulse {
      0% { transform: scale(0.6); opacity: 0; }
      50% { opacity: 0.3; }
      100% { transform: scale(1.5); opacity: 0; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .loading-text {
      font-size: 13px;
      font-weight: 700;
      color: #90a4ae;
      text-transform: uppercase;
      letter-spacing: 0.2em;
    }
  `]
})
export class LoadingComponent {
  @Input() visible: boolean = false;
}

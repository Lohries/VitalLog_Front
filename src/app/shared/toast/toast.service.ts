import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info') {
    const id = Date.now();
    const newToast: Toast = { message, type, id };
    setTimeout(() => {
      this.toasts.update(current => [...current, newToast]);
      setTimeout(() => this.remove(id), 4000);
    }, 0);
  }

  success(message: string) { this.show(message, 'success'); }
  error(message: string) { this.show(message, 'error'); }
  info(message: string) { this.show(message, 'info'); }
  warning(message: string) { this.show(message, 'warning'); }

  remove(id: number) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}

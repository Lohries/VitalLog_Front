import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'vitallog-theme';
  theme = signal<Theme>(this.getStoredTheme());

  constructor() {
    effect(() => {
      const currentTheme = this.theme();
      localStorage.setItem(this.THEME_KEY, currentTheme);
      this.applyTheme(currentTheme);
    });
  }

  toggleTheme() {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(this.THEME_KEY) as Theme;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme) {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    body.classList.add(`${theme}-theme`);
    body.setAttribute('data-theme', theme);
  }
}

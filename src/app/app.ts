import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError, Event } from '@angular/router';
import { FooterComponent } from './footer/footer';
import { ToastComponent } from './shared/toast/toast.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { ThemeService } from './shared/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, ToastComponent, LoadingComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);
  protected readonly title = signal('vital-log-front');
  protected readonly showFooter = signal(true);
  protected readonly isLoading = signal(false);
  private themeService = inject(ThemeService);

  constructor() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.isLoading.set(true);
      }
      
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isLoading.set(false);
        
        // Hide footer on login and signup pages
        const isAuthPage = this.router.url.includes('/login') || 
                          this.router.url.includes('/signup') ||
                          this.router.url === '/';
        this.showFooter.set(!isAuthPage);
      }
    });
  }
}

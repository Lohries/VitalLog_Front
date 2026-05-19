import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class LandingComponent {
  private router = inject(Router);

  readonly FORMS_URL = 'https://forms.gle/LybjDYR5L2YixUru7';

  acessarSistema() {
    this.router.navigate(['/login']);
  }

  abrirForms() {
    window.open(this.FORMS_URL, '_blank');
  }
}

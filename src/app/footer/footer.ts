import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  private router = inject(Router);
  currentYear = new Date().getFullYear();

  ir(rota: string) { this.router.navigate([rota]); }
}

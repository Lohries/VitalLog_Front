import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../app/shared/toast/toast.service';
import { AuthService } from '../app/core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private router = inject(Router);
  private toast = inject(ToastService);
  private authService = inject(AuthService);

  isSignUpMode: boolean = false;
  loading = false;

  signUpData = { name: '', email: '', password: '' };
  loginData = { email: '', password: '' };

  toggleMode() {
    this.isSignUpMode = !this.isSignUpMode;
    this.clearForms();
  }

  onSignUp() {
    if (!this.signUpData.name || !this.signUpData.email || !this.signUpData.password) {
      this.toast.warning('Preencha todos os campos!');
      return;
    }
    if (this.signUpData.password.length < 6) {
      this.toast.error('A senha deve ter no mínimo 6 caracteres!');
      return;
    }

    this.loading = true;
    this.authService.signUp(this.signUpData).subscribe({
      next: () => {
        this.toast.success('Cadastro realizado! Bem-vindo ao VitalLog!');
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message ?? 'Erro ao realizar cadastro. Tente novamente.';
        this.toast.error(msg);
      }
    });
  }

  onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      this.toast.warning('Informe email e senha!');
      return;
    }

    this.loading = true;
    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('Bem-vindo ao VitalLog!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message ?? 'Credenciais inválidas. Verifique seu e-mail e senha.';
        this.toast.error(msg);
      }
    });
  }

  irPara(rota: string) { this.router.navigate([rota]); }

  signInWithGoogle() {
    this.toast.info('Login com Google não disponível no momento.');
  }

  signInWithApple() {
    this.toast.info('Login com Apple não disponível no momento.');
  }

  clearForms() {
    this.signUpData = { name: '', email: '', password: '' };
    this.loginData = { email: '', password: '' };
  }
}

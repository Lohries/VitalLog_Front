import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../app/shared/header/header.component';

@Component({
  selector: 'app-suporte',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './suporte.html',
  styleUrl: './suporte.css'
})
export class SuporteComponent {
  private router = inject(Router);

  faqAberto: number | null = null;

  contatos = [
    {
      label: 'E-mail Suporte',
      value: 'suporte@vitallog.com.br',
      href: 'mailto:suporte@vitallog.com.br',
      bg: 'rgba(79, 195, 247, 0.12)',
      icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6'
    },
    {
      label: 'WhatsApp',
      value: '+55 (11) 9 9999-0000',
      href: 'https://wa.me/5511999990000',
      bg: 'rgba(34, 197, 94, 0.12)',
      icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.39 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z'
    },
    {
      label: 'E-mail Jurídico',
      value: 'juridico@vitallog.com.br',
      href: 'mailto:juridico@vitallog.com.br',
      bg: 'rgba(251, 191, 36, 0.12)',
      icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6'
    }
  ];

  faqs = [
    {
      pergunta: 'Como recupero minha senha?',
      resposta: 'Acesse a tela de Segurança (em Ajustes) e utilize a opção "Alterar Senha". Você precisará informar sua senha atual. Caso não lembre, entre em contato com o suporte pelo e-mail.'
    },
    {
      pergunta: 'Os dados ficam salvos no servidor?',
      resposta: 'Sim. Todos os dados do VitalLog são armazenados em um banco de dados PostgreSQL seguro no servidor. Não dependemos de localStorage para dados operacionais — apenas para a sessão de autenticação.'
    },
    {
      pergunta: 'Posso usar o sistema em múltiplos dispositivos?',
      resposta: 'Sim. O VitalLog utiliza autenticação JWT. Você pode fazer login em qualquer navegador ou dispositivo. Cada sessão tem validade de 24 horas.'
    },
    {
      pergunta: 'Como exporto meus dados?',
      resposta: 'A funcionalidade de exportação (PDF/Excel) está em desenvolvimento. Por enquanto, os dados podem ser acessados via API. Entre em contato com o suporte para um dump personalizado.'
    },
    {
      pergunta: 'O que acontece se eu resetar o banco?',
      resposta: 'O reset apaga permanentemente todos os seus registros (produtos, vendas, serviços e negociações). Essa ação é irreversível. Certifique-se de ter um backup antes de prosseguir.'
    },
    {
      pergunta: 'Como adiciono outros usuários?',
      resposta: 'Atualmente cada conta é individual. O gerenciamento multi-usuário (equipes e permissões) está no roadmap de desenvolvimento.'
    }
  ];

  horarios = [
    { dia: 'Segunda – Sexta', horario: '08:00 – 18:00', fechado: false },
    { dia: 'Sábado', horario: '09:00 – 13:00', fechado: false },
    { dia: 'Domingo', horario: 'Fechado', fechado: true },
    { dia: 'Feriados', horario: 'Fechado', fechado: true }
  ];

  toggleFaq(i: number) {
    this.faqAberto = this.faqAberto === i ? null : i;
  }

  voltar() { this.router.navigate(['/home']); }
}

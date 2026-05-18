import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../app/shared/header/header.component';

@Component({
  selector: 'app-termos',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './termos.html',
  styleUrl: './termos.css'
})
export class TermosComponent {
  private router = inject(Router);

  secoes = [
    {
      num: '01',
      titulo: 'Aceitação dos Termos',
      texto: 'Ao acessar e utilizar o VitalLog, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve utilizar o sistema. O uso continuado da plataforma constitui aceitação de quaisquer alterações futuras.'
    },
    {
      num: '02',
      titulo: 'Uso Autorizado',
      texto: 'O VitalLog é uma plataforma de gestão logística corporativa. Você está autorizado a utilizá-la exclusivamente para fins empresariais legítimos, incluindo controle de estoque, vendas, serviços e negociações. É proibido qualquer uso fraudulento, ilegal ou que viole direitos de terceiros.'
    },
    {
      num: '03',
      titulo: 'Responsabilidade pelos Dados',
      texto: 'Você é o único responsável pelos dados inseridos no sistema, incluindo informações de produtos, clientes, transações e negociações. Certifique-se de que todos os dados inseridos são precisos, atualizados e obtidos de forma legal e ética.'
    },
    {
      num: '04',
      titulo: 'Segurança e Confidencialidade',
      texto: 'Suas credenciais de acesso (e-mail e senha) são pessoais e intransferíveis. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas com sua conta. Notifique-nos imediatamente em caso de uso não autorizado.'
    },
    {
      num: '05',
      titulo: 'Privacidade e Proteção de Dados',
      texto: 'Coletamos e processamos apenas os dados necessários para o funcionamento do sistema, em conformidade com a Lei Geral de Proteção de Dados (LGPD). Seus dados não são vendidos ou compartilhados com terceiros sem seu consentimento explícito.'
    },
    {
      num: '06',
      titulo: 'Limitação de Responsabilidade',
      texto: 'O VitalLog é fornecido "como está", sem garantias expressas ou implícitas. Não nos responsabilizamos por perdas de dados decorrentes de falhas de sistema, uso inadequado ou eventos fora de nosso controle. Recomendamos manter backups regulares.'
    },
    {
      num: '07',
      titulo: 'Alterações nos Termos',
      texto: 'Reservamos o direito de modificar estes Termos de Uso a qualquer momento. Alterações significativas serão comunicadas por e-mail ou notificação no sistema. O uso continuado após as alterações implica aceitação dos novos termos.'
    }
  ];

  voltar() { this.router.navigate(['/home']); }
  irParaSuporte() { this.router.navigate(['/suporte']); }
}

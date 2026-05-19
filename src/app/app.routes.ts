import { Routes } from '@angular/router';
import { LandingComponent } from '../landing/landing';
import { LoginComponent } from '../login/login';
import { HomeModules } from '../home-modules/home-modules';
import { EstoqueComponent } from '../estoque/estoque';
import { VendasComponent } from '../vendas/vendas';
import { AjustesComponent } from '../ajustes/ajustes';
import { AnalyticsComponent } from '../analytics/analytics';
import { TermosComponent } from '../termos/termos';
import { SuporteComponent } from '../suporte/suporte';
import { SegurancaComponent } from '../seguranca/seguranca';
import { ClientesComponent } from '../clientes/clientes';
import { EquipeComponent } from '../equipe/equipe';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: LoginComponent },
  { path: 'termos', component: TermosComponent },
  { path: 'suporte', component: SuporteComponent },
  { path: 'seguranca', component: SegurancaComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeModules, canActivate: [authGuard] },
  { path: 'estoque', component: EstoqueComponent, canActivate: [authGuard] },
  { path: 'vendas', component: VendasComponent, canActivate: [authGuard] },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [authGuard] },
  { path: 'ajustes', component: AjustesComponent, canActivate: [authGuard] },
  { path: 'clientes', component: ClientesComponent, canActivate: [authGuard] },
  { path: 'equipe', component: EquipeComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
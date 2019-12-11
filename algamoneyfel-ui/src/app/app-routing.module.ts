import { RelatoriosModule } from './relatorios/relatorios.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada.component';
import { NaoAutorizadoComponent } from './core/nao-autorizado.component';
import { SegurancaRoutingModule } from './seguranca/seguranca-routing.module';



const routes: Routes = [ // Cria as rotas de navegação de paginas 
  { path: 'lancamentos', loadChildren: './lancamentos/lancamentos.module#LancamentosModule' },
  { path: 'pessoas', loadChildren: './pessoas/pessoas.module#PessoasModule' },
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
  { path: 'relatorios', loadChildren: './relatorios/relatorios.module#RelatoriosModule' },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Substituindo a pagina pesquisa de lancamentos redirecionada para dashboard eh page principal
  { path: 'nao-autorizado', component: NaoAutorizadoComponent  },
  { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent },
  { path: '**', redirectTo: 'pagina-nao-encontrada' } // ** qualquer coisa que não for encontrada na rota de paginas jah configuradas
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    SegurancaRoutingModule
    // Removendo os ModulosRouting Lancamnetos e Pessoas para o lazy loading
  
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

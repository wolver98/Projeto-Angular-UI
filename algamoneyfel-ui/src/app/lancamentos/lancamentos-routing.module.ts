import { AuthGuard } from './../seguranca/auth.guard';
import { LancamentoCadastroComponent } from './lancamento-cadastro/lancamento-cadastro.component';
import { LancamentosPesquisaComponent } from './lancamentos-pesquisa/lancamentos-pesquisa.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [ // Cria as rotas de navegação de paginas
    { 
      path: '',  // Antes path: 'lancamentos' remover o nome do path senao terar que acrescentar lancamentos/lancamentos la do carregamento tardio de app-routing.module 
      component: LancamentosPesquisaComponent, 
      canActivate: [AuthGuard], // Aqui vai impedir de um usuario não autorizado entrar
      data: { roles: ['ROLE_PESQUISAR_LANCAMENTO'] } // aqui pode ter mais de uma permissao se precisar ex: roles: ['permissao01', 'permi02']
    },
    { 
      path: 'novo', // Antes path: 'lancamentos/novo'
      component: LancamentoCadastroComponent, 
      canActivate: [AuthGuard],
      data: { roles: ['ROLE_CADASTRAR_LANCAMENTO'] }  
    },  
    { 
      path: ':codigo', // Antes lancamentos/:codigo
      component: LancamentoCadastroComponent, 
      canActivate: [AuthGuard],
      data: { roles: ['ROLE_CADASTRAR_LANCAMENTO'] } 
      
    }
       
];

@NgModule({
  
  exports: [ 
    RouterModule

  
  ],
  imports: [
    RouterModule.forChild(routes)

  ]
})
export class LancamentosRoutingModule {

}
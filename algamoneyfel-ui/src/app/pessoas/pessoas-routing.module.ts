import { AuthGuard } from './../seguranca/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PessoasPesquisaComponent } from './pessoas-pesquisa/pessoas-pesquisa.component';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';



const routes: Routes = [
    { 
      path: '', 
      component: PessoasPesquisaComponent, 
      canActivate: [AuthGuard], 
      data: { roles: ['ROLE_PESQUISAR_PESSOA'] } 
    },
    { 
      path: 'novo', 
      component: PessoaCadastroComponent, 
      canActivate: [AuthGuard],
      data: { roles: ['ROLE_CADASTRAR_PESSOA'] } 
    },
    { 
      path: ':codigo', 
      component: PessoaCadastroComponent,
      canActivate: [AuthGuard],
      data: { roles: ['ROLE_REMOVER_PESSOA'] } 
    },
];

@NgModule({
  
    exports: [ 
      RouterModule
    ],
    imports: [
      RouterModule.forChild(routes)
    ]
  })
  export class PessoasRoutingModule {
  
  }
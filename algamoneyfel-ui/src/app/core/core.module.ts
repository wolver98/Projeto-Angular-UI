import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { JwtHelperService } from '@auth0/angular-jwt';

import { ToastyModule } from 'ng2-toasty';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/components/common/api';

import { ErrorHandlerService } from './error-handler.service';
import { NavbarComponent } from './navbar/navbar.component';
import { PessoasService } from '../pessoas/pessoas.service';
import { LancamentoService } from './../lancamentos/lancamento.service';
import { CategoriaService } from './../categorias/categoria.service';
import { AuthService } from './../seguranca/auth.service';
import { RouterModule } from '@angular/router';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';
import { Title } from '@angular/platform-browser';
import { NaoAutorizadoComponent } from './nao-autorizado.component';
import { DashboardService } from '../dashboard/dashboard.service';
import { RelatoriosService } from '../relatorios/relatorios.service';

registerLocaleData(localePt);

@NgModule({
  declarations: [ NavbarComponent, PaginaNaoEncontradaComponent, NaoAutorizadoComponent ],
  exports: [ 
    NavbarComponent,
    ToastyModule,
    ConfirmDialogModule  
  ],
  
  providers: [
    ErrorHandlerService,
    LancamentoService, 
    PessoasService,
    ConfirmationService,
    CategoriaService,
    AuthService,
    DashboardService,
    RelatoriosService,

    {provide: LOCALE_ID, useValue: 'pt-BR'},

    Title,
    JwtHelperService
    
  ],
  imports: [
    CommonModule,
    RouterModule,

    ToastyModule.forRoot(),
    ConfirmDialogModule
  ]
})
export class CoreModule { }

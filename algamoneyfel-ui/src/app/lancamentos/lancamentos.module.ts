import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { LancamentosPesquisaComponent } from './lancamentos-pesquisa/lancamentos-pesquisa.component';
import { LancamentoCadastroComponent } from './lancamento-cadastro/lancamento-cadastro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { InputTextareaModule } from 'primeng/components/inputtextarea/inputtextarea';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { SelectButtonModule } from 'primeng/components/selectbutton/selectbutton';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { LancamentosRoutingModule } from './lancamentos-routing.module';

/* Features Modules(Modulos de Funcionalidade) sao usados para separar components que tem
   participação ou relação nesse possui tres components que foi declarado
   LancamentosPequisaComponent, LancamentoCadastroComponent e LancamentosGridComponent 
*/

@NgModule({
  declarations: [
    LancamentosPesquisaComponent,
    LancamentoCadastroComponent

  ],
  exports: [ 
    /**
     * Não será masi necessario exportar os components 
     * pesquisa e cadastro de lancamentos por não mais estah usando o 
     * selector na app.component.html e sim no lugar o <router-outlet></router-outlet>
     */

  ],
  imports: [
    CommonModule,
    /* Shared Modules são modulos que sao compartilhados com 
    outros modulos usados em comun com mesmo efeito */
    SharedModule,
    LancamentosRoutingModule,

    //importando FormsModule para remover os erros do ngForm,ngModel,ect
    FormsModule,
    // Acrescentando o Reactive.. para o form. reativo
    ReactiveFormsModule,
    // importando os modulos do primeng
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    InputTextareaModule,
    CalendarModule,
    SelectButtonModule,
    DropdownModule,
    CurrencyMaskModule
    
  
  ]
})
export class LancamentosModule { }

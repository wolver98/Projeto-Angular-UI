import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarModule } from 'primeng/components/calendar/calendar';

import { RelatoriosRoutingModule } from './relatorios-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RelatorioLancamentosComponent } from './relatorio-lancamentos/relatorio-lancamentos.component';
import { RelatoriosLancamentosTipoComponent } from './relatorios-lancamentos-tipo/relatorios-lancamentos-tipo.component';

@NgModule({
  declarations: [RelatorioLancamentosComponent,
    RelatoriosLancamentosTipoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RelatoriosRoutingModule,

    SharedModule,

    CalendarModule
  ]
})
export class RelatoriosModule { }

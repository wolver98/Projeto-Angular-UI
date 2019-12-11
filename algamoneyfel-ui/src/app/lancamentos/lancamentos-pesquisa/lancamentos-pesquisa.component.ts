import { Component, OnInit, ViewChild } from '@angular/core';

import { LancamentoService, lancamentosFilter } from '../lancamento.service';
import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { AuthService } from './../../seguranca/auth.service';

import { Table } from 'primeng/table';
import { ToastyService } from 'ng2-toasty';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {
    
  filtro = new lancamentosFilter(); // Vai passar como parametro as propriedades da classe lancamentosFilter nos inputsCalendar
  totalRegistros = 0;
  lancamentos = [];
  @ViewChild('tabela', {static: true}) grid: Table;

  constructor(private lancamentoService: LancamentoService,
              private toastyService: ToastyService,
              private confirmtionService: ConfirmationService,
              private errorHandler: ErrorHandlerService,
              private title: Title,
              public auth: AuthService ) {}

  ngOnInit() {
    this.title.setTitle('Pesquisa de Lançamentos');

  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.lancamentoService.pesquisar(this.filtro) 
      .then(resultado => { 
        this.lancamentos    = resultado.lancamentos; //propiedade .lancamentos vindo do return do metodo pesquisaService lancamentos
        this.totalRegistros = resultado.total; //propiedade .total vindo do return do metodo pesquisaService total
      })
      .catch(erro => this.errorHandler.handle(erro));
      
  }

  aoMudarPagina(event: LazyLoadEvent) {
    
    /* vai calcular a pagina que estah atualmente em rows foi atribuido 5 
      para resultar a pesquisa em 5 linhas se eu pesquiso da pagina zero 
      entao sera 0 / 5 = 0 que eh a pagina 1 ou seja a primeira pagina da lista 
      porque 0 tambem conta como pagina se fo 5 / 5 = 1 inicio da segunda pagina
      10 / 5 = 2 inicio da 3 e assim por diante 
    */  
    const pagina = event.first / event.rows; 
    this.pesquisar(pagina);
  }
  
  confirmarExclusao(lancamento: any) {
    
    this.confirmtionService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }

  excluir(lancamento: any) {
   
    this.lancamentoService.excluir(lancamento.codigo)
      .then(() => {
        this.grid.reset();

        this.toastyService.success('Lançamento excluído com sucesso');
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}

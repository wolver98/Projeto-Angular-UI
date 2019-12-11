import { AuthService } from './../../seguranca/auth.service';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';
import { Table } from 'primeng/table';
import { ToastyService } from 'ng2-toasty';

import { PessoasFilter, PessoasService } from '../pessoas.service';
import { ErrorHandlerService } from './../../core/error-handler.service';


@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

    pessoas = [];
    filtro = new PessoasFilter();
    totalRegistros = 0;
    @ViewChild('tabela', { static: true }) grid: Table;

    constructor(private pessoasService: PessoasService,
                private toastService: ToastyService,
                private confirmationService: ConfirmationService,
                private errorHandler: ErrorHandlerService,
                private title: Title,
                public auth: AuthService) {}
    
    ngOnInit() {
        this.title.setTitle('Pesquisa de Pessoas');
        
    }

    pesquisar(pagina = 0) {

        this.filtro.pagina = pagina;

        this.pessoasService.pesquisar(this.filtro)
        .then(resultado => {
            this.pessoas = resultado.pessoas
            this.totalRegistros = resultado.total
        })
        .catch(erro => this.errorHandler.handle(erro));
  
    }

   aoMudarPagina(event: LazyLoadEvent) {

        const pagina = event.first / event.rows;
        this.pesquisar(pagina);
   } 

   confirmarExclusao(pessoa: any) {

       this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir?',
            accept: () => {
            this.excluir(pessoa);
            }
       });
   }

   excluir(pessoa: any) {
       
       this.pessoasService.excluir(pessoa.codigo)
       .then(() => {
            this.grid.reset();
            
            this.toastService.success('Pessoa excluída com sucesso.');
       })
       .catch(erro => this.errorHandler.handle(erro));
   }

   atualizarStatus(pessoa: any): void {
    const novoStatus = !pessoa.ativo;

    this.pessoasService.atualizarStatus(pessoa.codigo, novoStatus)
     .then(() => {
        const acao = novoStatus ? 'Ativada' : 'Desativada';

        pessoa.ativo = novoStatus;
        
        this.toastService.success(`Pessoa ${acao} com sucesso!`);
     })
     .catch(erro => this.errorHandler.handle(erro));
    }

}

import { RelatoriosService } from './../relatorios.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-relatorios-lancamentos-tipo',
  templateUrl: './relatorios-lancamentos-tipo.component.html',
  styleUrls: ['./relatorios-lancamentos-tipo.component.css']
})
export class RelatoriosLancamentosTipoComponent implements OnInit {
  
  periodoInicio: Date;
  periodoFim: Date;

  constructor(private relatoriosService: RelatoriosService) { }

  ngOnInit() {
  }

  gerar() {
    //console.log(this.periodoInicio); para testes
    //console.log(this.periodoFim); para testes
    this.relatoriosService.relatorioLancamentosPorTipo(this.periodoInicio, this.periodoFim)
      .then(relatorio => {
        const url = window.URL.createObjectURL(relatorio);

        window.open(url);
    });
  }

}

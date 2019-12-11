import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';
import * as moment from 'moment';

@Injectable()
export class DashboardService {

  lancamentosUrl: string;

  constructor( private httpClient: HttpClient ) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }


   lancamentosPorCategoria(): Promise<Array<any>> {
     return this.httpClient.get(`${this.lancamentosUrl}/estatisticas/por-categoria`)
      .toPromise()
      .then(response => response as Array<any>); // foi feito um cast para garantir a tipagem do mesmo
   }

   lancamentosPorDia(): Promise<any> {
    return this.httpClient.get(`${this.lancamentosUrl}/estatisticas/por-dia`)
     .toPromise()
     .then(response => {
      const dados = response as Array<any>
      this.converterStringParaDatas(dados);

      return dados;
     }); 
  }

  converterStringParaDatas(dados: Array<any>) {
    for(const dado of dados) { // Em java dado : dados
      dado.dia = moment(dado.dia, 'YYYY-MM-DD').toDate(); 
    }
  }
  


}

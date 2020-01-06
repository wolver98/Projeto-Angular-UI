//import { environment } from './../../environments/environment';
import { environment } from './../../environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {
  
  lancamentosURL: string;

  constructor(private httpClient: HttpClient) { 
    this.lancamentosURL = `${environment.ApiUrl}/lancamentos`
  }

  relatorioLancamentosPorPessoa(inicio: Date, fim: Date) {
    let params = new HttpParams();

    params = params.set('inicio', moment(inicio).format('YYYY-MM-DD'));
    params = params.set('fim', moment(fim).format('YYYY-MM-DD'));

    return this.httpClient.get(`${this.lancamentosURL}/relatorios/por-pessoa`, 
      { params, responseType: 'blob' })
        .toPromise()
        .then(response => response);

  }

  relatorioLancamentosPorTipo(inicio: Date, fim: Date) {
    let params = new HttpParams();

    params = params.set('inicio', moment(inicio).format('YYYY-MM-DD'));
    params = params.set('fim', moment(fim).format('YYYY-MM-DD'));

    return this.httpClient.get(`${this.lancamentosURL}/relatorios/por-tipo`, 
      { params, responseType: 'blob' })
        .toPromise()
        .then(response => response);

  }
}

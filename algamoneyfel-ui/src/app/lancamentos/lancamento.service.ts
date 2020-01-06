import { Lancamento } from './../core/model';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
//import { environment } from 'src/environments/environment'; // Para Dev
import { environment } from 'src/environments/environment.prod';

export class lancamentosFilter {
  descricao: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 5;
} 


@Injectable({
  providedIn: 'root'
})
export class LancamentoService {
  
  // Antes lancamentosURL = 'http://localhost:8080/lancamentos';
  lancamentosURL: string

  constructor(private httpClient: HttpClient) { 
    this.lancamentosURL = `${environment.ApiUrl}/lancamentos`;
  }
  
  
  urlUploadAnexo(): String {
    return `${this.lancamentosURL}/anexo`;
  }

  pesquisar(filtro: lancamentosFilter): Promise<any> {
    // usado para basic security const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if(filtro.descricao) { // o parametro filtro possui a propriedade descricao que vem da interface lancamentosFilter
      params = params.set('descricao', filtro.descricao); // 'descricao' vem da api que tbm eh usado no postmam como parametro de busca
    }

    if(filtro.dataVencimentoInicio) {
      params = params.set('dataVencimentoDe', moment(filtro.dataVencimentoInicio) 
        .format('YYYY-MM-DD'));
    }

    if(filtro.dataVencimentoInicio) {
      params = params.set('dataVencimentoAte', moment(filtro.dataVencimentoFim)
        .format('YYYY-MM-DD'));
    }
                                                              // Não eh mais necessario o uso da variavel headers no { paramas }
    return  this.httpClient.get(`${this.lancamentosURL}?resumo`, { params }) // Ao colocar os {} se torna um objeto json 
      .toPromise() 
      .then(response => {
        const lancamentos = response['content']
        const resultado = {
          lancamentos,
          total: response['totalElements']
        };
        
        return resultado;
      })
  
  }

  excluir(codigo: number): Promise<any> {
    // Usado para basic security const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    
    return this.httpClient.delete(`${this.lancamentosURL}/${codigo}`) // removendo o { headers } para oauth-security
      .toPromise()
      .then(response => null);

  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
   // const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
   //  .append('Content-Type', 'application/json');

    return this.httpClient.post<Lancamento>(this.lancamentosURL, lancamento)
      .toPromise();
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
   // const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
    //  .append('Content-Type', 'application/json');
    
    return this.httpClient.put<Lancamento>(`${this.lancamentosURL}/${lancamento.codigo}`, lancamento)
    .toPromise()
    .then(lancamentoAlterado => {

      this.converterStringsParaDatas([lancamentoAlterado]);

      return lancamentoAlterado;
    })
  }

  buscarPorCodigo(codigo: number): Promise<Lancamento> {
   // const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    
    return this.httpClient.get<Lancamento>(`${this.lancamentosURL}/${codigo}`)
    .toPromise()
    .then(lancamentos => {

      this.converterStringsParaDatas([lancamentos]); // ([]) eh um array de lancamentos vai percorrer todos lancamentos

      return lancamentos;
    });
  }

  converterStringsParaDatas(lancamentos: Lancamento[]) {
    for(const lancamento of lancamentos) {
      lancamento.dataVencimento = moment(lancamento.dataVencimento, 'YYYY-MM-DD').toDate();

      if(lancamento.dataPagamento) {
        lancamento.dataPagamento = moment(lancamento.dataPagamento, 'YYYY/MM/DD').toDate();
      }
    
    }
  }


}

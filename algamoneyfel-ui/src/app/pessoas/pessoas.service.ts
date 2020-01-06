//import { environment } from 'src/environments/environment'; //para Dev
import { environment } from 'src/environments/environment.prod';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Pessoa, Estado, Cidade } from '../core/model';

export class PessoasFilter {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;

}


@Injectable({
  providedIn: 'root'
})
export class PessoasService {
  
  pessoasURL: string;
  cidadesURL: string;
  estadosURL: string;

  constructor(private httpClient: HttpClient) {
    this.pessoasURL = `${environment.ApiUrl}/pessoas`;
    this.cidadesURL = `${environment.ApiUrl}/cidades`;
    this.estadosURL = `${environment.ApiUrl}/estados`;
   }

  pesquisar(filtro: PessoasFilter): Promise<any> {
    
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    
    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if(filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return this.httpClient.get(`${this.pessoasURL}`, { headers, params })
    .toPromise()
    .then(response => {
      
      const pessoas = response['content']
      const resultado = {
        pessoas,
        total: response['totalElements']
      };

      return resultado;
    })

  }

  listarTodos(): Promise<any> {
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    
    return this.httpClient.get(`${this.pessoasURL}`, { headers })
      .toPromise();

  }

  atualizarStatus(codigo: number, ativo: boolean): Promise<void>{
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');

    return this.httpClient.put(`${this.pessoasURL}/${codigo}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);

  } 

  excluir(codigo: number) {
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.httpClient.delete(`${this.pessoasURL}/${codigo}`, { headers })
    .toPromise()
    .then(response => null);
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');

    return this.httpClient.post<Pessoa>(this.pessoasURL, pessoa, { headers })
      .toPromise(); 
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');
    
    return this.httpClient.put<Pessoa>(`${this.pessoasURL}/${pessoa.codigo}`, pessoa, { headers })
      .toPromise();
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.httpClient.get<Pessoa>(`${this.pessoasURL}/${codigo}`, { headers })
    .toPromise()
  }

  listarEstados(): Promise<Estado[]> {
    
    return this.httpClient.get<Estado[]>(this.estadosURL)
      .toPromise();
  }

  pesquisarCidades(estado): Promise<Cidade[]> {
    const params = new HttpParams().set('estado', estado);
    
    return this.httpClient.get<Cidade[]>(this.cidadesURL, { params })
      .toPromise()
      .then(response => response as Cidade[]);
  }

}

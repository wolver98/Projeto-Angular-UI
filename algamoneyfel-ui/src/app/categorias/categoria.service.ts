//import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
   
  categoriasURL: string;

  constructor(private httpClient: HttpClient) { 
    this.categoriasURL = `${environment.ApiUrl}/categorias`;
  }

  listarCategorias(): Promise<any> {
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    
    return this.httpClient.get(`${this.categoriasURL}`, { headers })
      .toPromise();
  }
}

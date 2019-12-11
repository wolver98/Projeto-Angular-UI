import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  oauthTokenUrl: string;
  jwtPayLoad: any;
  tokensRevokeUrl: string;

  constructor(private httpClient: HttpClient,
              private jwtHelperServ: JwtHelperService) { 
    
    this.carregarToken();  
    this.oauthTokenUrl = `${environment.apiUrl}/oauth/token`;
    this.tokensRevokeUrl = `${environment.apiUrl}/tokens/revoke`;
  }

  login(usuario: string, senha: string): Promise<void> {
    const headers = new HttpHeaders().append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==')
      .append('Content-Type', 'application/x-www-form-urlencoded');

    const body = `username=${usuario}&password=${senha}&grant_type=password`;
                                                                    //withCrede.. vai ajudar a obter o novo access token e o cookie nao vai ser ignorado
    return this.httpClient.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        //console.log(response); consoloe para testes
        this.armazenarToken(response['access_token']); // Acessando a propriedade access_token entre colchetes []
      })
      .catch(response => {
        
        //console.error('Motivo do Erro: ', response); console para testes
        if(response.status === 400) {
          const responseError = response.error;
          
          if(responseError.error === 'invalid_grant') {
            return Promise.reject('Usuário ou senha inválido!');
          }
        }

        return Promise.reject(response); 
         
      }); 
  }
  
  // Método para renovar o access_token depois que expira
  obterNovoAccessToken(): Promise<void> {
    const headers = new HttpHeaders().append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==')
      .append('Content-Type', 'application/x-www-form-urlencoded');
    
    const body = 'grant_type=refresh_token';

    return this.httpClient.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        this.armazenarToken(response['access_token']);
        
        console.log('Novo access token criado!');

        return Promise.resolve(null);
      })
      .catch(response => {
        console.error('Erro ao renovar token.', response);
        return Promise.resolve(null);
      });
  }
  
  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');
     
    return !token || this.jwtHelperServ.isTokenExpired(token);
  }

  temPermissao(permissao: string) {
    // Vai retornar o link na navbar senao tiver permissao nao aparecerar o link na navbar da pagina lancamento ou pessoa
    return this.jwtPayLoad && this.jwtPayLoad.authorities.includes(permissao);
  }
  
  // Metodo para retornar varias permissoes caso o usuario tenha mais de uma permissao em uma pagina
  temQualquerPermissao(roles) {
    for(const role of roles) {
      if(this.temPermissao(role)) {
        return true;
      }
    }

    return false;
  }

 

  logout() {
    return this.httpClient.delete(this.tokensRevokeUrl, { withCredentials: true })
      .toPromise()
      .then(() => {
        this.limparAccessToken();
      });
  }


  private limparAccessToken() {
    localStorage.removeItem('token');

    this.jwtPayLoad = null;
  }

  private armazenarToken(token: string) {
     this.jwtPayLoad = this.jwtHelperServ.decodeToken(token);
     localStorage.setItem('token', token); // vai guardar o token no navegador do usuário para não perder-lo ao carregar a pagina
  }
  
  /* Método para que ao atualizar(refresh) a pagina ainda mantém o 
     token atual ateh expirar. Para apagar o token ir em mais ferramentas
     no browser, limpar dados de navegação e depois Cookies.
  */ 
  private carregarToken() {
    const token = localStorage.getItem('token');

    if(token) {
      this.armazenarToken(token);
    }
  }

}

import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})    // Classe para guarda de rotas que impede de um usuario nao autorizado acessar
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.auth.isAccessTokenInvalido()) {
      console.log('Navegação com access token inválido. Obtendo novo token...');
      
      return this.auth.obterNovoAccessToken()
        .then(() => {
          if(this.auth.isAccessTokenInvalido()) {
            
            this.router.navigate(['/login']);
            return false;
          }
          
          return true;
        });
    } else if(next.data.roles && !this.auth.temQualquerPermissao(next.data.roles)) {
      this.router.navigate(['/nao-autorizado']);
      
      return false;
    }
    
    return true;
    
  }
  
}

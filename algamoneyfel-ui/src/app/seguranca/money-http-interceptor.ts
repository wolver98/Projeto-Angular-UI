import { AuthService } from './auth.service';
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable, from} from 'rxjs';
import { mergeMap } from 'rxjs/operators';


// Classe criada para tratar o erro quando o token expira na sessao do usuario
export class NotAuthenticatedError {}


@Injectable()
export class MoneyHttpInterceptor implements HttpInterceptor {
   
    constructor(private authService: AuthService) {}
    
    /**
     * Primeiramente fazemos duas validações, uma pra saber se não estamos nos referindo ao path "/oauth/token" e outra 
     * para sabermos se o nosso token está inválido.
     *  Se o path for /oauth/token:
        Neste caso, estamos fazendo uma busca por um token válido, o que 
          significa que nosso token atual já foi invalidado. Se não validarmos o request para este path, entraremos em um loop infinito.
        Se o token está inválido:
        Aqui checamos se nosso token está inválido, e se estiver, precisamos
          obter um novo, através do "/oauth/token"
     * 
     */

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if(!req.url.includes('/oauth/token') && this.authService.isAccessTokenInvalido()) {
             
            console.log('Requisição com Http Access Token invalido. Obtendo um novo Token... ');
            return from(this.authService.obterNovoAccessToken())
                .pipe(
                    mergeMap(() => {
                        if(this.authService.isAccessTokenInvalido()) {
                            throw new NotAuthenticatedError();
                        }
                        req = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        });
                        return next.handle(req);
                    })
                );
        }
        
        return next.handle(req);
    }

    
    

}
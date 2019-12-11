import { AuthGuard } from './auth.guard';
import { MoneyHttpInterceptor } from './money-http-interceptor';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginFormComponent } from './login-form/login-form.component';
import { SegurancaRoutingModule } from './seguranca-routing.module';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from '../shared/shared.module';




// Método para obter o access_token
export function tokenGetter(): string {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
    JwtModule.forRoot({ // Configuração para obter o access_token
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:8080'], // Requisições que serão interceptadas e add ao token Antes: 'localhost:8080' Em produção: 'algamoneyfel-api.herokuapp.com'
        blacklistedRoutes: ['http://localhost:8080/oauth/token'] // nao serão interceptadas... Antes: 'http://localhost:8080/oauth/token' Em produção: https://algamoneyfel-api.herokuapp.com/oauth/token 
      }
    }),
    
    SharedModule,
    SegurancaRoutingModule,
  
    FormsModule,
    InputTextModule,
    ButtonModule
  ],
  providers: [
    JwtHelperService, // Verificar nas configurações no site https://github.com/auth0/angular2-jwt
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MoneyHttpInterceptor,
      multi: true
    },
    AuthGuard

  ]
})
export class SegurancaModule { }

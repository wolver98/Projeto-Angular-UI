import { Router } from '@angular/router';
import { ErrorHandlerService } from './../error-handler.service';
import { AuthService } from './../../seguranca/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  exibindoMenu = false;

  constructor(public auth: AuthService,
              private errorHandler: ErrorHandlerService,
              private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.auth.logout()
      .then(() => {
        this.router.navigate(['/login'])
      })
      .catch(erro => this.errorHandler.handle(erro)); 
  }

  /*criarNovoAccessToken() {
    this.auth.obterNovoAccessToken();
  } Usado para testes */ 

}

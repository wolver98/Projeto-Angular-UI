import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router) {
    
   // removendo do projeto o toastyConfig this.toastyConfig.theme = 'bootstrap'; 
  }

  exibindoNavBar() {
    return this.router.url !== '/login'; // Só vai retornar a navbar quando for diferente da pagina login
  }  

}

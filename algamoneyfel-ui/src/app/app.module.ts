import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SegurancaModule } from './seguranca/seguranca.module';
import { SegurancaRoutingModule } from './seguranca/seguranca-routing.module';



@NgModule({
  declarations: [
    AppComponent,
  
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // Removendo SegurançaRoutingModule
    HttpClientModule,
    
    //Removendo os modulos Lancamentos e Pessoas para o lazy loading
   
    // CoreModule Sao moduloes que só sao usados na raiz do projeto que é o caso do NavbarComponent
    CoreModule,
    SegurancaModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

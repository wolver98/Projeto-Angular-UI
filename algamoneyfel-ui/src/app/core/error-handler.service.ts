import { NotAuthenticatedError } from './../seguranca/money-http-interceptor';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastyService } from 'ng2-toasty';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/components/common/messageservice';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private messageService: MessageService,
              private router: Router) { }

  handle(errorResponse: any) {
    let msg: string;
    
    if(typeof errorResponse === 'string') {
      msg = errorResponse; // Vai retornar o texto do .catch() direto do metodo service.component
    
    } else if(errorResponse instanceof NotAuthenticatedError) {
      msg = 'Sua sessão exprirou!';
      this.router.navigate(['/login']); 
    
    } else if(errorResponse instanceof HttpErrorResponse && errorResponse.status >=400
        && errorResponse.status <=499 ) {
      
      msg = 'Ocorreu um erro ao processar a sua solicitação';
      try {
      
       msg = errorResponse[0].msgUsuario;
      } catch(e) {}

     // if (errorResponse.status === 400) {
     //   msg = 'Operação não permitida!';
     // }
      
     // if (errorResponse.status === 401) {
      //msg = 'Acesso não autorizado!'
     // }

      if (errorResponse.status === 403) {
        msg = 'Voce não tem permissao para executar esta ação!';
      }
      console.error('Motivo do erro:', errorResponse);

    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.';
      console.error('Ocorreu um erro!', errorResponse);
    }

    this.messageService.add({ severity: 'error', detail: msg });
   
  
  }
}

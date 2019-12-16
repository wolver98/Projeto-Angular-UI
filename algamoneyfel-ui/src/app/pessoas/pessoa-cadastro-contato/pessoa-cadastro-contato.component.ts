import { Pessoa } from './../../core/model';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Contato } from 'src/app/core/model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pessoa-cadastro-contato',
  templateUrl: './pessoa-cadastro-contato.component.html',
  styleUrls: ['./pessoa-cadastro-contato.component.css']
})
export class PessoaCadastroContatoComponent implements OnInit {
  
  contato: Contato;
  @Input() contatos: Array<Contato>;
  exibindoFormularioContato = false;
  contatoIndex: number;
  
  // para o reactive form @Input() pessoa: Pessoa;
  // para o reactive form  @Input() formulario: FormGroup;
  // para o reactive form isEditando = false; // Operador de controle para inserção ou alteração de contatos da pessoa

  constructor(private formBuilder: FormBuilder) { } // formBuilder não esta sendo usando 

  ngOnInit() {
  }
  
  
  get editando() {
    return this.contato && this.contato.codigo;
  }
  
 /* Usado para o formulario reativo 
 // Vai retornar os dados do novo contato ao colocar no metodo confirmarContato()
  criarFormGroupContato(): FormGroup {
    return this.formBuilder.group({
      codigo: [],
      nome: [null, Validators.required],
      email: [null, Validators.required],
      telefone: [null, Validators.required]
    }); 
  } */ 

  // Vai exibir o panel e preparar para inserção do novo contato ao objeto pessoa
  prepararNovoContato() {
    this.exibindoFormularioContato = true;
    
    this.contato = new Contato();
    this.contatoIndex = this.contatos.length; // pegando indice do novo contato - this.pessoa.contatos.length
    //this.isEditando = false;
  }

  prepararEdicaoContato(contato: Contato, index: number) {
    this.contato = this.clonarContato(contato) // Criar uma nova isntancia a partir de um contato existente
    this.exibindoFormularioContato = true;
    this.contatoIndex = index;
    
    //this.isEditando = true
  }

  // Metodo que vai fazer um copia do novo contato para não perde-lo quando 
  // passar pelo form.reset() do metodo confirmarContato()
  clonarContato(contato: Contato): Contato {
    return new Contato(contato.codigo, contato.nome, 
      contato.email, contato.telefone);
  }

  confirmarContato(form: any) {
   
    this.contatos[this.contatoIndex] = this.clonarContato(this.contato); // vai pegar o contato clonado e guardo-lo no index em caso de for alterar o contato 
    
    /* formulario reativo
    const contatosFormArray = this.formulario.get('contatos') as FormArray;
    if(!this.isEditando) {
      contatosFormArray.push(this.criarFormGroupContato()); // Aqui vai add na lista de contatos da pessoa
    }
    this.formulario.patchValue(this.pessoa); // vai exibir lista(array) de contatos
    */
    this.exibindoFormularioContato = false;
    form.reset();
      
  }

  removerContato(index: number) {
  
    this.contatos.splice(index, 1);
  // removendo com reative form const contatosFormArray = this.formulario.get('contatos') as FormArray;
  //contatosFormArray.removeAt(index);
 
  /* Outra forma de remoção..  
    this.contatosFormArray.pop();
    this.formulario.patchValue(this.pessoa);
    this.contatos.splice(index, 1); */
  }

}

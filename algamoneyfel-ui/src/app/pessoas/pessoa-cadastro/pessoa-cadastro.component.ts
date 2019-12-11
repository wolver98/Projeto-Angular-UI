import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { PessoasService } from './../pessoas.service';
import { Component, OnInit } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { Pessoa, Contato } from 'src/app/core/model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {
  
  pessoa = new Pessoa(); 
  
  formulario: FormGroup;
  
  constructor(private pessoasService: PessoasService,
              private errorHandler: ErrorHandlerService,
              private toastyService: ToastyService,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private formBuilder: FormBuilder ) { }

  ngOnInit() {
    this.title.setTitle('Nova Pessoa');
    const codigoPessoa = (this.route.snapshot.params['codigo'])
    
    if(codigoPessoa) {
      this.carregarPessoa(codigoPessoa);
    }

    this.configurarFormulario();
  
  }
  
  get editando() {
    //return Boolean(this.pessoa.codigo);
    return Boolean(this.formulario.get('codigo').value);
  }


  criarFormGroupContato(): FormGroup {
    return this.formBuilder.group({
      codigo: [],
      nome: [null, Validators.required],
      email: [null, Validators.required],
      telefone: [null, Validators.required]
    });
  } 

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      nome: [null, [Validators.required, Validators.minLength(5)] ],
      ativo: [true],
      endereco: this.formBuilder.group({
        logradouro: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [],
        bairro: [null, Validators.required],
        cep: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      }),
      contatos: this.formBuilder.array([]) // adicionando o contatos para exibição em master detail como um array de objects

    });
  }

  carregarPessoa(codigo: number) {
   this.pessoasService.buscarPorCodigo(codigo)
    .then(pessoa => {
      this.pessoa = pessoa

      this.formulario.patchValue(pessoa); // Vai pegar o objeto pessoa jah existente do banco e xibir no tituloEdição
      this.atualizarTituloEdição();

      const contatosFormArray = this.formulario.get('contatos') as FormArray;
      this.pessoa.contatos.forEach(() => {
        contatosFormArray.push(this.criarFormGroupContato());
      }); 

      this.formulario.patchValue(this.pessoa); // vai pegar objeto pessoa com sua lista de contatos
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  salvar() {

    if(this.editando) {
      this.atualizarPessoa();
    } else {
      this.adicionarPessoa();
    }
  }

  adicionarPessoa() {
    
    this.pessoasService.adicionar(this.formulario.value)
      .then(pessoaAdicionado => {

        this.toastyService.success("Pessoa adicionada com sucesso");
        
        this.router.navigate(['/pessoas', pessoaAdicionado.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo() {
    this.formulario.reset();

    setTimeout(function(){
      this.pessoa = new Pessoa();
    }.bind(this), 1);

    this.router.navigate(['/pessoas/novo']);

  }

  atualizarPessoa() {
    
    this.pessoasService.atualizar(this.formulario.value)
      .then(pessoa => {
        //this.pessoa = pessoa;
        this.formulario.patchValue(pessoa);

        this.toastyService.success('Pessoa alterada com sucesso');
        this.atualizarTituloEdição();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarTituloEdição() {
    this.title.setTitle('Edição de Pessoa: '+ this.formulario.get('nome').value);
  }


}

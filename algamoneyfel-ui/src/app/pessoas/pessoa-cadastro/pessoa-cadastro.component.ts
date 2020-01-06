import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { PessoasService } from './../pessoas.service';
import { Component, OnInit } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { Pessoa } from 'src/app/core/model';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {
  
  pessoa = new Pessoa(); 
  estados: any[];
  cidades: any[];
  estadoSelecionado: number;
  
  formulario: FormGroup;
  
  constructor(private pessoasService: PessoasService,
              private errorHandler: ErrorHandlerService,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private formBuilder: FormBuilder ) { }

  ngOnInit() {
    this.title.setTitle('Nova Pessoa');
    const codigoPessoa = (this.route.snapshot.params['codigo'])
    
    this.carregarEstados();

    if(codigoPessoa) {
      this.carregarPessoa(codigoPessoa);
    }

    //this.configurarFormulario();
  }
  
  get editando() {
    return Boolean(this.pessoa.codigo);
   // reaticte form return Boolean(this.formulario.get('codigo').value);
  }


  carregarEstados() {
    this.pessoasService.listarEstados()
      .then(listaEstados => {
        this.estados = listaEstados.map(uf => ({ label: uf.nome, value: uf.codigo }) );
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarCidades() {
    this.pessoasService.pesquisarCidades(this.estadoSelecionado)
      .then(listaCidades => {
        this.cidades = listaCidades.map(c => ({ label: c.nome, value: c.codigo }) );
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
  
  /* Configuração para o reactive form(fromulario reativo)
  // Vai retornar o dados para ser exibido no metodo carregarPessoa()
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
        cidade: 
      
      }),
      contatos: this.formBuilder.array([]) // adicionando o contatos para exibição em master detail como um array de objects

    });
  } */

  carregarPessoa(codigo: number) {
   this.pessoasService.buscarPorCodigo(codigo)
    .then(pessoa => {
      this.pessoa = pessoa
      
      // Vai exibir o estado e a cidade depois de ser salvo
      this.estadoSelecionado = (this.pessoa.endereco.cidade) ? 
        this.pessoa.endereco.cidade.estado.codigo : null;
      if(this.estadoSelecionado) {
        this.carregarCidades();
      }
        
      // config de reative form - this.formulario.patchValue(pessoa); // Vai pegar o objeto pessoa jah existente do banco e xibir no tituloEdição
      this.atualizarTituloEdição();

     /* const contatosFormArray = this.formulario.get('contatos') as FormArray;
      this.pessoa.contatos.forEach(() => {
        contatosFormArray.push(this.criarFormGroupContato());
      }); 

      this.formulario.patchValue(this.pessoa); */ // vai pegar objeto pessoa com sua lista de contatos
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: any) {

    if(this.editando) {
      this.atualizarPessoa(form);
    } else {
      this.adicionarPessoa(form);
    }
  }

  adicionarPessoa(form: any) {
    
    this.pessoasService.adicionar(this.pessoa) // substituindo this.formulario.value por this.pessoa
      .then(pessoaAdicionado => {

        this.messageService.add({ severity: 'success', detail: 'Pessoa adicionada com sucesso' });
        
        this.router.navigate(['/pessoas', pessoaAdicionado.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: any) {
    form.reset(); // this.formulario

    setTimeout(function(){
      this.pessoa = new Pessoa();
    }.bind(this), 1);

    this.router.navigate(['/pessoas/novo']);

  }

  atualizarPessoa(form: any) {
    
    this.pessoasService.atualizar(this.pessoa) // this.formulario.value
      .then(pessoa => {
        this.pessoa = pessoa;
        //this.formulario.patchValue(pessoa);

        this.messageService.add({ severity: 'success', detail: 'Pessoa alterada com sucesso' });
        this.atualizarTituloEdição();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarTituloEdição() {
    this.title.setTitle('Edição de Pessoa: '+ this.pessoa.nome); // this.formulario.get('nome').value
  }


}

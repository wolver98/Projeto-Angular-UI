import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Lancamento } from './../../core/model';
import { PessoasService } from './../../pessoas/pessoas.service';
import { LancamentoService } from './../lancamento.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { Component, OnInit } from '@angular/core';
import { ToastyService } from 'ng2-toasty'; // substituindo o toastyService por MessageService do growl
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {
  
  tipos = [
    {label: 'Receita', value: 'RECEITA'},
    {label: 'Despesa', value: 'DESPESA'},

  ];

  categorias = [];
  pessoas = [];
  uploadEmAndamento = false;

  //lancamento = new Lancamento();
  formulario: FormGroup;


  constructor(private categoriaService: CategoriaService,
              private pessoasService: PessoasService,
              private lancamentoService: LancamentoService,
              private messageService: MessageService,
              private errorHandler: ErrorHandlerService,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private formBuilder: FormBuilder ) { }

  ngOnInit() {
    this.title.setTitle('Novo Lançamento'); // Vai exibir esse texto no titulo da pagina no browser
    const codigoLancamento = (this.route.snapshot.params['codigo']); // parametro codigo q vem la de appModule do path lancamentos
    
    if(codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();

    this.configurarFormulario();
    
  }

  // Vai fazer o upload do arquivo ou seja vai anexar o arquivo como em um email
  get urlUploadAnexo() {
    return this.lancamentoService.urlUploadAnexo();
  }
  
  // Metodo que vai exibir o progress spinner ao fazer o upload do arquivo
  antesUploadAnexo(event): Boolean {
    return this.uploadEmAndamento = true;
  }

  aoTerminarUploadAnexo(event) {
    this.uploadEmAndamento = true;
    const anexo = event.originalEvent.body;
     
    this.formulario.patchValue({
      anexo: anexo.nome, // vem do pacote dto Anexo na api
      urlAnexo: anexo.url
    });

    this.uploadEmAndamento = false;
  }

  erroUpload(event) {
    this.messageService.add({ severity: 'error', detail: 'Erro ao tentar enviar anexo!'});

    this.uploadEmAndamento = false;
  }
  
  removerAnexo() {
    this.formulario.patchValue({
      anexo: null,
      urlAnexo: null
    });
  }

  // Metodo que vai exibir somente o nome do arquivo retirando aquela qtde de numeros antes do _
  get nomeAnexo() {
    const nome = this.formulario.get('anexo').value;

    if(nome) {
      return nome.substring(nome.indexOf('_') + 1, nome.length);
    }

    return '';
  } 
  
  // Metodo para criar um formulario reativo
  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [], // Vazil quer dizer q naum precisa ser obrigatorio. Não tem campo para essa propiedada
      tipo: ['RECEITA', Validators.required], // null valor inicial
      dataVencimento: [null, Validators.required],
      dataPagamento: [],          // Não colocar () no metodo validarOr... para que venha ser validado direto quando inserir o valor no campo
      descricao: [null, [this.validarObrigatoriedade, this.validarTamanhoMínimo(5)] ], // substituindo Validators.minLength(5) pelo metodo de validação cost..
      valor: [null, Validators.required],
      pessoa: this.formBuilder.group({ // pessoa eh um objeto portanto novamente foi criado um formBuilder pra pessoa
        codigo: [null, Validators.required],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      observacao: [],
      anexo: [],
      urlAnexo: []
    });
  }
  
  // Metodo de validação costomizada, vai validar se o campo estah nulo
  // O null indica que vai dah um retorno que estah validado senao retorna a mensagem de validação 
  validarObrigatoriedade(input: FormControl) {
    return (input.value ? null : { obrigatoriedade: true });
  }
  
  /* Metodo de validação costomizada, vai validar o tamanho 
     mínimo do campo. O ? null retorna quando esta tudo validado senao retorna a mensagem de validação
     O !input.value vai dizer se não tiver valor no campo ele retorna validado ou seja null 
  */ 
  validarTamanhoMínimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: { tamanho: valor } };
    };
  }

  // Metodo para verificar quando eh edição de um lancamento ou novo objeto lancamento
  get editando() {
    //return Boolean(this.lancamento.codigo)
    return Boolean(this.formulario.get('codigo').value);
  }

  //Metodo para buscar o Lancamento jah existente pelo codigo e retornar os dados do lancamento existente
  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
    .then(lancamento => {
      // this.lancamento = lancamento; // Vai substituir a instancia de this.lancamento pelo objeto lancamento buscado como parametro 
      this.formulario.patchValue(lancamento); // substituindo a propriedade this.lancamneto por form.. o patchValue vai pegar os dados do objeto existente
      this.atualizarTituloEdicao();
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  carregarCategorias() {
    return this.categoriaService.listarCategorias()
    .then(categorias => {
      this.categorias = categorias.map(c => ({// O map vai retornar o array com os elementos novos que eh o label: e value:
         label: c.nome, value: c.codigo 
      }));
      
    })
    .catch(error => this.errorHandler.handle(error));
  }

  carregarPessoas() {
    return this.pessoasService.listarTodos()
    .then(pessoas => {
      this.pessoas = pessoas.content.map(p => ({
        label: p.nome, value: p.codigo
      }));
    
    })
    .catch(error => this.errorHandler.handle(error));
  } 
  
  salvar() { // sem tipo: FormControl para produção fazer para todos que tem FormControl tipado. Apagando o parametro form para uso do formulariuo reativo
    if(this.editando) {
      this.atualizarLancamento(); // Vai atualizar senao cadastra um novo lancamento
    } else {
      this.adicionarLancamento();
    }  

  }

  adicionarLancamento() {
    
    this.lancamentoService.adicionar(this.formulario.value) // Subistiuindo o this.lancamneto por this.formulario
    .then(lancamentoAdicionado => {
      this.messageService.add({ severity: 'success', detail: 'Lançamento adicionado com sucesso' });

      //form.reset();
      //this.lancamento = new Lancamento();
      this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarLancamento() {
    
    this.lancamentoService.atualizar(this.formulario.value)
    .then(lancamento => {
      this.formulario.patchValue(lancamento);

      this.messageService.add({ severity: 'success', detail: 'Lançamento alterado com sucesso' });
      this.atualizarTituloEdicao();
    })
    .catch(erro => this.errorHandler.handle(erro));
  }
  
  //Metodo para o botao nodo de cadastro lancamento para que o usuario decida ir para un novo lancamento jah na pagina de cadastro
  novo() { // removendo o parametro form para o uso do FormGroup
    this.formulario.reset();
    
    // Este metoto será executado 1 milisegundo depois do form.reset() para que o tipo = 'Receita' não seja apagado 
    setTimeout(function() {
      this.lancamento = new Lancamento();
    }.bind(this), 1); // this estah vinculando direto para esse cadastro.component para poder escutar o this.lancamento
  
    this.router.navigate(['/lancamentos/novo']);
  }

  atualizarTituloEdicao() {              // Substituindo o this.lancamento.descricao pelo this.formulario para o form reativo
    this.title.setTitle(`Edição de Lançamento: ${this.formulario.get('descricao').value}`);
  }

}

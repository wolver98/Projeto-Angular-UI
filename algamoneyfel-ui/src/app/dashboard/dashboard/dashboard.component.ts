import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  pieChartData: any;
  lineChartData: any;
  
  // Formatando os valores do tooltip com o atributo option 
  options = {
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const dataset = data.datasets[tooltipItem.datasetIndex]; 
          const valor = dataset.data[tooltipItem.index];
          const label = dataset.label ? (dataset.label + ': ') : '';

          return label + this.decimalPipe.transform(valor, '1.2-2'); // formatação do tipo number: 1.2-2
        }
      }
    }
  };

  constructor(private dashBoardService: DashboardService,
              private decimalPipe: DecimalPipe) { }

  ngOnInit() {
    this.configurarGraficoPizza();
    this.configuraGraficoLinha();
  }


  configurarGraficoPizza() {
    this.dashBoardService.lancamentosPorCategoria()
      .then(dados => {
        this.pieChartData =  { 
          labels: dados.map(dado => dado.categoria.nome), // Aqui vai tranformar um array de objetos em um array de String
          datasets: [ // Aqui não precisa ter os atributos label, borderColor para o gráfico pizza
            {
              data: dados.map(dado => dado.total),
              backgroundColor: ['#FF9900', '#109618', '#990099', '#3B3EAC',
                '#DD4477', '#3366CC', '#DC3912']
            }
          ]
        }
      });
  }

  configuraGraficoLinha() {
    this.dashBoardService.lancamentosPorDia()
      .then(dados => {
        const diasDoMes = this.configuraDiasMes();
        const totaisReceitas = this.totaisPorCadaDiaMes(
          dados.filter(dado => dado.tipo === 'RECEITA' ), diasDoMes)
        const totaisDespesas = this.totaisPorCadaDiaMes(
          dados.filter(dado => dado.tipo === 'DESPESA' ), diasDoMes)  
        
        this.lineChartData = {
          labels: diasDoMes,
          datasets: [ // Inserindo  o atributo label para especificar de receita e despesa
            {
              label: 'Receitas',
              data: totaisReceitas,
              borderColor: '#3366CC'
            },
            {
              label: 'Despesas',
              data: totaisDespesas,
              borderColor: '#D62B00'
            }
          ]
        }
      });
  }
  

  private totaisPorCadaDiaMes(dados, diasDoMes) {
    const totais: number[] = [];
    for(const dia of diasDoMes) {
      let total = 0; // vai retorna o total de dias

      for(const dado of dados) {
        if(dado.dia.getDate() === dia) {
          total = dado.total;

          break;
        }
      }
      
      totais.push(total);
    }

    return totais;
  }

  private configuraDiasMes() {
    const mesReferencia = new Date();
    mesReferencia.setMonth(mesReferencia.getMonth() + 1); // vai pular um mes ex janeiro para fevereiro
    mesReferencia.setDate(0); // Colocando 0 ele vai buscar no ultimo dia do mes anterior se e 29, 30 ou 31

    const quantidade = mesReferencia.getDate();

    const dias: number[] = [];

    for(let i = 1; i <= quantidade; i++) {
      dias.push(i);
    }

    return dias;
  }

}

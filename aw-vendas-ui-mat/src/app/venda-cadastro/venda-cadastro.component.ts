import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { VendasService } from '../vendas/vendas.service';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-venda-cadastro',
  templateUrl: './venda-cadastro.component.html',
  styleUrls: ['./venda-cadastro.component.css']
})
export class VendaCadastroComponent implements OnInit {

  colunasItem = ['produto', 'valor', 'quantidade', 'total'];
  venda: any;
  item: any;
  clientes: Array<any>;
  produtos: Array<any>;
  @Output() vendaSalva = new EventEmitter();
  @ViewChild('tabelaItens') tabelaItens: MatTable<any>;

  constructor(private vendaService: VendasService) { }

  ngOnInit() {
    this.vendaService.listarClientes()
      .subscribe(response => this.clientes = response);

    this.vendaService.listarProdutos()
      .subscribe(response => this.produtos = response);

    this.novaVenda();
  }

  novaVenda() {
    this.venda = { itens: [], frete: 0.0, total: 0.0 };
    this.item = {};
  }

  incluirItem() {
    this.item.total = (this.item.produto.valor * this.item.quantidade);

    this.venda.itens.push(this.item);

    this.tabelaItens.renderRows();

    this.item = {};

    this.calcularTotal();
  }

  calcularTotal() {
    const totalItens = this.venda.itens
      .map(i => (i.produto.valor * i.quantidade))
      .reduce((total, v) => total + v, 0);

    this.venda.total = totalItens + this.venda.frete;
  }

  adicionar(frm: FormGroup) {
    this.vendaService.adicionar(this.venda).subscribe(response => {
      frm.reset();

      this.novaVenda();

      this.vendaSalva.emit(response);
    });
  }

}

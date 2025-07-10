import { Component, inject, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IProduct, ProductStockOut } from 'src/app/models/product_model';
import { StockoutService } from 'src/app/services/stockout.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: false
})
export class FormComponent implements OnInit {

  @Input() productOut!: IProduct;
  @Input() opciones: any[] = [];

  costoUnitario: number = 0;
  cantidad: number = 0;
  listaPptos: string[] = [];
  selectedPPTO: string = '';
  pptoFiltrado: string[] = [];
  mostrarDropdown: boolean = false;
  fecha!: Date;


  private readonly modalCtrl = inject(ModalController);
  private readonly stockoutService = inject(StockoutService);

  ngOnInit(): void {
    this.stockoutService.getPPTOS().subscribe({
      next: (data) => this.listaPptos = [...data],
      error: (err) => console.log(err),
    })
  }

  cerrarModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  guardar() {
    this.modalCtrl.dismiss({
      idProducto: this.productOut?.idProducto,
      cantidad: this.cantidad,
      fecha: this.fecha,
      costoUnitario: this.costoUnitario || this.productOut.CostoUnitario,
      // usuario: 'JAVIER',
      ppto: this.selectedPPTO
    }, 'confirm');
  }

  filtrarPptos(event: any) {
    const valor = event.detail.value?.toLowerCase() || '';
    if (valor.length === 0) {
      this.mostrarDropdown = false;
      return;
    }

    this.pptoFiltrado = this.listaPptos.filter(ppto =>
      ppto.toLowerCase().includes(valor)
    );
    this.mostrarDropdown = this.pptoFiltrado.length > 0;
  }

  seleccionarPpto(item: string) {
    this.selectedPPTO = item;
    this.mostrarDropdown = false;
  }

}

import { Component, inject, OnInit } from '@angular/core';
import { IProduct, ProductsByCategory, ProductStockOut } from '../models/product_model';
import { AlertController, AlertInput, ModalController } from '@ionic/angular';
import { ProductsService } from '../services/products.service';
import { StockoutService } from '../services/stockout.service';
import { CartComponent } from './components/cart/cart.component';
import { StockoutRequest } from '../models/stockout_model';

@Component({
  selector: 'app-stockout',
  templateUrl: './stockout.page.html',
  styleUrls: ['./stockout.page.scss'],
  standalone: false
})
export class StockoutPage implements OnInit {

  private readonly productService = inject(ProductsService);
  private readonly alertController = inject(AlertController);
  private readonly stockOutService = inject(StockoutService);
  private readonly modalCtrl = inject(ModalController);

  products: ProductsByCategory = {}
  filteredProducts: ProductsByCategory = {}
  searchTerm: string = '';
  stockOutProduct: StockoutRequest = {
    idProducto: 0,
    cantidad: 0,
    ppto: '',
    usuario: ''
  };
  cart = this.stockOutService.cart;
  empresa = localStorage.getItem('empresa');

  ngOnInit() {
    this.productService.products$.subscribe(products => {
      this.products = products;
      this.filteredProducts = this.products;
    })

    this.productService.get_products();
  }


  searchProducts(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredProducts = Object.entries(this.products).reduce<ProductsByCategory>((acc, [categoria, productos]) => {
      const filtrados = productos.filter(product =>
        product.nombre.toLowerCase().includes(term)
      );

      if (filtrados.length > 0) {
        acc[categoria] = filtrados;
      }

      return acc;
    }, {});
  }

  resetList(): void {
    this.filteredProducts = this.products
  }

  async presentAlert(productOut: IProduct) {

    const inputs: any = [
      {
        type: 'text',
        name: 'nombre',
        value: productOut.nombre,
        disabled: true
      },
      {
        type: 'number',
        name: 'cantidad',
        placeholder: 'Cantidad',
        min: 1,
        max: 10000,
      },
      // {
      //   type: 'text',
      //   name: 'usuario',
      //   placeholder: 'Usuario',
      // },
    ];

    const alert = await this.alertController.create({
      header: 'Salida',
      subHeader: 'Ingresa la cantidad que va a salir:',
      inputs: inputs,
      cssClass: 'alert-styles',
      buttons: [
        {
          text: 'Añadir',
          role: 'confirm',
          handler: (data) => {
            this.stockOutProduct.idProducto = productOut.idProducto; // Convertir a número si es necesario
            this.stockOutProduct.cantidad = Number(data.cantidad); // Convertir a número si es necesario
            // this.stockOutProduct.usuario = data.usuario.trim();

            this.stockOutService.stockOutProduct(this.stockOutProduct).subscribe({
              next: (response) => this.openAlert('Exito', response.msg),
              error: err => this.openAlert('Error', err.error.detail),
            });
          },
        }
      ],
    });

    await alert.present();
    // console.log("Stock out: ", this.cart().length);

  }

  async openCart() {
    const modal = await this.modalCtrl.create({
      component: CartComponent,
      breakpoints: [0, .95],
      initialBreakpoint: .95,
    })

    await modal.present();
  }

  async openAlert(header: string, subheader: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subheader
    })

    await alert.present();
  }

  ionViewWillEnter() {
    this.empresa = localStorage.getItem('empresa');
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { IProduct, ProductStockOut } from '../models/product_model';
import { AlertController, AlertInput, ModalController } from '@ionic/angular';
import { ProductsService } from '../services/products.service';
import { StockoutService } from '../services/stockout.service';
import { CartComponent } from './components/cart/cart.component';

@Component({
  selector: 'app-stockout',
  templateUrl: './stockout.page.html',
  styleUrls: ['./stockout.page.scss'],
  standalone: false
})
export class StockoutPage implements OnInit {

  // private readonly modalCtrl = inject(ModalController);
  private readonly productService = inject(ProductsService);
  private readonly alertController = inject(AlertController);
  private readonly stockOutService = inject(StockoutService);
  private readonly modalCtrl = inject(ModalController);

  products: IProduct[] = []
  filteredProducts: IProduct[] = []
  searchTerm: string = '';
  stockOutProduct: ProductStockOut = {
    idProducto: 0,
    cantidad: 0,
    nombre: ''
  };
  cart = this.stockOutService.cart;

  ngOnInit() {
    this.productService.products$.subscribe(products => {
      this.products = products;
      this.filteredProducts = this.products;
    })

    this.productService.get_products();
  }


  searchProducts(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.nombre.toLowerCase().includes(term)
    );
  }

  resetList(): void {
    this.filteredProducts = this.products
  }

  async presentAlert(productOut: IProduct) {

    const input: any = [
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
    }];

    const alert = await this.alertController.create({
      header: 'Salida',
      subHeader: 'Ingresa la cantidad que va a salir:',
      inputs: input,
      buttons: [
        {
          text: 'Añadir',
          role: 'confirm',
          handler: (data) => {            
            this.stockOutProduct.idProducto = productOut.idProducto; // Convertir a número si es necesario
            this.stockOutProduct.cantidad = Number(data.cantidad); // Convertir a número si es necesario
            this.stockOutProduct.nombre = productOut.nombre;

            this.stockOutService.addProduct({...this.stockOutProduct})
          },
        }
      ],
    });

    await alert.present();
    console.log("Stock out: ", this.cart().length);

  }

  async openCart()
  {
    const modal = await this.modalCtrl.create({
         component: CartComponent,
         breakpoints: [ 0, .95],
         initialBreakpoint: .95,
       })
   
       await modal.present();
  }
}

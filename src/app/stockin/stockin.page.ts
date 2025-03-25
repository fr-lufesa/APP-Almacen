import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormComponent } from './components/form/form.component';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product_model';

@Component({
  selector: 'app-stockin',
  templateUrl: './stockin.page.html',
  styleUrls: ['./stockin.page.scss'],
  standalone: false
})
export class StockinPage implements OnInit {

  private readonly modalCtrl = inject(ModalController);
  private readonly productService = inject(ProductsService);

  products: Product[] = []
  productsFiletered: Product[] = []
  searchTerm: string = '';

  ngOnInit() {
    this.productService.products$.subscribe(products => {
      this.products = products;
      this.productsFiletered = this.products;
    })

    this.productService.get_products();

  }

  async addProduct(){
    const modal = await this.modalCtrl.create({
      component: FormComponent,
      breakpoints: [ 0, .95],
      initialBreakpoint: .95,
    })

    modal.present();


  }

  searchProducts(): void {
    const term = this.searchTerm.toLowerCase();
    this.productsFiletered = this.products.filter(product =>
      product.nombre.toLowerCase().includes(term)
    );
  }

  resetList(): void{
    this.productsFiletered = this.products
  }

  async editStock(product: Product){
    const modal = await this.modalCtrl.create({
      component: FormComponent,
      breakpoints: [ 0, .95],
      initialBreakpoint: .95,
      componentProps: { product }
    })

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      console.log('Producto modificado o nuevo:', data);
      // puedes llamar a tu servicio para actualizar/crear el producto
    }
  }
}

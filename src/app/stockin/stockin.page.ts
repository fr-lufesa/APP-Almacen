import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormComponent } from './components/form/form.component';
import { ProductsService } from '../services/products.service';
import { IProduct } from '../models/product_model';

@Component({
  selector: 'app-stockin',
  templateUrl: './stockin.page.html',
  styleUrls: ['./stockin.page.scss'],
  standalone: false
})
export class StockinPage implements OnInit {

  private readonly modalCtrl = inject(ModalController);
  private readonly productService = inject(ProductsService);

  products: IProduct[] = []
  filteredProducts: IProduct[] = []
  searchTerm: string = '';

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

  resetList(): void{
    this.filteredProducts = this.products
  }

  async editStock(product: IProduct){
    const modal = await this.modalCtrl.create({
      component: FormComponent,
      breakpoints: [ 0, .95],
      initialBreakpoint: .95,
      componentProps: { product, isStockin: true}
    })

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      console.log('Producto modificado o nuevo:', data);
    }
  }
}

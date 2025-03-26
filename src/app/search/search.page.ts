import { Component, inject, OnInit } from '@angular/core';
import { FormComponent } from '../stockin/components/form/form.component';
import { IProduct } from '../models/product_model';
import { ModalController } from '@ionic/angular';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false
})
export class SearchPage implements OnInit {

  private readonly productService = inject(ProductsService);
  private readonly modalCtrl = inject(ModalController);

  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
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

  resetList(): void {
    this.filteredProducts = this.products
  }

  async addProduct() {
    const modal = await this.modalCtrl.create({
      component: FormComponent,
      breakpoints: [0, .95],
      initialBreakpoint: .95,
      componentProps: {isNew: true}
    })

    modal.present();
  }

  async editProduct(product: IProduct) {
    const modal = await this.modalCtrl.create({
      component: FormComponent,
      breakpoints: [0, .95],
      initialBreakpoint: .95,
      componentProps: { product, isEdit: true }
    })

    await modal.present();
  }

}

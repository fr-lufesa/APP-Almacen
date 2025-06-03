import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormComponent } from './components/form/form.component';
import { ProductsService } from '../services/products.service';
import { IProduct, ProductsByCategory } from '../models/product_model';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-stockin',
  templateUrl: './stockin.page.html',
  styleUrls: ['./stockin.page.scss'],
  standalone: false,
})
export class StockinPage implements OnInit {
  private readonly modalCtrl = inject(ModalController);
  private readonly productService = inject(ProductsService);

  products: ProductsByCategory = {};
  filteredProducts: ProductsByCategory = {};
  searchTerm: string = '';
  empresa = localStorage.getItem('empresa');
  urlBase = environment.url;
  expandedCategories: string[] = [];

  ngOnInit() {
    this.productService.products$.subscribe((products) => {
      this.products = products;
      this.filteredProducts = this.products;
    });

    this.productService.get_products();
  }

  searchProducts(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredProducts = Object.entries(
      this.products
    ).reduce<ProductsByCategory>((acc, [categoria, productos]) => {
      const filtrados = productos.filter((product) =>
        product.nombre.toLowerCase().includes(term)
      );

      if (filtrados.length > 0) {
        acc[categoria] = filtrados;
      }

      return acc;
    }, {});

    this.expandedCategories = Object.keys(this.filteredProducts);
  }

  resetList(): void {
    this.filteredProducts = this.products;
  }

  async editStock(product: IProduct) {
    const modal = await this.modalCtrl.create({
      component: FormComponent,
      breakpoints: [0, 0.95],
      initialBreakpoint: 0.95,
      componentProps: { product, isStockin: true },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      console.log('Producto modificado o nuevo:', data);
    }
  }

  ionViewWillEnter() {
    this.empresa = localStorage.getItem('empresa');
  }
}
